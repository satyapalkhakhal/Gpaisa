'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { useRef } from 'react';
import {
    Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote,
    LinkIcon, ImageIcon, Undo, Redo,
} from 'lucide-react';

async function uploadImage(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
    if (!res.ok) return null;
    const data = await res.json();
    return data.secure_url as string;
}

export default function ArticleEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Link.configure({ openOnClick: false }),
            Image,
        ],
        content: value,
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
        editorProps: {
            attributes: {
                class: 'article-content min-h-[400px] focus:outline-none px-4 py-3',
            },
        },
    });

    if (!editor) return null;

    async function handleImageSelected(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file || !editor) return;
        const url = await uploadImage(file);
        if (url) editor.chain().focus().setImage({ src: url, alt: '' }).run();
    }

    function addLink() {
        const url = window.prompt('Enter URL');
        if (!url) return;
        editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }

    const ToolbarButton = ({ onClick, active, title, children }: { onClick: () => void; active?: boolean; title: string; children: React.ReactNode }) => (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={`p-2 rounded hover:bg-gray-100 ${active ? 'bg-gray-200 text-primary-700' : 'text-gray-600'}`}
        >
            {children}
        </button>
    );

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
            <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50 px-2 py-1.5">
                <ToolbarButton title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
                    <Bold className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
                    <Italic className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton title="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                    <Heading2 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton title="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
                    <Heading3 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton title="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
                    <List className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton title="Ordered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                    <ListOrdered className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton title="Blockquote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
                    <Quote className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton title="Link" active={editor.isActive('link')} onClick={addLink}>
                    <LinkIcon className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton title="Insert image" onClick={() => fileInputRef.current?.click()}>
                    <ImageIcon className="w-4 h-4" />
                </ToolbarButton>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelected} />
                <div className="w-px h-5 bg-gray-300 mx-1" />
                <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()}>
                    <Undo className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()}>
                    <Redo className="w-4 h-4" />
                </ToolbarButton>
            </div>
            <EditorContent editor={editor} />
        </div>
    );
}
