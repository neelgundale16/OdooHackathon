
'use client';

import Link from 'next/link';

interface Question {
  id: string;
  title: string;
  description: string;
  author: string;
  authorAvatar?: string;
  votes: number;
  answers: number;
  views: number;
  tags: string[];
  createdAt: string;
  hasAcceptedAnswer?: boolean;
}

interface QuestionCardProps {
  question: Question;
}

export default function QuestionCard({ question }: QuestionCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <Link href={`/questions/${question.id}`} className="cursor-pointer">
            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2">
              {question.title}
            </h3>
          </Link>
          
          <p className="text-gray-600 mb-3 line-clamp-2">
            {question.description.replace(/<[^>]*>/g, '').substring(0, 150)}...
          </p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {question.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded hover:bg-blue-200 transition-colors cursor-pointer whitespace-nowrap"
              >
                {tag}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-semibold">
                  {question.author.charAt(0).toUpperCase()}
                </div>
                <span>{question.author}</span>
              </span>
              <span>asked {question.createdAt}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center space-y-4 text-center min-w-[80px]">
          <div className="flex flex-col items-center">
            <span className={`text-lg font-semibold ${question.votes > 0 ? 'text-green-600' : question.votes < 0 ? 'text-red-600' : 'text-gray-700'}`}>
              {question.votes}
            </span>
            <span className="text-xs text-gray-500">votes</span>
          </div>
          
          <div className="flex flex-col items-center">
            <span className={`text-lg font-semibold ${question.hasAcceptedAnswer ? 'text-green-600' : question.answers > 0 ? 'text-blue-600' : 'text-gray-700'}`}>
              {question.answers}
            </span>
            <span className="text-xs text-gray-500">answers</span>
            {question.hasAcceptedAnswer && (
              <i className="ri-check-line text-green-600 text-sm mt-1"></i>
            )}
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-lg font-semibold text-gray-700">{question.views}</span>
            <span className="text-xs text-gray-500">views</span>
          </div>
        </div>
      </div>
    </div>
  );
}
