import React, { useState, useEffect, useRef } from 'react';
import { Services } from '../api/services';
import { db } from '../api/firebase';
import { Message, COLLECTIONS } from '../models';
import Avatar from '../components/common/Avatar';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { MessageCircle, ArrowRight, MoreVertical, ImageIcon, Send } from 'lucide-react';
import { appId } from '../api/firebase';

const Chat = ({ currentUser, onViewProfile, initialSelectedUser, users }) => {
  const [messages, setMessages] = useState([]); 
  const [allMyMessages, setAllMyMessages] = useState([]); 
  const [selectedUser, setSelectedUser] = useState(null);
  const [text, setText] = useState('');
  const [activeChatTab, setActiveChatTab] = useState('chats'); // 'chats' | 'requests'
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (initialSelectedUser) {
      setSelectedUser(initialSelectedUser);
      const isMutual = (currentUser.following || []).includes(initialSelectedUser.id) && 
                       (initialSelectedUser.following || []).includes(currentUser.id);
      if (isMutual) {
          setActiveChatTab('chats');
      } else {
          setActiveChatTab('requests');
      }
    }
  }, [initialSelectedUser, currentUser]);
  
  useEffect(() => {
      if (!currentUser?.id) return;
      // Gunakan getColRef atau manual collection path, sesuaikan dengan konsistensi
      const q = query(collection(db, 'artifacts', appId, 'public', 'data', COLLECTIONS.MESSAGES));
      const unsub = onSnapshot(q, (snap) => {
          const allDocs = snap.docs.map(d => new Message({...d.data(), id:d.id}));
          const relevant = allDocs.filter(m => m.senderId === currentUser.id || m.receiverId === currentUser.id);
          setAllMyMessages(relevant);
      });
      return () => unsub();
  }, [currentUser.id]);

  useEffect(() => {
      if(selectedUser) {
         const activeMsgs = allMyMessages.filter(m => 
            (m.senderId === currentUser.id && m.receiverId === selectedUser.id) || 
            (m.senderId === selectedUser.id && m.receiverId === currentUser.id)
         ).sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
         setMessages(activeMsgs);
      }
  }, [selectedUser, allMyMessages, currentUser.id]);

  useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if(!text.trim()) return;
    await Services.save(COLLECTIONS.MESSAGES, new Message({ senderId: currentUser.id, receiverId: selectedUser.id, text }));
    setText('');
  };

  // Get all users who have exchanged messages with current user (for Obrolan tab)
  const usersWithMessages = users.filter(u => {
      if (u.id === currentUser.id) return false;
      const hasMessages = allMyMessages.some(m => 
          (m.senderId === currentUser.id && m.receiverId === u.id) ||
          (m.senderId === u.id && m.receiverId === currentUser.id)
      );
      return hasMessages;
  });

  // For Permintaan: show users without mutual follow AND without any messages yet
  const requestUsers = users.filter(u => {
      if (u.id === currentUser.id) return false;
      const isMutual = (currentUser.following || []).includes(u.id) && 
                       (u.following || []).includes(currentUser.id);
      const hasMessages = allMyMessages.some(m => 
          (m.senderId === currentUser.id && m.receiverId === u.id) ||
          (m.senderId === u.id && m.receiverId === currentUser.id)
      );
      // Show in Permintaan if: not mutual friends AND no messages yet
      return !isMutual && !hasMessages;
  });

  let displayUsers = activeChatTab === 'chats' ? usersWithMessages : requestUsers;

  const getLastTimestamp = (userId) => {
      const interaction = allMyMessages.filter(m => 
          (m.senderId === currentUser.id && m.receiverId === userId) ||
          (m.senderId === userId && m.receiverId === currentUser.id)
      );
      if (interaction.length === 0) return 0;
      const times = interaction.map(m => new Date(m.createdAt).getTime());
      return Math.max(...times);
  };

  displayUsers = [...displayUsers].sort((a, b) => {
      return getLastTimestamp(b.id) - getLastTimestamp(a.id);
  });

  return (
    <div className="max-w-[1200px] mx-auto w-full pt-20 md:pt-4 px-0 md:px-4 h-[calc(100vh-80px)] md:h-[calc(100vh-20px)]">
      <div className="flex h-full bg-[#0a0a0a] md:border border-[#2f3336] md:rounded-2xl overflow-hidden">
        
        {/* Sidebar Chat List */}
        <div className={`w-full md:w-[320px] flex flex-col border-r border-[#2f3336] ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-[#2f3336]">
            <h2 className="text-[#e7e9ea] text-xl font-bold mb-4">Pesan</h2>
            <div className="flex bg-[#16181c] p-1 rounded-lg">
                <button 
                    onClick={() => { setActiveChatTab('chats'); setSelectedUser(null); }}
                    className={`flex-1 py-1.5 text-sm font-bold rounded-md transition ${activeChatTab === 'chats' ? 'bg-[#000] text-white shadow' : 'text-[#71767b] hover:text-[#e7e9ea]'}`}
                >
                    Obrolan
                </button>
                <button 
                    onClick={() => { setActiveChatTab('requests'); setSelectedUser(null); }}
                    className={`flex-1 py-1.5 text-sm font-bold rounded-md transition ${activeChatTab === 'requests' ? 'bg-[#000] text-white shadow' : 'text-[#71767b] hover:text-[#e7e9ea]'}`}
                >
                    Permintaan
                </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {displayUsers.length === 0 && (
                <div className="p-8 text-center text-[#71767b] text-sm">
                    {activeChatTab === 'chats' 
                        ? "Belum ada teman chat. Saling follow dulu ya!" 
                        : "Tidak ada permintaan pesan baru."}
                </div>
            )}

            {displayUsers.map(u => {
               const lastTs = getLastTimestamp(u.id);
               const hasMessage = lastTs > 0;
               
               return (
               <div 
                 key={u.id} 
                 className={`flex items-center gap-3 p-4 hover:bg-white/[0.03] cursor-pointer transition border-l-4 ${selectedUser?.id === u.id ? 'border-[#1d9bf0] bg-white/[0.03]' : 'border-transparent'}`}
               >
                 <div className="relative" onClick={(e) => { e.stopPropagation(); onViewProfile(u); }}>
                   <Avatar src={u.avatar} size="lg" />
                   {u.isOnline && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#00ba7c] rounded-full border-2 border-black"></div>}
                 </div>
                 <div className="min-w-0 flex-1" onClick={() => setSelectedUser(u)}>
                    <div className="flex justify-between items-baseline">
                        <h3 className="font-bold text-[#e7e9ea] truncate">{u.name}</h3>
                        {hasMessage && (
                            <span className="text-xs text-[#71767b]">
                                {new Date(lastTs).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-[#71767b] truncate">
                        {hasMessage ? "Klik untuk lihat chat" : "Mulai obrolan baru"}
                    </p>
                 </div>
               </div>
               );
            })}
          </div>
        </div>
        
        {/* Main Chat Area */}
        <div className={`flex-1 flex flex-col bg-[#000000] md:bg-[#0a0a0a] ${!selectedUser ? 'hidden md:flex' : 'flex'}`}>
           {!selectedUser ? ( 
             <div className="flex-1 flex flex-col items-center justify-center text-[#71767b] p-8 text-center">
                 <div className="w-20 h-20 bg-[#1d9bf0]/10 rounded-full flex items-center justify-center mb-4">
                     <MessageCircle size={40} className="text-[#1d9bf0]" />
                 </div>
                 <h3 className="text-xl font-bold text-[#e7e9ea] mb-2">Pilih Pesan</h3>
                 <p>Pilih teman dari daftar {activeChatTab === 'chats' ? 'Obrolan' : 'Permintaan'} untuk memulai.</p>
             </div> 
           ) : (
             <>
               <div className="flex items-center gap-3 p-3 border-b border-[#2f3336] bg-[#0a0a0a]/80 backdrop-blur z-10 sticky top-0">
                  <button onClick={() => setSelectedUser(null)} className="md:hidden text-[#e7e9ea] p-2 hover:bg-[#2f3336] rounded-full"><ArrowRight className="transform rotate-180"/></button>
                  <div onClick={() => onViewProfile(selectedUser)} className="cursor-pointer">
                    <Avatar src={selectedUser.avatar} size="md" />
                  </div>
                  <div className="flex-1 cursor-pointer" onClick={() => onViewProfile(selectedUser)}>
                      <h3 className="text-[#e7e9ea] font-bold hover:underline">{selectedUser.name}</h3>
                      <span className="text-xs text-[#00ba7c]">Online</span>
                  </div>
                  {activeChatTab === 'requests' && (
                      <span className="text-xs px-2 py-1 bg-[#2f3336] rounded text-[#71767b]">Belum berteman</span>
                  )}
                  <MoreVertical className="text-[#71767b] cursor-pointer" />
               </div>

               <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                  {messages.length === 0 && (
                      <div className="flex-1 flex flex-col items-center justify-center text-[#71767b] opacity-50">
                          <p>Belum ada pesan. Sapa {selectedUser.name}!</p>
                      </div>
                  )}
                  {messages.map(m => {
                    const isMine = m.senderId === currentUser.id;
                    return ( 
                        <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                            <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-[0.95rem] ${isMine ? 'bg-[#1d9bf0] text-white rounded-br-none' : 'bg-[#2f3336] text-[#e7e9ea] rounded-bl-none'}`}>
                                <p>{m.text}</p>
                                <span className={`text-[10px] block text-right mt-1 ${isMine ? 'text-white/70' : 'text-[#71767b]'}`}>
                                    {new Date(m.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                        </div> 
                    )
                  })}
                  <div ref={messagesEndRef} />
               </div>

               <form onSubmit={sendMessage} className="p-3 border-t border-[#2f3336] flex gap-2 items-center bg-[#0a0a0a]">
                  <button type="button" className="text-[#1d9bf0] p-2 hover:bg-[#1d9bf0]/10 rounded-full"><ImageIcon size={20}/></button>
                  <input 
                    value={text} 
                    onChange={(e) => setText(e.target.value)} 
                    placeholder="Tulis pesan..." 
                    className="flex-1 bg-[#16181c] border-none rounded-full px-4 py-2.5 text-[#e7e9ea] outline-none focus:ring-1 focus:ring-[#1d9bf0] transition-all" 
                  />
                  <button type="submit" disabled={!text.trim()} className="p-2.5 bg-[#1d9bf0] text-white rounded-full hover:bg-[#1a8cd8] disabled:opacity-50 transition transform active:scale-95">
                      <Send size={18} />
                  </button>
               </form>
             </>
           )}
        </div>
      </div>
    </div>
  );
};

export default Chat;