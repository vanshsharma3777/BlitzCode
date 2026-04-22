'use client'

import React from 'react';

export default function QuestionLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-bg z-50">
      <div className="flex flex-col items-center gap-6">
        {/* Brand Header */}
        <h1 className="text-3xl font-semibold">
          <span>Biltz</span>
          <span className="text-accent">Code</span>
        </h1>

        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-accent/20 blur-md animate-pulse"></div>
          
          <div className="relative w-8 h-8 border-2 border-neutral-700 border-t-accent rounded-full animate-spin"></div>
        </div>

        {/* Status Text */}
        <div className="text-center">
          <p className="text-sm font-medium text-neutral-400 uppercase tracking-widest animate-pulse">
            Finding Your Best Match Questions
          </p>
        </div>
      </div>
    </div>
  );
}