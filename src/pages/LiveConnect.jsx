import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, AlertCircle } from 'lucide-react';

const LiveConnect = ({ currentUser }) => {
  const [role, setRole] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  
  // Refs for cleanup
  const streamRef = useRef(null);
  const cameraRef = useRef(null);
  const handsRef = useRef(null);

  // Polyfill for older browsers and setup mediaDevices
  useEffect(() => {
    // Polyfill for mediaDevices
    if (navigator.mediaDevices === undefined) {
      navigator.mediaDevices = {};
    }
    
    // Polyfill getUserMedia
    if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = function(constraints) {
        // First try the old methods
        const getUserMedia = navigator.webkitGetUserMedia || 
                            navigator.mozGetUserMedia || 
                            navigator.msGetUserMedia;
        
        if (!getUserMedia) {
          return Promise.reject(new Error('getUserMedia is not supported in this browser'));
        }
        
        return new Promise((resolve, reject) => {
          getUserMedia.call(navigator, constraints, resolve, reject);
        });
      };
    }
  }, []);

  // Cleanup function
  const stopCamera = useCallback(() => {
    if (cameraRef.current) {
      try { cameraRef.current.stop(); } catch (e) {}
      cameraRef.current = null;
    }
    if (handsRef.current) {
      try { handsRef.current.close(); } catch (e) {}
      handsRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    const loadScript = (src) => {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
            const script = document.createElement('script');
            script.src = src;
            script.crossOrigin = "anonymous";
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    };

    Promise.all([
        loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"),
        loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js"),
        loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js"),
        loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js")
    ]).then(() => setScriptsLoaded(true)).catch(err => console.error("MediaPipe Load Error", err));
    
    return () => stopCamera();
  }, [stopCamera]);

  const startCamera = useCallback(async () => {
      if (!scriptsLoaded) {
        console.log("Scripts not loaded yet");
        return false;
      }

      // Check if getUserMedia is available after polyfill
      if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
        setError("Browser tidak mendukung akses kamera. Coba gunakan Chrome, Firefox, atau Safari versi terbaru.");
        console.error("getUserMedia not available");
        return false;
      }
      
      stopCamera();
      setError(null);
      
      const constraints = { 
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" }, 
        audio: false 
      };
      
      try {
          console.log("Requesting camera permission...");
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          console.log("Camera access granted");
          streamRef.current = stream;
          
          await new Promise(resolve => setTimeout(resolve, 200));
          
          if (videoRef.current) {
              videoRef.current.srcObject = stream;
              
              await new Promise((resolve) => {
                videoRef.current.onloadedmetadata = resolve;
                setTimeout(resolve, 3000); // Timeout fallback
              });
              
              if (window.Hands) {
                  const hands = new window.Hands({
                    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
                  });
                  handsRef.current = hands;
                  
                  hands.setOptions({ 
                    maxNumHands: 2, 
                    modelComplexity: 1, 
                    minDetectionConfidence: 0.5, 
                    minTrackingConfidence: 0.5 
                  });
                  
                  hands.onResults((results) => {
                      if (!canvasRef.current || !videoRef.current) return;
                      const canvasCtx = canvasRef.current.getContext('2d');
                      if (!canvasCtx) return;
                      canvasCtx.save();
                      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                      if (results.multiHandLandmarks) {
                          for (const landmarks of results.multiHandLandmarks) {
                              if (window.drawConnectors) {
                                window.drawConnectors(canvasCtx, landmarks, window.HAND_CONNECTIONS, {color: '#1d9bf0', lineWidth: 5});
                              }
                              if (window.drawLandmarks) {
                                window.drawLandmarks(canvasCtx, landmarks, {color: '#e7e9ea', lineWidth: 2});
                              }
                          }
                      }
                      canvasCtx.restore();
                  });
                  
                  if (window.Camera) {
                    const camera = new window.Camera(videoRef.current, {
                        onFrame: async () => { 
                          if (videoRef.current && handsRef.current) {
                            try { await handsRef.current.send({image: videoRef.current}); } catch (e) {}
                          }
                        },
                        width: 640, height: 480
                    });
                    cameraRef.current = camera;
                    camera.start();
                  }
              }
          }
          return true;
      } catch (err) { 
        console.error("Camera Error:", err);
        let msg = "Gagal mengakses kamera: ";
        if (err.name === 'NotAllowedError') {
          msg += "Izin kamera ditolak. Klik ikon gembok/kamera di address bar untuk mengizinkan.";
        } else if (err.name === 'NotFoundError') {
          msg += "Kamera tidak ditemukan.";
        } else if (err.name === 'NotReadableError') {
          msg += "Kamera sedang digunakan aplikasi lain.";
        } else if (err.name === 'SecurityError' || err.message?.includes('secure')) {
          msg += "Akses kamera diblokir. Pastikan website diakses via HTTPS.";
        } else {
          msg += err.message || "Error tidak diketahui.";
        }
        setError(msg);
        return false;
      }
  }, [scriptsLoaded, stopCamera]);

  const handleStart = useCallback(async () => {
      if (!role) return;
      setIsSearching(true);
      setError(null);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const success = await startCamera();
      if (!success) {
        setIsSearching(false);
        return;
      }
      
      setTimeout(() => { setIsSearching(false); setIsConnected(true); }, 3000);
  }, [role, startCamera]);

  const handleClose = () => {
    stopCamera();
    setRole(null);
    setIsConnected(false);
    setIsSearching(false);
    setError(null);
  };

  if (!role) {
      return (
          <div className="max-w-[800px] mx-auto w-full px-4 pt-24 md:pt-4 flex flex-col items-center justify-center h-[80vh] animate-fade-in-up">
              <h1 className="text-4xl font-grotesk font-bold text-[#e7e9ea] mb-2 text-center">Live Connect</h1>
              <p className="text-[#71767b] mb-12 text-center max-w-md">Temukan teman bicara baru secara acak. Fitur AI akan membantu menerjemahkan isyarat ke suara dan sebaliknya.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-lg">
                  <button onClick={() => setRole('deaf')} className="group relative overflow-hidden bg-[#16181c] hover:bg-[#1d9bf0] border border-[#2f3336] p-8 rounded-3xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
                      <div className="text-6xl mb-4 group-hover:scale-110 transition duration-300">👋</div>
                      <h3 className="text-xl font-bold text-white mb-2">Saya Tuli</h3>
                      <p className="text-[#71767b] group-hover:text-white/80 text-sm">Saya berkomunikasi dengan Bahasa Isyarat.</p>
                  </button>
                  <button onClick={() => setRole('hearing')} className="group relative overflow-hidden bg-[#16181c] hover:bg-[#00ba7c] border border-[#2f3336] p-8 rounded-3xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
                      <div className="text-6xl mb-4 group-hover:scale-110 transition duration-300">🎙️</div>
                      <h3 className="text-xl font-bold text-white mb-2">Saya Dengar</h3>
                      <p className="text-[#71767b] group-hover:text-white/80 text-sm">Saya berkomunikasi dengan Suara/Teks.</p>
                  </button>
              </div>
          </div>
      )
  }

  return (
      <div className="max-w-[1200px] mx-auto w-full pt-20 md:pt-4 px-0 md:px-4 h-[calc(100vh-80px)] flex flex-col">
          <div className="flex justify-between items-center mb-4 px-4 md:px-0">
              <button onClick={handleClose} className="p-2 bg-[#2f3336] rounded-full text-white hover:bg-[#3f4347] transition"><X/></button>
              <div className="flex items-center gap-2 px-4 py-1 bg-[#16181c] rounded-full border border-[#2f3336]">
                  {isConnected && <div className="w-2 h-2 rounded-full bg-[#f4212e] animate-pulse"></div>}
                  <span className="text-sm font-bold text-[#e7e9ea]">{isConnected ? 'LIVE' : 'MENUNGGU...'}</span>
              </div>
          </div>
          
          <div className="flex-1 bg-[#000000] md:rounded-3xl md:border border-[#2f3336] flex items-center justify-center relative overflow-hidden shadow-2xl">
              {/* Local Video Overlay */}
              {(isSearching || isConnected) && (
                  <div className="absolute top-4 right-4 w-32 h-48 md:w-48 md:h-64 bg-black rounded-xl overflow-hidden border-2 border-[#2f3336] z-20 shadow-lg transition-all hover:scale-105">
                      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]" autoPlay muted playsInline />
                      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]" width={640} height={480} />
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur rounded text-[10px] text-white font-bold">ANDA</div>
                  </div>
              )}

              {/* Main Stage */}
              {error && !isSearching && !isConnected ? (
                  <div className="text-center max-w-md mx-auto px-6">
                      <div className="w-20 h-20 bg-[#f4212e]/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                          <AlertCircle size={40} className="text-[#f4212e]" />
                      </div>
                      <h3 className="text-xl font-bold text-[#e7e9ea] mb-3">Gagal Memulai Kamera</h3>
                      <p className="text-[#71767b] text-sm mb-4">{error}</p>
                      <button onClick={handleClose} className="px-6 py-2 bg-[#2f3336] text-white rounded-full font-medium hover:bg-[#3f4347] transition">
                        Kembali
                      </button>
                  </div>
              ) : isSearching ? (
                  <div className="text-center animate-pulse">
                      <div className="w-24 h-24 rounded-full border-4 border-[#2f3336] border-t-[#1d9bf0] animate-spin mb-6 mx-auto"></div>
                      <h3 className="text-xl font-bold text-[#e7e9ea] mb-2">Mencari Teman Bicara...</h3>
                      <p className="text-[#71767b]">Menghubungkan dengan komunitas...</p>
                  </div>
              ) : isConnected ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#16181c]">
                      <div className="w-32 h-32 bg-[#2f3336] rounded-full flex items-center justify-center text-6xl mb-6 shadow-xl">
                          🤠
                      </div>
                      <h3 className="text-2xl font-bold text-[#e7e9ea]">Terhubung!</h3>
                      <p className="text-[#71767b] mt-2">Mulai percakapan sekarang.</p>
                      
                      {/* AI Translation Box Placeholder */}
                      <div className="absolute bottom-8 left-4 right-4 md:left-20 md:right-20 bg-black/80 backdrop-blur border border-[#2f3336] rounded-2xl p-4 text-center">
                          <p className="text-xs text-[#1d9bf0] font-bold mb-1 uppercase tracking-wide">Terjemahan AI (Real-time)</p>
                          <p className="text-[#e7e9ea] text-lg italic">"Halo, senang bertemu denganmu!"</p>
                      </div>
                  </div>
              ) : (
                  <div className="text-center">
                    <button onClick={handleStart} className="px-10 py-4 bg-[#1d9bf0] text-white rounded-full font-bold text-xl hover:bg-[#1a8cd8] transition transform hover:scale-105 shadow-lg shadow-[#1d9bf0]/20">
                        Mulai Bicara
                    </button>
                  </div>
              )}
          </div>
      </div>
  )
};

export default LiveConnect;