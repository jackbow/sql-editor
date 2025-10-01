"use client";
import Editor from "@monaco-editor/react";
import { clsx } from "clsx";
import {
  type CompletionRegistration,
  type Monaco,
  registerCompletion,
  type StandaloneCodeEditor,
} from "monacopilot";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useMonaco } from "@/components/monaco-context";

export interface QueryEditorProps {
  codeRunning: boolean;
  onRunQuery: () => void;
  defaultCode?: string;
}

export interface QueryEditorRef {
  getEditorValue: () => string | undefined;
  setEditorValue: (value: string) => void;
}

export const QueryEditor = forwardRef<QueryEditorRef, QueryEditorProps>(
  (
    {
      codeRunning,
      onRunQuery,
      defaultCode = "-- Write a SQL query to get started\n",
    },
    ref,
  ) => {
    const monacoRef = useRef<Monaco | undefined>(undefined);
    const editorRef = useRef<StandaloneCodeEditor | undefined>(undefined);
    const completionRef = useRef<CompletionRegistration | null>(null);
    const { setMonaco } = useMonaco();

    const handleEditorDidMount = (
      editor: StandaloneCodeEditor,
      monaco: Monaco,
    ) => {
      editor.revealLine(1);
      monacoRef.current = monaco;
      editorRef.current = editor;
      setMonaco(monaco);
      completionRef.current = registerCompletion(monaco, editor, {
        endpoint: "/api/completions",
        language: "sql",
      });
    };

    useEffect(() => {
      return () => {
        completionRef.current?.deregister();
      };
    }, []);

    // Expose methods via imperative handle
    useImperativeHandle(ref, () => ({
      getEditorValue: () => editorRef.current?.getValue(),
      setEditorValue: (value: string) => {
        if (editorRef.current) {
          editorRef.current.setValue(value);
        }
      },
    }));

    return (
      <div className="flex-1 bg-slate-50 relative">
        <Editor
          defaultLanguage="sql"
          onMount={handleEditorDidMount}
          defaultValue={defaultCode}
          line={100}
        />
        <div className="absolute pr-6 pb-4 bottom-0 right-0 flex justify-end z-10">
          <button
            type="submit"
            disabled={codeRunning}
            className={clsx(
              !codeRunning && "hover:bg-slate-800",
              "cursor-pointer bg-black disabled:opacity-40 disabled:cursor-progress text-white px-4 py-2 rounded-md flex items-center gap-2",
            )}
            onClick={onRunQuery}
            aria-label={
              codeRunning ? "Running SQL query, please wait" : "Run SQL query"
            }
          >
            {codeRunning && <LoadingSpinner size="sm" className="text-white" />}
            {codeRunning ? "Running..." : "Run query"}
          </button>
        </div>
      </div>
    );
  },
);

QueryEditor.displayName = "QueryEditor";
