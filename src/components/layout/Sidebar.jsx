import React from 'react';
import { LogOut, Radio } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'feed', icon: '◫', label: 'Feed' },
    { id: 'chat', icon: '◉', label: 'Chat' },
    { id: 'live', icon: <Radio size={24} />, label: 'Live' }, 
    { id: 'learn', icon: '◐', label: 'Learn' },
    { id: 'friends', icon: '◎', label: 'Friends' },
    { id: 'profile', icon: '◉', label: 'Profile' }
  ];

  return (
    <aside className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 md:sticky md:top-0 pointer-events-none">
      <nav className="pointer-events-auto flex items-center bg-black/80 backdrop-blur-md border border-[#2f3336] rounded-full px-2 py-1 shadow-2xl overflow-hidden md:gap-0 max-w-full">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-2 px-4 md:px-6 py-3 border-b-2 border-transparent transition-all duration-300 cursor-pointer
              ${activeTab === item.id 
                ? 'text-[#1d9bf0] font-bold border-[#1d9bf0] bg-[#1d9bf0]/10' 
                : 'text-[#71767b] hover:text-[#e7e9ea] hover:bg-[#1d9bf0]/10'}`}
          >
            <span className="text-xl md:text-2xl font-light">
                {typeof item.icon === 'string' ? item.icon : item.icon}
            </span>
            <span className="hidden sm:block text-sm font-medium">{item.label}</span>
          </button>
        ))}
        <button onClick={onLogout} className="flex items-center gap-2 px-4 md:px-6 py-3 text-[#f4212e] hover:bg-[#f4212e]/10 transition-all border-l border-[#2f3336] cursor-pointer" title="Logout">
            <LogOut size={20} />
        </button>
      </nav>
      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-[#2f3336] flex justify-around p-2 z-50 pointer-events-auto safe-area-pb">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200
              ${activeTab === item.id ? 'text-[#1d9bf0] bg-[#1d9bf0]/10' : 'text-[#71767b]'}`}
          >
            <span className="text-xl">
                {typeof item.icon === 'string' ? item.icon : item.icon}
            </span>
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;