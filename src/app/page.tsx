"use client";
import type { ModelMessage } from "ai";
import { useRef, useState } from "react";
import type { AssistantMessage } from "@/components/chat-messages";
import { ChatPanel } from "@/components/chat-panel";
import { ErrorBoundary } from "@/components/error-boundary";
import { MonacoProvider } from "@/components/monaco-context";
import { QueryEditor, type QueryEditorRef } from "@/components/query-editor";
import { ResultsTable } from "@/components/results-table";
import SettingsForm from "@/components/settings-form";
import type { TableData } from "@/types";

export default function Home() {
  const editorRef = useRef<QueryEditorRef>(null);

  const [codeRunning, setCodeRunning] = useState(false);
  const [aiLoading, setAILoading] = useState(false);
  const [tableData, setTableData] = useState<TableData | undefined>(undefined);
  const [queryError, setQueryError] = useState<string | undefined>(undefined);

  const [messages, setMessages] = useState<(ModelMessage | AssistantMessage)[]>(
    [],
  );
  const askAI = async (options?: { retry?: boolean; messages?: (ModelMessage | AssistantMessage)[] }) => {
    let currentMessages = [...messages];
    if (options?.retry) {
      currentMessages = currentMessages.slice(0, -1);
    } else if (options?.messages) {
      currentMessages = options.messages;
    }
    setAILoading(true);
    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: currentMessages
            .filter(
              (m) =>
                !(
                  m.role === "assistant" &&
                  typeof m.content === "string" &&
                  m.content.startsWith("Error:")
                ),
            )
            .slice(-10)
            .map((m) =>
              m.role === "assistant"
                ? { ...m, content: JSON.stringify(m.content) }
                : m,
            ),
        }),
      });
      if (!resp.ok) {
        try {
          const data = await resp.json();
          setMessages([
            ...currentMessages,
            {
              role: "assistant",
              content: `Error: ${data.error || "Failed to get valid response from AI."}`,
            },
          ]);
        } catch (_) {
          setMessages([
            ...currentMessages,
            {
              role: "assistant",
              content: "Error: Failed to get valid response from AI.",
            },
          ]);
        }
        return;
      }
      const data = await resp.json();
      setMessages([...currentMessages, { role: "assistant", content: data }]);
    } finally {
      setAILoading(false);
    }
  };

  const handleSendMessage = (message: string) => {
    const newMessages = [...messages, { role: "user", content: message }];
    setMessages(newMessages);
    askAI({ messages: newMessages });
  };

  const handleRetry = () => askAI({ retry: true });

  const runSQL = (query?: string) => {
    if (!query && !editorRef.current) {
      return;
    }
    setCodeRunning(true);
    setQueryError(undefined);
    setTableData(undefined);
    const code = query ? query : editorRef?.current?.getEditorValue();
    fetch("/api/querydb", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sql: code }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setQueryError(
            data.error || "An error occurred while executing the query",
          );
          setTableData(undefined);
        } else {
          setTableData(data);
          setQueryError(undefined);
        }
        setCodeRunning(false);
      })
      .catch((err) => {
        setCodeRunning(false);
        setQueryError(err.message || "Network error occurred");
        setTableData(undefined);
      });
  };

  const handleLoadToEditor = (query: string) => {
    if (editorRef.current) {
      editorRef.current.setEditorValue(query);
    }
  };

  return (
    <ErrorBoundary>
      <MonacoProvider>
        <div className="flex flex-col h-screen bg-white relative">
          <div className="absolute top-0 right-0 p-4 z-20">
            <SettingsForm />
          </div>
          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 flex flex-col border-r border-slate-200 min-w-0">
              <QueryEditor
                codeRunning={codeRunning}
                onRunQuery={() => runSQL()}
                ref={editorRef}
              />
              <div className="flex-1 overflow-auto">
                <ResultsTable
                  tableData={tableData}
                  queryError={queryError}
                  codeRunning={codeRunning}
                />
              </div>
            </div>
            <ChatPanel
              messages={messages}
              onSendMessage={handleSendMessage}
              onRetry={handleRetry}
              onLoadToEditor={handleLoadToEditor}
              isLoading={aiLoading}
            />
          </div>
        </div>
      </MonacoProvider>
    </ErrorBoundary>
  );
}
