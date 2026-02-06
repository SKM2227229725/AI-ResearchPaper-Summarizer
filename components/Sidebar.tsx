
import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, isOpen = true, onClose }) => {
  const navItems = [
    { id: AppView.DASHBOARD, icon: 'fa-table-columns', label: 'Dashboard' },
    { id: AppView.UPLOAD, icon: 'fa-cloud-arrow-up', label: 'Upload Paper' },
    { id: AppView.SUMMARIZER, icon: 'fa-file-lines', label: 'Summarizer' },
    { id: AppView.INSIGHTS, icon: 'fa-lightbulb', label: 'Insights' },
    { id: AppView.SEARCH, icon: 'fa-magnifying-glass', label: 'Semantic Search' },
    { id: AppView.CHAT, icon: 'fa-comments', label: 'Chat with AI' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed md:relative inset-y-0 left-0 z-50
        w-64 bg-slate-900 text-white flex flex-col h-full shadow-2xl
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <i className="fa-solid fa-microscope text-white text-xl"></i>
            </div>
            <span className="text-lg font-bold tracking-tight">InsightHub</span>
          </div>
          {/* Close button for mobile */}
          <button 
            onClick={onClose}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                if (window.innerWidth < 768 && onClose) {
                  onClose();
                }
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${currentView === item.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <i className={`fa-solid ${item.icon} w-5`}></i>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800 text-xs text-slate-500 text-center">
          Powered by insighthub<br />
          &copy; 2024 Research AI
        </div>
      </div>
    </>
  );
};

export default Sidebar;
