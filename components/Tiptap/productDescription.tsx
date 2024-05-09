'use client'
import { EditorContent, useEditor, type Editor } from '@tiptap/react'
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group'
import { BoldIcon, ItalicIcon, UnderlineIcon } from 'lucide-react'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Bold from '@tiptap/extension-bold'
import Heading from '@tiptap/extension-heading'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import { cn } from '../../lib/utils';

const Toolbar = ({ editor }: { editor: Editor }) => {

    return (
        <div className="bg-default-200 rounded-tr-md rounded-tl-md p-1 flex flex-row items-center gap-1 border-b border-default-300">
            <ToggleGroup type='multiple' className=''>
                <ToggleGroupItem value='bold' aria-label='Toggle bold' className={cn(editor.isActive('bold') ? 'bg-default-100' : '', 'hover:bg-default-300')}
                    onClick={() => editor.chain().focus().toggleMark("bold").run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleMark("bold")
                            .run()
                    }
                >
                    <BoldIcon className='h-4 w-4' />
                </ToggleGroupItem>
                <ToggleGroupItem value='italic' aria-label='Toggle Italic' className={cn(editor.isActive('italic') ? 'bg-default-100' : '', 'hover:bg-default-300')}
                    onClick={() => editor.chain().focus().toggleMark("italic").run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleMark("italic")
                            .run()
                    }
                >
                    <ItalicIcon className='h-4 w-4' />
                </ToggleGroupItem>
                <ToggleGroupItem value='underline' aria-label='Toggle Underline' className={cn(editor.isActive('underline') ? 'bg-default-100' : '', 'hover:bg-default-300')}
                    onClick={() => editor.chain().focus().toggleMark("underline").run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleMark("underline")
                            .run()
                    }
                >
                    <UnderlineIcon className='h-4 w-4' />
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
    )
}

export const ProductDescription = () => {
    const editor = useEditor({
        editorProps: {
            attributes: {
                class:
                "min-h-[80px] max-h-[250px] w-full rounded-md rounded-tr-none rounded-tl-none bg-default-100 px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-auto",
            },
        },
        extensions: [
            Document, Paragraph, Text, Heading, StarterKit, Underline
        ],
        content: ""
    })

    return (
        <div className='rounded-md border border-default-300'>
            {editor ? <Toolbar editor={editor}/> : null}
            <EditorContent editor={editor}/>
        </div>
    )
}