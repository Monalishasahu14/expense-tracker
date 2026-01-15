import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export const Layout = () => {
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[var(--bg-main)] flex">
            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full h-[60px] bg-[var(--bg-card)] border-b border-[var(--border)] z-30 flex items-center justify-between px-4">
                <span className="font-bold text-lg">Expensr</span>
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={() => setMobileMenuOpen(false)}>
                    <div className="bg-[var(--bg-card)] w-[70%] h-full pt-[80px]" onClick={e => e.stopPropagation()}>
                        <Sidebar />
                        {/* Note: Sidebar component needs slight adjustment to work well as mobile drawer, or duplicate logic here. 
                        For simplicity, proceeding with just hiding styling override via css or creating specific MobileSidebar later.
                        For now, Sidebar logic expects to be fixed sidebar. 
                    */}
                    </div>
                </div>
            )}

            <main className="flex-1 md:ml-[280px] p-4 md:p-8 pt-[80px] md:pt-8 w-full overflow-x-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 15, filter: 'blur(5px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -15, filter: 'blur(5px)' }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="h-full max-w-7xl mx-auto"
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    )
}
