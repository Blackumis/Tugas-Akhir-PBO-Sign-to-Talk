import React from 'react';

const Avatar = ({ src, alt, size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
    xl: "w-20 h-20",
    xxl: "w-[120px] h-[120px] md:w-[150px] md:h-[150px]"
  };
  
  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-[#2f3336] bg-[#16181c] flex-shrink-0 ${className}`}>
      {src && src.startsWith('http') ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-xl select-none">
          {src || '👤'}
        </div>
      )}
    </div>
  );
};

export default Avatar;