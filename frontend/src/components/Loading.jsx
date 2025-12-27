import React from 'react';

export default function Loading() {
  return (
    <div className="w-full h-screen bg-black flex items-center justify-center text-cyan-500 font-mono tracking-widest text-sm uppercase">
      <div className="animate-pulse">Initializing Vault...</div>
    </div>
  );
}
