"use client";

import Link from 'next/link';

import { useState, useEffect } from 'react';

const messages = [
  { text: "Buy now and pay later with Shop Pay", link: "https://www.google.com" },
  { text: "Fast and easy returns", link: "https://www.google.com" },
  "Free shipping on orders over $50",
];

export default function Header() {
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 5000); // Change message every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div >
      <header className='text-center bg-white text-black py-2 px-4 border-b border-gray-200 '>
        <div className='animate- duration-75'>
          {typeof messages[currentMessage] === 'string' ? (
            messages[currentMessage]
          ) : (
            <Link 
              href={messages[currentMessage].link} 
              className='hover:underline hover:text-gray-300 transition-colors'
            >
              {messages[currentMessage].text}
            </Link>
          )}
        </div>
      </header>
      
      
    </div>
  );
}
