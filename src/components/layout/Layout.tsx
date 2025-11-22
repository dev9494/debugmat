import { Header } from './Header';
import { SidebarLeft } from './SidebarLeft';
import { SidebarRight } from './SidebarRight';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-blue-500/30">
            <Header />

            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar - Fixed Width */}
                <aside className="w-[280px] border-r border-white/5 bg-[#0a0a0a] hidden md:flex flex-col sticky top-16 h-[calc(100vh-4rem)]">
                    <SidebarLeft />
                </aside>

                {/* Main Content - Scrollable */}
                <main className="flex-1 overflow-y-auto custom-scrollbar bg-background relative">
                    <div className="max-w-5xl mx-auto p-8 pb-20">
                        {children}
                    </div>
                </main>

                {/* Right Sidebar - Fixed Width */}
                <aside className="w-[320px] border-l border-white/5 bg-[#0a0a0a] hidden xl:flex flex-col sticky top-16 h-[calc(100vh-4rem)]">
                    <SidebarRight />
                </aside>
            </div>
        </div>
    );
};
