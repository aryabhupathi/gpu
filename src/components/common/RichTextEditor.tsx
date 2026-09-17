"use client";
import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Box, IconButton, Tooltip, Divider } from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatStrikethrough,
  Code,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
  Link as LinkIcon,
} from "@mui/icons-material";
import { Editor } from "@tiptap/react";
const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }
  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    if (url === null) {
      return;
    }
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 0.5,
        p: 1,
        borderBottom: "1px solid #E2E8F0",
        bgcolor: "#F8FAFC",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
      }}
    >
      <Tooltip title="Bold">
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleBold().run()}
          color={editor.isActive("bold") ? "primary" : "default"}
        >
          <FormatBold fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Italic">
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          color={editor.isActive("italic") ? "primary" : "default"}
        >
          <FormatItalic fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Strikethrough">
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          color={editor.isActive("strike") ? "primary" : "default"}
        >
          <FormatStrikethrough fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Code">
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleCode().run()}
          color={editor.isActive("code") ? "primary" : "default"}
        >
          <Code fontSize="small" />
        </IconButton>
      </Tooltip>
      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
      <Tooltip title="Bullet List">
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          color={editor.isActive("bulletList") ? "primary" : "default"}
        >
          <FormatListBulleted fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Numbered List">
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          color={editor.isActive("orderedList") ? "primary" : "default"}
        >
          <FormatListNumbered fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Blockquote">
        <IconButton
          size="small"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          color={editor.isActive("blockquote") ? "primary" : "default"}
        >
          <FormatQuote fontSize="small" />
        </IconButton>
      </Tooltip>
      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
      <Tooltip title="Add Link">
        <IconButton
          size="small"
          onClick={addLink}
          color={editor.isActive("link") ? "primary" : "default"}
        >
          <LinkIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
export default function RichTextEditor({
  value,
  onChange,
  readOnly = false,
  placeholder = "Write something...",
}: {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);
  return (
    <Box
      sx={{
        border: "1px solid #E2E8F0",
        borderRadius: 2,
        overflow: "hidden",
        "& .ProseMirror": {
          minHeight: "250px",
          p: 2,
          outline: "none",
          fontSize: "1rem",
          color: "#334155",
          lineHeight: 1.6,
          "& p.is-editor-empty:first-of-type::before": {
            color: "#94A3B8",
            content: "attr(data-placeholder)",
            float: "left",
            height: 0,
            pointerEvents: "none",
          },
          "& a": { color: "#3B82F6", textDecoration: "underline" },
          "& ul, & ol": { paddingLeft: "1.5rem" },
          "& blockquote": {
            borderLeft: "4px solid #E2E8F0",
            pl: 2,
            ml: 0,
            color: "#64748B",
            fontStyle: "italic",
          },
          "& code": {
            bgcolor: "#F1F5F9",
            p: 0.5,
            borderRadius: 1,
            fontFamily: "monospace",
          },
          "& pre": {
            bgcolor: "#0F172A",
            color: "#F8FAFC",
            p: 2,
            borderRadius: 2,
            fontFamily: "monospace",
            overflowX: "auto",
            "& code": { bgcolor: "transparent", color: "inherit", p: 0 },
          },
        },
      }}
    >
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </Box>
  );
}
