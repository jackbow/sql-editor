import { useMonaco } from "@/components/monaco-context";

interface SQLQueryDisplayProps {
  sqlQuery: string;
  sqlQueryTitle: string;
  onLoadToEditor: (query: string) => void;
}

export const SQLQueryDisplay = ({
  sqlQuery,
  sqlQueryTitle,
  onLoadToEditor,
}: SQLQueryDisplayProps) => {
  const { monaco } = useMonaco();

  return (
    <div className="bg-white border border-slate-200 rounded-md">
      <div className="flex items-center justify-between border-b border-slate-200 w-full p-2">
        <div className="flex items-center gap-1 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
          >
            <title>SQL</title>
            <g fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12Z" />
              <path
                strokeLinecap="round"
                d="M8.415 10A1.5 1.5 0 1 0 7 12a1.5 1.5 0 1 1-1.415 2m6.915 1a1.5 1.5 0 0 1-1.5-1.5v-3a1.5 1.5 0 0 1 3 0v3a1.5 1.5 0 0 1-1.5 1.5Zm0 0l1.5 1.5M16.5 9v4c0 .943 0 1.414.293 1.707S17.557 15 18.5 15"
              />
            </g>
          </svg>
          <span className="text-xs font-semibold">{sqlQueryTitle}</span>
        </div>
        <div className="flex space-x-1">
          <button
            type="button"
            className=" hover:text-slate-800"
            onClick={() => onLoadToEditor(sqlQuery)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-play-icon lucide-play"
            >
              <title>run</title>
              <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
            </svg>
          </button>
          <button
            type="button"
            className=" hover:text-slate-800"
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(sqlQuery).then(() => {
                  const button = document.getElementById("copyButton");
                  if (button) {
                    const originalHTML = button.innerHTML;
                    button.innerHTML = `
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <title>copied!</title>
                          <path d="M20 6L9 17l-5-5"/>
                          </svg>
                        `;
                    setTimeout(() => {
                      button.innerHTML = originalHTML;
                    }, 2000);
                  }
                });
              }
            }}
            id="copyButton"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-copy-icon lucide-copy"
            >
              <title>copy</title>
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
          </button>
        </div>
      </div>
      <div className="font-mono text-xs text-slate-700 p-2 overflow-auto">
        <div
          ref={(el) => {
            if (el && sqlQuery && monaco) {
              monaco.editor.colorize(sqlQuery, "sql", {}).then((html) => {
                el.innerHTML = html;
              });
            }
          }}
        ></div>
      </div>
    </div>
  );
};
