import type { ReactNode } from 'react';

interface Column {
  key: string;
  label: string;
  render?: (item: any) => ReactNode;
}

export function DataTable({ columns, data, loading }: { columns: Column[]; data: any[]; loading?: boolean }) {
  if (loading) return <div className="text-center py-8 text-slate-400">Loading...</div>;
  if (!data.length) return <div className="text-center py-8 text-slate-400">No data found</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 font-medium text-slate-600">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={item.id || i} className="border-b last:border-0 hover:bg-slate-50">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-slate-700">
                  {col.render ? col.render(item) : item[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
