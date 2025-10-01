import { useState } from "react";
import { CheckIcon, CopyIcon, PlayIcon, SqlIcon } from "@/components/icons";
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
  const [isCopied, setIsCopied] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-md">
      <div className="flex items-center justify-between border-b border-slate-200 w-full p-2">
        <div className="flex items-center gap-1 ">
          <SqlIcon />
          <span className="text-xs font-semibold">{sqlQueryTitle}</span>
        </div>
        <div className="flex space-x-1">
          <button
            type="button"
            className=" hover:text-slate-800"
            onClick={() => onLoadToEditor(sqlQuery)}
          >
            <PlayIcon />
          </button>
          <button
            type="button"
            className=" hover:text-slate-800"
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(sqlQuery).then(() => {
                  setIsCopied(true);
                  setTimeout(() => {
                    setIsCopied(false);
                  }, 2000);
                });
              }
            }}
            id="copyButton"
          >
            {isCopied ? <CheckIcon /> : <CopyIcon />}
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
