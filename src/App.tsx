import { useState } from 'react';
import { MainMenu } from './components/Menu/MainMenu';
import { GameScene } from './components/Game/GameScene';
import { ResultPanel } from './components/Result/ResultPanel';
import { LearnPanel } from './components/Learn/LearnPanel';
import { WeekChallenge } from './components/Week/WeekChallenge';
import { useGameStore } from './store/gameStore';
import { eventSystem } from './game/systems/EventSystem';
import type { Difficulty, GameResult } from './game/types/game';

type View = 'menu' | 'game' | 'result' | 'learn' | 'week';

function App() {
  const [view, setView] = useState<View>('menu');
  const [lastResult, setLastResult] = useState<GameResult | null>(null);
  const [lastDifficulty, setLastDifficulty] = useState<Difficulty>('easy');
  const [weekDifficulty, setWeekDifficulty] = useState<Difficulty>('normal');
  const [loadWeekId, setLoadWeekId] = useState<string | undefined>(undefined);
  const startGame = useGameStore((s) => s.startGame);

  const handleStartGame = (difficulty: Difficulty) => {
    setLastDifficulty(difficulty);
    setView('game');
  };

  const handleStartWeek = (difficulty: Difficulty) => {
    setWeekDifficulty(difficulty);
    setLoadWeekId(undefined);
    setView('week');
  };

  const handleLoadWeek = (id: string) => {
    setLoadWeekId(id);
    setView('week');
  };

  const handleGameEnd = (result: GameResult, difficulty: Difficulty) => {
    setLastResult(result);
    setLastDifficulty(difficulty);
    setView('result');
  };

  const handleRetry = () => {
    startGame(lastDifficulty);
    setView('game');
  };

  const handleNextLevel = () => {
    const next: Difficulty = lastDifficulty === 'easy' ? 'normal' : 'hard';
    startGame(next);
    setLastDifficulty(next);
    eventSystem.reset();
    eventSystem.start();
    setView('game');
  };

  const handleBackToMenu = () => {
    eventSystem.stop();
    setView('menu');
  };

  return (
    <div className="min-h-screen">
      {view === 'menu' && (
        <MainMenu
          onStartGame={handleStartGame}
          onStartWeek={handleStartWeek}
          onLoadWeek={handleLoadWeek}
          onOpenLearn={() => setView('learn')}
        />
      )}
      {view === 'game' && <GameScene onGameEnd={handleGameEnd} />}
      {view === 'result' && lastResult && (
        <ResultPanel
          result={lastResult}
          difficulty={lastDifficulty}
          onRetry={handleRetry}
          onMenu={handleBackToMenu}
          onNextLevel={lastDifficulty !== 'hard' ? handleNextLevel : undefined}
        />
      )}
      {view === 'learn' && <LearnPanel onBack={handleBackToMenu} />}
      {view === 'week' && (
        <WeekChallenge
          difficulty={weekDifficulty}
          onExit={handleBackToMenu}
          existingWeekId={loadWeekId}
        />
      )}
    </div>
  );
}

export default App;
