"use client";
import { useEffect, useState } from "react";

export function useLanguage(defaultLang?: string) {
  const initial =
    defaultLang ||
    (typeof navigator !== "undefined"
      ? navigator.language?.split("-")[0] || "en"
      : "en");

  const [lang, setLang] = useState<string>(initial);

  useEffect(() => {
    const saved = localStorage.getItem("chat_lang");
    if (saved) setLang(saved);
  }, []);

  const update = (l: string) => {
    setLang(l);
    localStorage.setItem("chat_lang", l);
  };

  return { lang, setLang: update };
}
