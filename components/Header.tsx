'use client';

import Link from 'next/link';
import { useState } from 'react';

interface User {
  id: string;
  username: string;
  avatar?: string;
}

export default function Header() {
  const [user, setUser] = useState<User | null>({ id: '1', username: 'Riya vachhani' });
  const [notifications, setNotifications] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const mockNotifications = [
    { id: 1, message: "Sarah answered your question about React hooks", time: "2 minutes ago" },
    { id: 2, message: "Mike mentioned you in a comment", time: "1 hour ago" },
    { id: 3, message: "New answer on 'JavaScript Array Methods'", time: "3 hours ago" }
  ];

  const handleLogin = () => {
    setUser({ id: '1', username: 'Riya Vachhani' });
  };

  const handleLogout = () => {
    setUser(null);
    setShowUserMenu(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-blue-600 font-pacifico">
              StackIt
            </Link>
            <nav className="flex space-x-6">
              <Link href="/questions" className="text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer">
                Questions
              </Link>
              <Link href="/tags" className="text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer">
                Tags
              </Link>
              <Link href="/users" className="text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer">
                Users
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/ask" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer">
                  Ask Question
                </Link>
                
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer w-8 h-8 flex items-center justify-center"
                  >
                    <i className="ri-notification-line text-xl"></i>
                    {notifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {notifications}
                      </span>
                    )}
                  </button>
                  
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                      </div>
                      {mockNotifications.map((notif) => (
                        <div key={notif.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-b-0 cursor-pointer">
                          <p className="text-sm text-gray-800">{notif.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                        </div>
                      ))}
                      <div className="px-4 py-2 text-center">
                        <button className="text-blue-600 text-sm hover:underline cursor-pointer whitespace-nowrap">
                          View all notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="whitespace-nowrap">{user.username}</span>
                    <i className="ri-arrow-down-s-line"></i>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer">
                        Profile
                      </Link>
                      <Link href="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer">
                        Settings
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleLogin}
                  className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Login
                </button>
                <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap cursor-pointer">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
