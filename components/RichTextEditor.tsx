
'use client';

import { useState, useRef, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const emojis = ['😀', '😃', '😊', '😍', '🤔', '👍', '👎', '❤️', '🎉', '🔥', '💡', '❓', '✅', '❌'];

  const saveCursorPosition = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && editorRef.current) {
      const range = selection.getRangeAt(0);
      return {
        startContainer: range.startContainer,
        startOffset: range.startOffset,
        endContainer: range.endContainer,
        endOffset: range.endOffset
      };
    }
    return null;
  };

  const restoreCursorPosition = (position: any) => {
    if (position && editorRef.current) {
      try {
        const selection = window.getSelection();
        const range = document.createRange();
        range.setStart(position.startContainer, position.startOffset);
        range.setEnd(position.endContainer, position.endOffset);
        selection?.removeAllRanges();
        selection?.addRange(range);
      } catch (e) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(editorRef.current);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  };

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertEmoji = (emoji: string) => {
    executeCommand('insertText', emoji);
    setShowEmojiPicker(false);
  };

  const insertLink = () => {
    if (linkUrl && linkText) {
      executeCommand('insertHTML', `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`);
      setShowLinkModal(false);
      setLinkUrl('');
      setLinkText('');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        executeCommand('insertHTML', `<img src="${imageUrl}" alt="Uploaded image" style="max-width: 100%; height: auto;" />`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    if (!isUpdating) {
      onChange(e.currentTarget.innerHTML);
    }
  };

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      setIsUpdating(true);
      const cursorPosition = saveCursorPosition();
      editorRef.current.innerHTML = value;
      restoreCursorPosition(cursorPosition);
      setIsUpdating(false);
    }
  }, [value]);

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => executeCommand('bold')}
          className="p-2 hover:bg-gray-200 rounded cursor-pointer w-8 h-8 flex items-center justify-center"
          title="Bold"
        >
          <i className="ri-bold text-sm"></i>
        </button>

        <button
          type="button"
          onClick={() => executeCommand('italic')}
          className="p-2 hover:bg-gray-200 rounded cursor-pointer w-8 h-8 flex items-center justify-center"
          title="Italic"
        >
          <i className="ri-italic text-sm"></i>
        </button>

        <button
          type="button"
          onClick={() => executeCommand('strikeThrough')}
          className="p-2 hover:bg-gray-200 rounded cursor-pointer w-8 h-8 flex items-center justify-center"
          title="Strikethrough"
        >
          <i className="ri-strikethrough text-sm"></i>
        </button>

        <div className="w-px bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => executeCommand('insertOrderedList')}
          className="p-2 hover:bg-gray-200 rounded cursor-pointer w-8 h-8 flex items-center justify-center"
          title="Numbered List"
        >
          <i className="ri-list-ordered text-sm"></i>
        </button>

        <button
          type="button"
          onClick={() => executeCommand('insertUnorderedList')}
          className="p-2 hover:bg-gray-200 rounded cursor-pointer w-8 h-8 flex items-center justify-center"
          title="Bullet List"
        >
          <i className="ri-list-unordered text-sm"></i>
        </button>

        <div className="w-px bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => executeCommand('justifyLeft')}
          className="p-2 hover:bg-gray-200 rounded cursor-pointer w-8 h-8 flex items-center justify-center"
          title="Align Left"
        >
          <i className="ri-align-left text-sm"></i>
        </button>

        <button
          type="button"
          onClick={() => executeCommand('justifyCenter')}
          className="p-2 hover:bg-gray-200 rounded cursor-pointer w-8 h-8 flex items-center justify-center"
          title="Align Center"
        >
          <i className="ri-align-center text-sm"></i>
        </button>

        <button
          type="button"
          onClick={() => executeCommand('justifyRight')}
          className="p-2 hover:bg-gray-200 rounded cursor-pointer w-8 h-8 flex items-center justify-center"
          title="Align Right"
        >
          <i className="ri-align-right text-sm"></i>
        </button>

        <div className="w-px bg-gray-300 mx-1"></div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 hover:bg-gray-200 rounded cursor-pointer w-8 h-8 flex items-center justify-center"
            title="Insert Emoji"
          >
            <i className="ri-emotion-line text-sm"></i>
          </button>

          {showEmojiPicker && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg p-2 shadow-lg z-10 grid grid-cols-7 gap-1">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => insertEmoji(emoji)}
                  className="p-1 hover:bg-gray-100 rounded cursor-pointer text-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowLinkModal(true)}
          className="p-2 hover:bg-gray-200 rounded cursor-pointer w-8 h-8 flex items-center justify-center"
          title="Insert Link"
        >
          <i className="ri-link text-sm"></i>
        </button>

        <label className="p-2 hover:bg-gray-200 rounded cursor-pointer w-8 h-8 flex items-center justify-center" title="Insert Image">
          <i className="ri-image-line text-sm"></i>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>

      <div
        ref={editorRef}
        contentEditable
        className="p-4 min-h-[200px] focus:outline-none"
        onInput={handleInput}
        style={{ whiteSpace: 'pre-wrap' }}
        suppressContentEditableWarning={true}
      />

      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Insert Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Text</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter link text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertLink}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer whitespace-nowrap"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
