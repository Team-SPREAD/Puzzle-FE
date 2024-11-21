import React, { FC, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';

// Dynamic import for client-side rendering
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface MarkdownEditorProps {
  value?: string;
  onChange: (value?: string) => void;
  height?: number;
  className?: string;
  placeholder?: string;
}

const MarkdownEditor: FC<MarkdownEditorProps> = ({
  value = '',
  onChange,
  height = 600,
  className,
  placeholder = 'Write your markdown here...',
}) => {
  // Preview mode toggle
  const [preview, setPreview] = useState<'edit' | 'preview'>('edit');

  // Memoized toolbar configuration
  const toolbarConfig = useMemo(
    () => ({
      toolbar: {
        preview: {
          // Custom preview toggle functionality
          handler: () => {
            setPreview((prev) => (prev === 'edit' ? 'preview' : 'edit'));
          },
        },
      },
    }),
    [],
  );

  return (
    <div
      data-color-mode="light"
      className={cn('markdown-editor-container', className)}
    >
      <MDEditor
        value={value}
        onChange={onChange}
        height={height}
        preview={preview}
        visibleDragbar={false}
        {...toolbarConfig}
      />
    </div>
  );
};

export default MarkdownEditor;
