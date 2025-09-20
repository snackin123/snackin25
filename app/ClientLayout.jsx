'use client';

import dynamic from 'next/dynamic';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

export default function ClientLayout({ children }) {
  return (
    <>
      {/* <Cursor /> */}
      <Navbar />
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
