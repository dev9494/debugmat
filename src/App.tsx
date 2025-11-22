import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { AnalyticsCards } from './components/dashboard/AnalyticsCards';
import { ErrorInput } from './components/analysis/ErrorInput';
import { AnalysisResults } from './components/analysis/AnalysisResults';
import { CommandPalette } from './components/features/CommandPalette';
import { KeyboardShortcutsHelp } from './components/features/KeyboardShortcutsHelp';
import { useKeyboardShortcuts, type KeyboardShortcut } from './hooks/useKeyboardShortcuts';
import { useErrorStore } from './stores/errorStore';

function App() {
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const { currentAnalysis, currentError } = useErrorStore();

  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'k',
      ctrl: true,
      description: 'Open command palette',
      action: () => setShowCommandPalette(true),
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
        const searchInput = document.querySelector<HTMLInputElement>('input[placeholder*="Search"]');
        searchInput?.focus();
      },
    },
    {
      key: 'Escape',
      description: 'Close modals',
      action: () => {
        setShowCommandPalette(false);
        setShowShortcutsHelp(false);
      },
    },
  ];

  useKeyboardShortcuts({ shortcuts });

  return (
    <>
      <Layout>
        <AnalyticsCards />
        <div className="space-y-8">
          <ErrorInput />
          <AnalysisResults />
        </div>
      </Layout>

      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
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
