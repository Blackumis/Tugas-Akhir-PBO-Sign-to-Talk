import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../api/firebase';
import { Services } from '../api/services';
import { User, COLLECTIONS } from '../models';
import { User as UserIcon, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!auth) throw new Error("Firebase configuration error.");

      if (isRegister) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, { displayName: name });
        
        const newUser = new User({
          id: user.uid,
          name: name,
          username: '@' + name.toLowerCase().replace(/\s/g, ''),
          email: email,
          isOnline: true
        });
        await Services.save(COLLECTIONS.USERS, newUser);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      console.error(err);
      setError(err.message.replace('Firebase:', '').trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 font-grotesk text-[#e7e9ea]">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-[#2f3336] rounded-2xl p-8 shadow-2xl animate-fade-in-up">
        {/* Konten UI sama seperti sebelumnya, hanya bagian logic yang dipisah */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">SignTalk Connect</h1>
          <p className="text-[#71767b]">{isRegister ? "Buat akun baru" : "Selamat datang kembali!"}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-500 text-sm animate-pulse">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#71767b] ml-1">Nama Lengkap</label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-3.5 text-[#71767b] group-focus-within:text-[#1d9bf0] transition-colors" size={20} />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#16181c] border border-[#2f3336] rounded-full py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#1d9bf0] transition-all"
                  placeholder="Masukkan nama anda"
                  required
                />
              </div>
            </div>
          )}
          {/* Email & Password inputs... (sama seperti kode asli) */}
           <div className="space-y-2">
            <label className="text-sm font-medium text-[#71767b] ml-1">Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 text-[#71767b] group-focus-within:text-[#1d9bf0] transition-colors" size={20} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#16181c] border border-[#2f3336] rounded-full py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#1d9bf0] transition-all"
                placeholder="email@contoh.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#71767b] ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 text-[#71767b] group-focus-within:text-[#1d9bf0] transition-colors" size={20} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#16181c] border border-[#2f3336] rounded-full py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#1d9bf0] transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold py-3.5 rounded-full transition transform active:scale-95 flex items-center justify-center gap-2 mt-6 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
              <>
                {isRegister ? 'Daftar Sekarang' : 'Masuk'}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-[#71767b] text-sm">
            {isRegister ? "Sudah punya akun?" : "Belum punya akun?"}
            <button 
              onClick={() => setIsRegister(!isRegister)}
              className="ml-2 text-[#1d9bf0] font-bold hover:underline cursor-pointer"
            >
              {isRegister ? "Login disini" : "Daftar disini"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;