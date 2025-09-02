"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (content: string) => void;
}) {
  const [content, setContent] = useState(value || "");

  return (
    <div className="w-full">
      <JoditEditor
        value={content}
        onChange={(newContent) => {
          setContent(newContent);
          onChange(newContent);
        }}
        config={{
          height: 300,
          readonly: false,
          toolbarAdaptive: false,
          toolbarSticky: false,
        }}
      />
    </div>
  );
}
