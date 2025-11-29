import { Header } from './Header';
import { SidebarLeft } from './SidebarLeft';
import { SidebarRight } from './SidebarRight';
import { Background } from './Background';
import { ActivityTicker } from '../features/ActivityTicker';
import { cn } from '../../lib/utils';

interface LayoutProps {
    children: React.ReactNode;
    fullWidth?: boolean;
    showSidebars?: boolean;
}

export const Layout = ({ children, fullWidth = false, showSidebars = true }: LayoutProps) => {
    return (
        <div className="min-h-screen flex flex-col font-sans selection:bg-blue-500/30 relative overflow-hidden">
            <Background />

            <div className="relative z-10 flex flex-col min-h-screen">
                <Header />
                <ActivityTicker />

                <div className="flex flex-1 overflow-hidden">
                    {/* Left Sidebar - Glass Effect */}
                    {showSidebars && (
                        <aside className="w-[280px] border-r border-white/5 bg-[#0f172a]/30 backdrop-blur-md hidden md:flex flex-col sticky top-[calc(4rem+2.5rem)] h-[calc(100vh-6.5rem)]">
                            <SidebarLeft />
                        </aside>
                    )}

                    {/* Main Content - Scrollable */}
                    <main className="flex-1 overflow-y-auto custom-scrollbar relative">
                        <div className={cn(
                            "mx-auto h-full",
                            fullWidth ? "max-w-full" : "max-w-7xl p-6 pb-20"
                        )}>
                            {children}
                        </div>
                    </main>

                    {/* Right Sidebar - Glass Effect */}
                    {showSidebars && (
                        <aside className="w-[320px] border-l border-white/5 bg-[#0f172a]/30 backdrop-blur-md hidden xl:flex flex-col sticky top-[calc(4rem+2.5rem)] h-[calc(100vh-6.5rem)]">
                            <SidebarRight />
                        </aside>
                    )}
                </div>
            </div>
        </div>
    );
};
