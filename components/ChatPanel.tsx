"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Call, useCallStateHooks } from "@stream-io/video-react-sdk";
import { LanguageSelect } from "./LanguageSelect";
import { useLanguage } from "@/hooks/useLanguage";

declare global {
  interface Window {
    __chatTransCache?: Map<string, string>;
  }
}

type ChatEvent = {
  type: "chat.msg";
  data: {
    id: string;
    text: string;
    senderId: string;
    senderName?: string;
    at: number; // epoch ms
  };
};

function isChatEvent(evt: unknown): evt is ChatEvent {
  if (typeof evt !== "object" || evt === null) return false;
  const obj = evt as Record<string, unknown>;
  if (obj.type !== "chat.msg") return false;
  const data = obj.data as Record<string, unknown> | undefined;
  return !!(
    data &&
    typeof data.id === "string" &&
    typeof data.text === "string" &&
    typeof data.senderId === "string" &&
    (typeof data.senderName === "string" ||
      typeof data.senderName === "undefined") &&
    typeof data.at === "number"
  );
}

type Row = {
  id: string;
  text: string;
  translated?: string;
  senderId: string;
  senderName?: string;
  at: number;
};

export function ChatPanel({ call }: { call: Call }) {
  const { useLocalParticipant, useParticipants } = useCallStateHooks();
  const me = useLocalParticipant();
  const participants = useParticipants();
  const { lang, setLang } = useLanguage();
  const [rows, setRows] = useState<Row[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const meName = useMemo(
    () => me?.name || me?.userId || "Me",
    [me?.name, me?.userId]
  );

  const nameOf = (uid: string) =>
    participants.find((p) => p.userId === uid)?.name || uid;

  // autoscroll on new message
  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [rows.length]);

  // listen for incoming messages
  useEffect(() => {
    const off = call.on("custom", async (evt: unknown) => {
      if (!isChatEvent(evt)) return;
      const { id, text, senderId, senderName, at } = evt.data;

      // add row with original
      setRows((prev) =>
        prev.some((r) => r.id === id)
          ? prev
          : [...prev, { id, text, senderId, senderName, at }]
      );

      // translate for my language (cache by pair to reduce calls)
      const key = `${lang}::${text}`;
      const cached = window.__chatTransCache?.get(key);
      if (cached) {
        setRows((prev) =>
          prev.map((r) => (r.id === id ? { ...r, translated: cached } : r))
        );
        return;
      }

      try {
        const res = await fetch(
          `/api/translate?to=${encodeURIComponent(lang)}&q=${encodeURIComponent(text)}`
        );
        const json: { text?: string } = await res.json();
        const translated = json.text || text;

        window.__chatTransCache =
          window.__chatTransCache || new Map<string, string>();
        window.__chatTransCache.set(key, translated);

        setRows((prev) =>
          prev.map((r) => (r.id === id ? { ...r, translated } : r))
        );
      } catch {
        // fallback: show original only
      }
    });
    return () => off();
  }, [call, lang]);

  async function send() {
    const text = input.trim();
    if (!text || !me?.userId) return;
    setBusy(true);
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const at = Date.now();

    // optimistic add (will also be received by me via event)
    setRows((prev) => [
      ...prev,
      { id, text, senderId: me.userId!, senderName: meName, at },
    ]);
    setInput("");

    try {
      await call.sendCustomEvent({
        type: "chat.msg",
        data: { id, text, senderId: me.userId, senderName: meName, at },
      });
    } finally {
      setBusy(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  }

  return (
    <div className="h-full flex flex-col bg-gray-800 border-l border-gray-700 w-full lg:w-[360px]">
      <div className="px-3 py-2 flex items-center gap-2 border-b border-gray-700">
        <h3 className="text-white font-semibold">Chat</h3>
        <div className="ml-auto flex items-center gap-2 text-xs text-gray-300">
          <span>Display in</span>
          <LanguageSelect value={lang} onChange={setLang} />
        </div>
      </div>

      <div ref={listRef} className="flex-1 overflow-y-auto p-3 space-y-2">
        {rows
          .sort((a, b) => a.at - b.at)
          .map((r) => (
            <div key={r.id} className="bg-gray-700 rounded-lg p-2">
              <div className="text-[11px] text-gray-300 mb-1">
                <b>{r.senderName || nameOf(r.senderId)}</b>{" "}
                <span className="opacity-70">
                  {new Date(r.at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              {r.translated && r.translated !== r.text ? (
                <>
                  <div className="text-white text-sm whitespace-pre-wrap break-words">
                    {r.translated}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1 italic">
                    Original: {r.text}
                  </div>
                </>
              ) : (
                <div className="text-white text-sm whitespace-pre-wrap break-words">
                  {r.text}
                </div>
              )}
            </div>
          ))}
      </div>

      <div className="p-3 border-t border-gray-700 flex gap-2">
        <input
          className="flex-1 bg-gray-900 text-white text-sm rounded-lg px-3 py-2 outline-none border border-gray-700"
          placeholder="Type a message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <button
          onClick={send}
          disabled={busy || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm px-3 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
