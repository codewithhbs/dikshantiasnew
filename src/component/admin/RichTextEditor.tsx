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
          height: 400,
          readonly: false,
          toolbarAdaptive: false,
          toolbarSticky: false,
          uploader: {
            insertImageAsBase64URI: true,
          },
          buttons: [
            "source", "|",
            "bold", "italic", "underline", "strikethrough", "|",
            "ul", "ol", "outdent", "indent", "|",
            "font", "fontsize", "brush", "paragraph", "|",
            "image", "table", "link", "|",
            "align", "undo", "redo", "hr", "eraser", "copyformat", "|",
            "fullsize"
          ],
        }}
      />
    </div>
  );
}
