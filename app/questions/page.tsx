
'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import QuestionCard from '@/components/QuestionCard';
import Link from 'next/link';

export default function QuestionsPage() {
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  const questions = [
    {
      id: '1',
      title: 'How to handle state management in React applications?',
      description: 'I am working on a large React application and struggling with state management. Should I use Redux, Context API, or Zustand? What are the pros and cons of each approach? I need to manage user authentication, shopping cart data, and form states across multiple components.',
      author: 'sarah_dev',
      votes: 15,
      answers: 8,
      views: 234,
      tags: ['React', 'State Management', 'Redux'],
      createdAt: '2 hours ago',
      hasAcceptedAnswer: true
    },
    {
      id: '2',
      title: 'Best practices for API error handling in JavaScript',
      description: 'What are the recommended patterns for handling API errors in JavaScript applications? I want to implement proper error boundaries and user feedback. Currently using fetch API but considering axios.',
      author: 'mike_code',
      votes: 12,
      answers: 5,
      views: 156,
      tags: ['JavaScript', 'API', 'Error Handling'],
      createdAt: '4 hours ago'
    },
    {
      id: '3',
      title: 'TypeScript vs JavaScript: When to make the switch?',
      description: 'Our team is considering migrating from JavaScript to TypeScript. What are the main benefits and challenges we should expect during this transition? We have a medium-sized codebase with about 50 components.',
      author: 'alex_tech',
      votes: 8,
      answers: 12,
      views: 389,
      tags: ['TypeScript', 'JavaScript', 'Migration'],
      createdAt: '6 hours ago'
    },
    {
      id: '4',
      title: 'Next.js vs Create React App: Which to choose for new project?',
      description: 'Starting a new React project and torn between Next.js and Create React App. The project will need SSR, routing, and API integration. What are the key differences I should consider?',
      author: 'jenny_dev',
      votes: 6,
      answers: 3,
      views: 127,
      tags: ['Next.js', 'React', 'SSR'],
      createdAt: '8 hours ago'
    },
    {
      id: '5',
      title: 'How to optimize React performance for large lists?',
      description: 'Working with a list of 10,000+ items in React and experiencing performance issues. Tried React.memo but still sluggish. What other optimization techniques should I consider?',
      author: 'david_react',
      votes: 22,
      answers: 14,
      views: 567,
      tags: ['React', 'Performance', 'Optimization'],
      createdAt: '1 day ago',
      hasAcceptedAnswer: true
    },
    {
      id: '6',
      title: 'MongoDB vs PostgreSQL for Node.js application',
      description: 'Building a social media app with Node.js and need to choose between MongoDB and PostgreSQL. The app will have users, posts, comments, and real-time features. Which database would be better?',
      author: 'tom_backend',
      votes: 9,
      answers: 7,
      views: 234,
      tags: ['MongoDB', 'PostgreSQL', 'Node.js'],
      createdAt: '1 day ago'
    }
  ];

  const filteredQuestions = questions.filter(question =>
    question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    question.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    switch (sortBy) {
      case 'votes':
        return b.votes - a.votes;
      case 'answers':
        return b.answers - a.answers;
      case 'views':
        return b.views - a.views;
      default: // newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Questions</h1>
            <p className="text-gray-600">{questions.length} questions found</p>
          </div>
          
          <Link href="/ask" className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 cursor-pointer whitespace-nowrap">
            Ask Question
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 flex items-center justify-center"></i>
                <input
                  type="text"
                  placeholder="Search questions or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 whitespace-nowrap">Sort by:</span>
              <div className="flex space-x-1">
                {[
                  { key: 'newest', label: 'Newest' },
                  { key: 'votes', label: 'Votes' },
                  { key: 'answers', label: 'Answers' },
                  { key: 'views', label: 'Views' }
                ].map((option) => (
                  <button
                    key={option.key}
                    onClick={() => setSortBy(option.key)}
                    className={`px-3 py-1 text-sm rounded-full cursor-pointer whitespace-nowrap ${
                      sortBy === option.key
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {sortedQuestions.length > 0 ? (
            sortedQuestions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))
          ) : (
            <div className="text-center py-12">
              <i className="ri-question-line text-6xl text-gray-400 mb-4 w-24 h-24 flex items-center justify-center mx-auto"></i>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No questions found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search terms or browse all questions.</p>
              <Link href="/ask" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 cursor-pointer whitespace-nowrap">
                Ask the first question
              </Link>
            </div>
          )}
        </div>

        {/* Load More */}
        {sortedQuestions.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-white text-gray-700 border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 cursor-pointer whitespace-nowrap">
              Load More Questions
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
