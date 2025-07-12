
'use client';

import Header from '@/components/Header';
import QuestionCard from '@/components/QuestionCard';
import Link from 'next/link';

export default function Home() {
  const featuredQuestions = [
    {
      id: '1',
      title: 'How to handle state management in React applications?',
      description: 'I am working on a large React application and struggling with state management. Should I use Redux, Context API, or Zustand? What are the pros and cons of each approach?',
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
      description: 'What are the recommended patterns for handling API errors in JavaScript applications? I want to implement proper error boundaries and user feedback.',
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
      description: 'Our team is considering migrating from JavaScript to TypeScript. What are the main benefits and challenges we should expect during this transition?',
      author: 'alex_tech',
      votes: 8,
      answers: 12,
      views: 389,
      tags: ['TypeScript', 'JavaScript', 'Migration'],
      createdAt: '6 hours ago'
    }
  ];

  const popularTags = [
    { name: 'React', count: 1234 },
    { name: 'JavaScript', count: 2156 },
    { name: 'TypeScript', count: 987 },
    { name: 'Node.js', count: 756 },
    { name: 'Python', count: 1445 },
    { name: 'Next.js', count: 543 }
  ];

  const stats = {
    questions: '12,456',
    answers: '28,789',
    users: '5,643'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to StackIt</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            A minimal Q&A platform where developers help each other learn, grow, and solve problems together.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/ask" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors cursor-pointer whitespace-nowrap">
              Ask a Question
            </Link>
            <Link href="/questions" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors cursor-pointer whitespace-nowrap">
              Browse Questions
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">{stats.questions}</div>
              <div className="text-gray-600">Questions Asked</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">{stats.answers}</div>
              <div className="text-gray-600">Answers Provided</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">{stats.users}</div>
              <div className="text-gray-600">Active Users</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Featured Questions</h2>
              <Link href="/questions" className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer whitespace-nowrap">
                View all questions →
              </Link>
            </div>
            
            <div className="space-y-6">
              {featuredQuestions.map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Popular Tags */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
              <div className="space-y-3">
                {popularTags.map((tag) => (
                  <Link
                    key={tag.name}
                    href={`/tags/${tag.name.toLowerCase()}`}
                    className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <span className="text-blue-600 font-medium">{tag.name}</span>
                    <span className="text-gray-500 text-sm">{tag.count.toLocaleString()}</span>
                  </Link>
                ))}
              </div>
              <Link href="/tags" className="block text-center text-blue-600 hover:text-blue-700 mt-4 cursor-pointer whitespace-nowrap">
                View all tags
              </Link>
            </div>

            {/* Community Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Community Guidelines</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start space-x-2">
                  <i className="ri-check-line text-blue-600 mt-0.5 w-4 h-4 flex items-center justify-center"></i>
                  <span>Ask clear, specific questions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="ri-check-line text-blue-600 mt-0.5 w-4 h-4 flex items-center justify-center"></i>
                  <span>Provide helpful, detailed answers</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="ri-check-line text-blue-600 mt-0.5 w-4 h-4 flex items-center justify-center"></i>
                  <span>Be respectful and constructive</span>
                </li>
                <li className="flex items-start space-x-2">
                  <i className="ri-check-line text-blue-600 mt-0.5 w-4 h-4 flex items-center justify-center"></i>
                  <span>Vote to highlight quality content</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
