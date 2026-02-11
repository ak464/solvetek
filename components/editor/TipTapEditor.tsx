"use client";

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import {
    Bold, Italic, Underline as UnderlineIcon, List, ListOrdered,
    Heading1, Heading2, Link as LinkIcon, Image as ImageIcon,
    Undo, Redo, Type, Palette, Highlighter, AlignRight, AlignCenter, AlignLeft
} from 'lucide-react'

interface TipTapEditorProps {
    content: string;
    onChange: (html: string) => void;
}

export function TipTapEditor({ content, onChange }: TipTapEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline cursor-pointer',
                },
            }),
            TextStyle,
            Color,
            Highlight.configure({ multicolor: true }),
            Image.configure({
                allowBase64: true,
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full h-auto my-4 mx-auto block',
                },
            }),
            Placeholder.configure({
                placeholder: 'ابدأ بكتابة محتوى المقال هنا...',
            }),
            CharacterCount,
        ],
        content,
        editorProps: {
            attributes: {
                class: 'prose prose-blue prose-lg focus:outline-none min-h-[400px] max-w-none p-6 text-right',
                dir: 'rtl',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    })

    if (!editor) {
        return null
    }

    const ToolbarButton = ({ onClick, isActive, children, title, className = "" }: any) => (
        <button
            type="button"
            onClick={onClick}
            className={`p-2 rounded-md transition-all duration-200 hover:scale-105 ${isActive
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                } ${className}`}
            title={title}
        >
            {children}
        </button>
    );

    const addImage = () => {
        const url = window.prompt('أدخل رابط الصورة (URL):')
        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }

    return (
        <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-xl transition-all hover:shadow-2xl">
            {/* Premium Toolbar */}
            <div className="flex flex-wrap gap-2 p-3 border-b border-gray-100 bg-gray-50/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex gap-1 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                    <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold">
                        <Bold size={18} strokeWidth={2.5} />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic">
                        <Italic size={18} strokeWidth={2.5} />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline">
                        <UnderlineIcon size={18} strokeWidth={2.5} />
                    </ToolbarButton>
                </div>

                <div className="flex gap-1 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                    <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Main Heading">
                        <Heading1 size={18} strokeWidth={2.5} />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="Sub Heading">
                        <Heading2 size={18} strokeWidth={2.5} />
                    </ToolbarButton>
                </div>

                <div className="flex gap-1 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                    <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
                        <List size={18} strokeWidth={2.5} />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Ordered List">
                        <ListOrdered size={18} strokeWidth={2.5} />
                    </ToolbarButton>
                </div>

                <div className="flex gap-1 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                    <ToolbarButton onClick={() => {
                        const url = window.prompt('أدخل الرابط:')
                        if (url) editor.chain().focus().setLink({ href: url }).run()
                    }} isActive={editor.isActive('link')} title="Insert Link">
                        <LinkIcon size={18} strokeWidth={2.5} />
                    </ToolbarButton>
                    <ToolbarButton onClick={addImage} title="Insert Image">
                        <ImageIcon size={18} strokeWidth={2.5} />
                    </ToolbarButton>
                </div>

                <div className="flex gap-1 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                    <input
                        type="color"
                        onInput={e => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()}
                        className="w-8 h-8 p-1 rounded cursor-pointer"
                        title="Text Color"
                    />
                    <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight({ color: '#ffcc00' }).run()} isActive={editor.isActive('highlight')} title="Highlight">
                        <Highlighter size={18} strokeWidth={2.5} />
                    </ToolbarButton>
                </div>

                <div className="flex-1" />

                <div className="flex gap-1 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                    <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
                        <Undo size={18} />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
                        <Redo size={18} />
                    </ToolbarButton>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-2 bg-[#fdfdfd]">
                <EditorContent editor={editor} className="bg-white min-h-[400px]" />
            </div>

            {/* Footer Info */}
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex justify-between text-xs text-gray-400 font-medium">
                <span>جاري تحرير المحتوى...</span>
                <div className="flex gap-4">
                    <span>الكلمات: {editor.storage.characterCount?.words?.() || 0}</span>
                    <span>الحروف: {editor.storage.characterCount?.characters?.() || 0}</span>
                </div>
            </div>
        </div>
    )
}
