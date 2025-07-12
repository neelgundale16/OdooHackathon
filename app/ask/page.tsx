'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamically import client-only components
const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false });
const TagInput = dynamic(() => import('@/components/TagInput'), { ssr: false });

export default function AskQuestion() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || tags.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Question posted successfully!');
      setTitle('');
      setDescription('');
      setTags([]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Ask a Question</h1>
          <p className="text-gray-600">Get help from the community by asking a clear, detailed question.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Question Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., How to implement authentication in React?"
                maxLength={200}
                required
              />
              <p className="text-xs text-gray-500 mt-1">{title.length}/200 characters</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Description *
              </label>
              <div className="mb-4">
                <div className="flex space-x-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setShowPreview(false)}
                    className={`px-3 py-1 text-sm rounded-full cursor-pointer whitespace-nowrap ${
                      !showPreview
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Write
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPreview(true)}
                    className={`px-3 py-1 text-sm rounded-full cursor-pointer whitespace-nowrap ${
                      showPreview
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Preview
                  </button>
                </div>

                {showPreview ? (
                  <div className="border border-gray-300 rounded-lg p-4 min-h-[200px] bg-gray-50">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: description || '<p class="text-gray-500">Nothing to preview</p>',
                      }}
                      className="prose max-w-none"
                    />
                  </div>
                ) : (
                  <RichTextEditor
                    value={description}
                    onChange={setDescription}
                    placeholder="Describe your question in detail. Include what you've tried and what specific help you need."
                  />
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags *
              </label>
              <TagInput tags={tags} onChange={setTags} />
              <p className="text-xs text-gray-500 mt-1">
                Add up to 5 tags to describe what your question is about
              </p>
            </div>

            {/* Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">
                💡 Tips for asking a great question:
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Make your title specific and descriptive</li>
                <li>• Explain the problem clearly and what you've tried</li>
                <li>• Include relevant code, error messages, or screenshots</li>
                <li>• Use appropriate tags to help others find your question</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <Link href="/" className="text-gray-600 hover:text-gray-800 cursor-pointer whitespace-nowrap">
                ← Back to home
              </Link>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setTitle('');
                    setDescription('');
                    setTags([]);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap"
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !title.trim() || !description.trim() || tags.length === 0}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
                >
                  {isSubmitting ? 'Posting...' : 'Post Question'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}