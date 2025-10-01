"use client";

import { useEffect, useState } from "react";

interface UserSettings {
  mistralApiKey?: string;
  postgresUrl?: string;
}

interface SettingsFormProps {
  onSettingsUpdate?: (settings: UserSettings) => void;
}

export default function SettingsForm({ onSettingsUpdate }: SettingsFormProps) {
  const [settings, setSettings] = useState<UserSettings>({
    mistralApiKey: "",
    postgresUrl: "",
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const hasSettings = settings.mistralApiKey && settings.postgresUrl;

  useEffect(() => {
    const loadSettingsOnMount = async () => {
      try {
        const response = await fetch("/api/settings");
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
          if (!data.mistralApiKey || !data.postgresUrl) {
            setIsOpen(true);
          }
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };
    loadSettingsOnMount();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage("Settings saved successfully!");
        onSettingsUpdate?.(settings);
        setTimeout(() => setMessage(""), 3000);
        setIsOpen(false);
      } else {
        setMessage("Failed to save settings");
      }
    } catch (error) {
      setMessage("Error saving settings");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscKey);
    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`px-2 py-2 cursor-pointer rounded-lg font-medium transition-colors bg-black text-white hover:bg-slate-800`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-settings-icon lucide-settings"
        >
          <title>settings</title>
          <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900">
                SQL Editor User Settings
              </h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="mistralApiKey"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Mistral API Key
                </label>
                <input
                  type="password"
                  id="mistralApiKey"
                  value={settings.mistralApiKey || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, mistralApiKey: e.target.value })
                  }
                  placeholder="Enter your Mistral API key"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Required for AI-powered features
                </p>
              </div>

              <div>
                <label
                  htmlFor="postgresUrl"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  PostgreSQL Connection URL
                </label>
                <input
                  type="password"
                  id="postgresUrl"
                  value={settings.postgresUrl || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, postgresUrl: e.target.value })
                  }
                  placeholder="postgresql://user:password@host:port/database"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Required for database operations
                </p>
              </div>

              {message && (
                <div
                  className={`p-3 rounded-md text-sm ${
                    message.includes("successfully")
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {message}
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  disabled={!hasSettings || isLoading}
                  type="submit"
                  className="cursor-pointer flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
                >
                  {isLoading ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
