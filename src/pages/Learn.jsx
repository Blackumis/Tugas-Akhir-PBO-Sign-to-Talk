import React, { useState } from 'react';
import { Video } from '../models';
import { X, Play, Youtube } from 'lucide-react';

const Learn = () => {
  const [videos] = useState([
      new Video({ id: 'v1', title: 'Belajar Alfabet BISINDO', youtubeId: 'TkJie7Q1y9s' }), 
      new Video({ id: 'v2', title: 'Sapaan Dasar (Halo, Apa Kabar)', youtubeId: '0FcwzMq4iWg' }),
      new Video({ id: 'v3', title: 'Frasa Umum Sehari-hari', youtubeId: 'DaMjr4AfYA0' }),
      new Video({ id: 'v4', title: 'Ekspresi Emosi dalam Isyarat', youtubeId: 'N9s5s7y_t7I' })
  ]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <div className="max-w-[1200px] mx-auto w-full pt-24 md:pt-4 px-4 pb-20">
       <h2 className="text-[#e7e9ea] text-3xl font-grotesk font-bold mb-8">Belajar Isyarat</h2>
       {selectedVideo && (
         <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-4xl bg-[#0a0a0a] rounded-2xl overflow-hidden border border-[#2f3336] shadow-2xl">
               <div className="flex justify-between p-4 border-b border-[#2f3336] bg-[#16181c]">
                   <h3 className="text-white font-bold truncate pr-4">{selectedVideo.title}</h3>
                   <button onClick={() => setSelectedVideo(null)} className="hover:bg-[#2f3336] p-1 rounded"><X className="text-white"/></button>
               </div>
               <div className="aspect-video bg-black">
                   <iframe className="w-full h-full" src={selectedVideo.getEmbedUrl()} title={selectedVideo.title} frameBorder="0" allowFullScreen></iframe>
               </div>
            </div>
         </div>
       )}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map(v => (
             <div key={v.id} onClick={() => setSelectedVideo(v)} className="bg-[#0a0a0a] border border-[#2f3336] rounded-2xl overflow-hidden cursor-pointer group hover:border-[#1d9bf0] transition duration-300 shadow-sm hover:shadow-md animate-fade-in-up">
                <div className="aspect-video bg-[#2f3336] relative overflow-hidden">
                    <img src={v.getThumbnailUrl()} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition duration-500" alt={v.title}/>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition">
                        <div className="w-14 h-14 bg-[#1d9bf0]/90 rounded-full flex items-center justify-center pl-1 shadow-lg transform group-hover:scale-110 transition duration-300">
                            <Play className="text-white w-7 h-7 fill-white"/>
                        </div>
                    </div>
                </div>
                <div className="p-5">
                    <h3 className="text-[#e7e9ea] font-bold text-lg mb-1 leading-snug">{v.title}</h3>
                    <p className="text-[#71767b] text-sm flex items-center gap-1"><Youtube size={14}/> YouTube Video</p>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

export default Learn;