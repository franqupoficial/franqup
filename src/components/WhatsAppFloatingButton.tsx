"use client";

import React from 'react';

export default function WhatsAppFloatingButton() {
  const whatsappUrl = "https://wa.me/5541997472535";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-50 p-3 bg-[#25d366] text-white rounded-full shadow-lg transition-transform transform hover:scale-110 flex items-center justify-center"
      style={{ width: '80px', height: '80px' }}
    >
      <span className="text-sm font-semibold">Suporte</span>
    </a>
  );
}