import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../Navbar';
import { Sidebar } from './Sidebar';

export const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className='min-h-screen bg-background-primary transition-colors duration-300'>
      <div className='fixed top-0 left-0 right-0 z-50'>
        <Navbar onToggleSidebar={toggleSidebar} />
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isMobile={isMobile}
      />

      <main
        className={`min-h-screen pt-16 transition-all duration-300 ${
          !isMobile && isSidebarOpen ? 'pl-64' : 'pl-0'
        }`}
      >
        <div className='mx-auto max-w-7xl p-4 sm:px-6 lg:px-8 py-8'>
          <Outlet />
        </div>
      </main>
    </div>
  );
};
