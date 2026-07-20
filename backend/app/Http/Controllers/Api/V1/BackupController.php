<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Backup;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BackupController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Backup::with('creator')->orderBy('created_at', 'desc')->get());
    }

    public function create(Request $request): JsonResponse
    {
        $filename = 'backup-' . now()->format('Y-m-d-His') . '.sql';

        $backupDir = storage_path('app/backups');
        if (!is_dir($backupDir)) mkdir($backupDir, 0755, true);
        $dest = $backupDir . '/' . $filename;

        $tables = DB::select('SHOW TABLES');
        $sql = '';

        foreach ($tables as $table) {
            $tableName = current((array) $table);
            $createTable = DB::select("SHOW CREATE TABLE `{$tableName}`");
            $createStmt = current((array) current($createTable));
            $sql .= $createStmt . ";\n\n";

            $rows = DB::table($tableName)->get();
            foreach ($rows as $row) {
                $row = (array) $row;
                $columns = implode('`, `', array_keys($row));
                $values = implode("', '", array_map(function ($val) {
                    return str_replace("'", "\\'", $val ?? 'NULL');
                }, $row));
                $sql .= "INSERT INTO `{$tableName}` (`{$columns}`) VALUES ('{$values}');\n";
            }
            $sql .= "\n";
        }

        file_put_contents($dest, $sql);

        $backup = Backup::create([
            'filename' => $filename,
            'size' => filesize($dest),
            'created_by' => $request->user()->id,
        ]);

        return response()->json($backup, 201);
    }

    public function destroy(Backup $backup): JsonResponse
    {
        $path = storage_path('app/backups/' . $backup->filename);
        if (file_exists($path)) unlink($path);
        $backup->delete();
        return response()->json(['message' => 'Backup deleted.']);
    }
}
