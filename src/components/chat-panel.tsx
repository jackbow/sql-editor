import type { ModelMessage } from "ai";
import { useState } from "react";
import {
    AIMessage,
    type AssistantMessage,
    UserMessage,
} from "@/components/chat-messages";

interface ChatPanelProps {
    messages: (ModelMessage | AssistantMessage)[];
    onSendMessage: (message: string) => void;
    onRetry: () => void;
    onLoadToEditor: (query: string) => void;
}

export const ChatPanel = ({
    messages,
    onSendMessage,
    onRetry,
    onLoadToEditor,
}: ChatPanelProps) => {
    const [userMessage, setUserMessage] = useState("");

    const handleSubmit = () => {
        if (userMessage.trim()) {
            onSendMessage(userMessage);
            setUserMessage("");
        }
    };

    return (
        <div className="max-w-96 w-96 border-l border-slate-200 flex flex-col h-full">
            <div
                className="flex-1 overflow-y-auto flex flex-col-reverse"
                role="log"
                aria-label="Chat conversation"
                aria-live="polite"
            >
                {[...messages].reverse().map((message, i) => {
                    const messageKey = `${message.role}-${i}-${typeof message.content === 'string' ? message.content.slice(0, 50) : 'structured'}`;
                    if (message.role === "user")
                        return (
                            <UserMessage
                                key={messageKey}
                                message={message as ModelMessage}
                            />
                        );
                    if (message.role === "assistant")
                        return (
                            <AIMessage
                                key={messageKey}
                                message={message as AssistantMessage}
                                mostRecent={i === 0}
                                onRetry={onRetry}
                                onLoadToEditor={onLoadToEditor}
                            />
                        );
                    return null;
                })}
            </div>
            <div className="p-4 border-t border-slate-200">
                <div className="flex items-center">
                    <textarea
                        placeholder={messages.length === 0 ? "Ask AI" : "Ask a follow up question"}
                        className="flex-1 text-slate-800 border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                        value={userMessage}
                        rows={1}
                        style={{
                            minHeight: "40px",
                            maxHeight: "160px",
                            overflow: "hidden",
                        }}
                        onChange={(e) => {
                            setUserMessage(e.target.value);
                            const textarea = e.target;
                            textarea.style.height = "auto";
                            textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                        onInput={(e) => {
                            const textarea = e.currentTarget;
                            textarea.style.height = "auto";
                            textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
                        }}
                        aria-label="Type your message to AI"
                    />
                    <button
                        type="button"
                        className="cursor-pointer ml-2 bg-green-500 text-white p-2 rounded-full hover:bg-green-600"
                        disabled={!userMessage.trim()}
                        onClick={handleSubmit}
                        aria-label="Send message to AI"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <title>Send message</title>
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 10l7-7m0 0l7 7m-7-7v18"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};
