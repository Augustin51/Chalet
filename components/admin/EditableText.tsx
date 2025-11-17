"use client";

import { useState } from "react";

export default function EditableText({
  admin,
  value,
  field,
  component,
  as: Tag = "span",
  className = "",
}: {
  admin: boolean;
  value: string;
  field: string;
  component: string;
  as?: any;
  className?: string;
}) {
  const [text, setText] = useState(value);

  async function save(newValue: string) {
    setText(newValue);

    await fetch("/api/content/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        component,
        key: field,
        value: newValue,
      }),
    });
  }

  if (!admin) {
    return <Tag className={className}>{value}</Tag>;
  }

  return (
    <input
      className={`border px-2 py-1 bg-white text-black rounded ${className}`}
      value={text}
      onChange={(e) => save(e.target.value)}
    />
  );
}
