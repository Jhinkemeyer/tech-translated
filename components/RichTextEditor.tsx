"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

export default function RichTextEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (val: string) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    immediatelyRender: false, // <-- This is the magic line that fixes the SSR error!
    // This injects our Tailwind typography classes directly into the writing canvas
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-none min-h-[300px] p-4 text-zinc-300",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()); // Sends the formatted HTML back to our main page
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/30 focus-within:border-zinc-600 transition-colors">
      {/* The Toolbar */}
      <div className="bg-zinc-900/80 border-b border-zinc-800 p-2 flex gap-2 flex-wrap items-center">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${editor.isActive("bold") ? "bg-zinc-200 text-zinc-950" : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"}`}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${editor.isActive("italic") ? "bg-zinc-200 text-zinc-950" : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"}`}
        >
          Italic
        </button>
        <div className="w-px h-5 bg-zinc-700 mx-1"></div> {/* Divider */}
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${editor.isActive("heading", { level: 2 }) ? "bg-zinc-200 text-zinc-950" : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"}`}
        >
          Heading
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${editor.isActive("bulletList") ? "bg-zinc-200 text-zinc-950" : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"}`}
        >
          Bullet List
        </button>
      </div>

      {/* The Writing Canvas */}
      <EditorContent editor={editor} />
    </div>
  );
}
