'use client'

import React from 'react';

export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-bg z-50">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-3xl font-semibold">
          <span>Biltz</span>
          <span className="text-accent">Code</span>
        </h1>
        <div className="w-8 h-8 border-2 border-neutral-700 border-t-accent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}