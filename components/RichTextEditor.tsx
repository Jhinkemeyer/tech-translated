"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../lib/firebase";
import Link from "@tiptap/extension-link";

export default function RichTextEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (val: string) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      // The Link extension configuration
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "text-emerald-400 underline hover:text-emerald-300 transition-colors cursor-pointer",
          target: "_blank", // Ensures links open in a new tab!
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto my-6 border border-zinc-800", // Auto-formats your photos
        },
      }),
    ],
    content: content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-none min-h-[300px] p-4 text-zinc-300",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    setIsUploading(true);
    try {
      // Create a unique folder path and filename in your cloud storage
      const storageRef = ref(storage, `dispatches/${Date.now()}-${file.name}`);

      // Upload the raw file
      await uploadBytes(storageRef, file);

      // Get the live public URL back from Firebase
      const url = await getDownloadURL(storageRef);

      // Inject that URL into your text editor as an image!
      editor.chain().focus().setImage({ src: url }).run();
    } catch (error) {
      console.error("Error uploading image: ", error);
      alert("Failed to upload photo. Check console.");
    } finally {
      setIsUploading(false);
    }
  };

  if (!editor) return null;

  return (
    <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/30 focus-within:border-zinc-600 transition-colors">
      {/* The Toolbar */}
      <div className="bg-zinc-900/80 border-b border-zinc-800 p-2 flex gap-2 flex-wrap items-center">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            editor.isActive("bold")
              ? "bg-zinc-200 text-zinc-950"
              : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          }`}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            editor.isActive("italic")
              ? "bg-zinc-200 text-zinc-950"
              : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          }`}
        >
          Italic
        </button>
        <div className="w-px h-5 bg-zinc-700 mx-1"></div>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            editor.isActive("heading", { level: 2 })
              ? "bg-zinc-200 text-zinc-950"
              : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          }`}
        >
          Heading
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            editor.isActive("bulletList")
              ? "bg-zinc-200 text-zinc-950"
              : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          }`}
        >
          Bullet List
        </button>

        <div className="w-px h-5 bg-zinc-700 mx-1"></div>

        {/* The New Link Button */}
        <button
          type="button"
          onClick={() => {
            const previousUrl = editor.getAttributes("link").href;
            const url = window.prompt("Enter the URL:", previousUrl);

            // If they hit cancel
            if (url === null) {
              return;
            }

            // If they submit an empty string, it removes the link
            if (url === "") {
              editor.chain().focus().extendMarkRange("link").unsetLink().run();
              return;
            }

            // Otherwise, set the link!
            editor
              .chain()
              .focus()
              .extendMarkRange("link")
              .setLink({ href: url })
              .run();
          }}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            editor.isActive("link")
              ? "bg-emerald-500/20 text-emerald-400"
              : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          }`}
        >
          Add Link
        </button>

        <div className="w-px h-5 bg-zinc-700 mx-1"></div>

        {/* The Image Upload Button */}
        <label
          className={`cursor-pointer px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            isUploading
              ? "text-emerald-400 animate-pulse"
              : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          }`}
        >
          {isUploading ? "Uploading..." : "Add Photo"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={isUploading}
          />
        </label>
      </div>

      {/* The Writing Canvas */}
      <EditorContent editor={editor} />
    </div>
  );
}
