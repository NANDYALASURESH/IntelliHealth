// src/layouts/MainLayout.js
import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Sticky on the left */}
      <div className="sticky top-0 h-screen flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar - Sticky at the top */}
        <div className="sticky top-0 z-50 bg-white shadow">
          <Navbar />
        </div>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
