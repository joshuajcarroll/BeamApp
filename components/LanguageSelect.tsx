// components/LanguageSelect.tsx
"use client";
import React from "react";

const LANGS = [
  ["en", "English"],
  ["es", "Español"],
  ["fr", "Français"],
  ["de", "Deutsch"],
  ["ru", "Русский"],
  ["uk", "Українська"],
  ["it", "Italiano"],
  ["pt", "Português"],
  ["pl", "Polski"],
];

export function LanguageSelect({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <select
      aria-label="Chat language"
      className={`bg-gray-900 text-white text-sm rounded-lg px-2 py-1 border border-gray-700 ${className ?? ""}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {LANGS.map(([code, label]) => (
        <option key={code} value={code}>
          {label}
        </option>
      ))}
    </select>
  );
}
