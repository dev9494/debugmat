import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { AnalyticsCards } from './components/dashboard/AnalyticsCards';
import { ErrorInput } from './components/analysis/ErrorInput';
import { AnalysisResults } from './components/analysis/AnalysisResults';
import { ErrorClustersView } from './components/features/ErrorClustersView';
import { AnalyticsDashboard } from './components/features/AnalyticsDashboard';
import { AutoFixPanel } from './components/features/AutoFixPanel';
import { PreventionModePanel } from './components/features/PreventionModePanel';
import { ErrorPlayground } from './components/features/ErrorPlayground';
import { GamificationPanel } from './components/features/GamificationPanel';
import { CommandPalette } from './components/features/CommandPalette';
import { KeyboardShortcutsHelp } from './components/features/KeyboardShortcutsHelp';
import { LandingPage } from './components/landing/LandingPage';
import { useKeyboardShortcuts, type KeyboardShortcut } from './hooks/useKeyboardShortcuts';
import { useErrorStore } from './stores/errorStore';
import { useUIStore } from './stores/uiStore';
import { Home, Layers, BarChart3, GitPullRequest, Shield, Code2, Trophy } from 'lucide-react';
import { cn } from './lib/utils';

type View = 'dashboard' | 'clusters' | 'analytics' | 'autofix' | 'prevention' | 'playground' | 'gamification';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const { currentAnalysis, currentError } = useErrorStore();
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useUIStore();

  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'k',
      ctrl: true,
      description: 'Open command palette',
      action: () => setCommandPaletteOpen(true),
    },
    {
      key: '/',
      ctrl: true,
      description: 'Show keyboard shortcuts',
      action: () => setShowShortcutsHelp(true),
    },
    {
      key: '?',
      description: 'Show keyboard shortcuts',
      action: () => setShowShortcutsHelp(true),
    },
    {
      key: 'c',
      ctrl: true,
      description: 'Copy current error',
      action: () => {
        if (currentAnalysis && currentError) {
          // Trigger copy button click
          const copyButton = document.querySelector<HTMLButtonElement>('button[class*="Copy"]');
          copyButton?.click();
        }
      },
    },
    {
      key: 'f',
      ctrl: true,
      description: 'Focus search',
      action: () => {
        setCommandPaletteOpen(true);
      },
    },
    {
      key: 'Escape',
      description: 'Close modals',
      action: () => {
        setCommandPaletteOpen(false);
        setShowShortcutsHelp(false);
      },
    },
  ];

  useKeyboardShortcuts({ shortcuts });

  if (showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  return (
    <>
      <Layout>
        {/* View Navigation Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/10 pb-4 overflow-x-auto">
          <button
            onClick={() => setActiveView('dashboard')}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap',
              activeView === 'dashboard'
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white'
            )}
          >
            <Home className="w-4 h-4" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveView('clusters')}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap',
              activeView === 'clusters'
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white'
            )}
          >
            <Layers className="w-4 h-4" />
            Clusters
          </button>
          <button
            onClick={() => setActiveView('analytics')}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap',
              activeView === 'analytics'
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white'
            )}
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </button>
          <button
            onClick={() => setActiveView('autofix')}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap',
              activeView === 'autofix'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white'
            )}
          >
            <GitPullRequest className="w-4 h-4" />
            Auto-Fix
          </button>
          <button
            onClick={() => setActiveView('prevention')}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap',
              activeView === 'prevention'
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white'
            )}
          >
            <Shield className="w-4 h-4" />
            Prevention
          </button>
          <button
            onClick={() => setActiveView('playground')}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap',
              activeView === 'playground'
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white'
            )}
          >
            <Code2 className="w-4 h-4" />
            Playground
          </button>
          <button
            onClick={() => setActiveView('gamification')}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap',
              activeView === 'gamification'
                ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/20'
                : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white'
            )}
          >
            <Trophy className="w-4 h-4" />
            Progress
          </button>
        </div>

        {/* View Content */}
        {activeView === 'dashboard' ? (
          <>
            <AnalyticsCards />
            <div className="space-y-8">
              <ErrorInput />
              <AnalysisResults />
            </div>
          </>
        ) : activeView === 'clusters' ? (
          <ErrorClustersView />
        ) : activeView === 'analytics' ? (
          <AnalyticsDashboard />
        ) : activeView === 'autofix' ? (
          <AutoFixPanel />
        ) : activeView === 'prevention' ? (
          <PreventionModePanel />
        ) : activeView === 'playground' ? (
          <ErrorPlayground />
        ) : (
          <GamificationPanel />
        )}
      </Layout>

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      <KeyboardShortcutsHelp
        isOpen={showShortcutsHelp}
        onClose={() => setShowShortcutsHelp(false)}
        shortcuts={shortcuts}
      />
    </>
  );
}

export default App;
