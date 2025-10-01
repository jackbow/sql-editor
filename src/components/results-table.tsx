import { LoadingSpinner } from "@/components/loading-spinner";
import { ErrorIcon } from "@/components/icons";
import type { TableData } from "@/types";

interface ResultsTableProps {
  tableData: TableData | undefined;
  queryError: string | undefined;
  codeRunning: boolean;
}

export const ResultsTable = ({
  tableData,
  queryError,
  codeRunning,
}: ResultsTableProps) => {
  if (queryError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md m-4">
        <div className="flex items-center">
          <ErrorIcon className="w-5 h-5 text-red-400 mr-2" />
          <h3 className="text-sm font-medium text-red-800">Query Error</h3>
        </div>
        <div className="mt-2">
          <p className="text-sm text-red-700 font-mono whitespace-pre-wrap">
            {queryError}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-slate-200 overflow-x-auto">
      <table
        className="min-w-full text-sm font-mono border-collapse"
        aria-label="SQL query results"
      >
        <thead className="bg-slate-100">
          <tr>
            {tableData?.fields?.map((field) => (
              <th
                key={field.name}
                className="px-4 py-2 text-left text-slate-600 whitespace-nowrap border border-slate-200"
                scope="col"
              >
                {field.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {tableData?.rows?.length ? (
            tableData.rows.map((row, index) => {
              const firstField = tableData.fields[0];
              const firstValue = firstField ? row[firstField.name] : "";
              const rowKey = `row-${index}-${firstValue}`.slice(0, 50); // Limit length
              return (
                <tr key={rowKey} className="border-t border-slate-100">
                  {tableData.fields.map((field) => (
                    <td
                      key={field.name}
                      className="px-4 py-2 text-slate-600 whitespace-nowrap border border-slate-200"
                    >
                      {row[field.name]?.toString() ?? ""}
                    </td>
                  ))}
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                className="px-4 py-2 text-slate-400 border border-slate-200"
                colSpan={tableData?.fields?.length ?? 1}
              >
                {codeRunning ? (
                  <div className="flex items-center justify-center gap-2 py-4">
                    <LoadingSpinner size="sm" />
                    <span>Running query...</span>
                  </div>
                ) : (
                  "No data"
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
