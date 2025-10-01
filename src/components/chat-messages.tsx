import type { ModelMessage } from "ai";
import { SQLQueryDisplay } from "@/components/sql-query-display";

export type AssistantMessage = {
  role: string;
  content:
    | string
    | { sqlQuery: string; sqlQueryTitle: string; explanation: string };
};

interface UserMessageProps {
  message: ModelMessage;
}

interface AIMessageProps {
  message: AssistantMessage;
  mostRecent?: boolean;
  onRetry?: () => void;
  onLoadToEditor?: (query: string) => void;
}

export const UserMessage = ({ message }: UserMessageProps) => {
  return (
    <div className="p-4 border-b border-slate-200 flex justify-end">
      <p className="bg-slate-100 text-slate-700 px-4 py-2 rounded-md text-sm max-w-fit">
        {typeof message.content === "string" && message.content}
      </p>
    </div>
  );
};

export const AIMessage = ({
  message,
  mostRecent = false,
  onRetry,
  onLoadToEditor,
}: AIMessageProps) => {
  if (typeof message.content === "string" && mostRecent) {
    return (
      <div className="p-4 border-b border-slate-200 flex items-center gap-2">
        <p className="bg-slate-100 text-red-700 px-4 py-2 rounded-md text-sm max-w-fit whitespace-pre-wrap">
          {message.content}
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="cursor-pointer bg-slate-200 hover:bg-slate-300 text-slate-500 px-3 py-1 rounded text-xs flex flex-col items-center justify-center h-full"
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
            >
              <title>retry</title>
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
            </svg>
          </button>
        )}
      </div>
    );
  }

  if (
    typeof message.content === "object" &&
    message.content.sqlQuery &&
    message.content.explanation &&
    message.content.sqlQueryTitle
  ) {
    return (
      <div
        key={JSON.stringify(message.content)}
        className="p-4 border-b border-slate-200 space-y-2 text-slate-500"
      >
        <SQLQueryDisplay
          sqlQuery={message.content.sqlQuery}
          sqlQueryTitle={message.content.sqlQueryTitle}
          onLoadToEditor={onLoadToEditor || (() => {})}
        />
        <p className="text-slate-800 text-sm">{message.content.explanation}</p>
      </div>
    );
  }

  return null;
};
