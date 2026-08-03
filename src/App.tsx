import { HashRouter, Routes, Route } from 'react-router-dom';
import { MainMenu } from '@/pages/MainMenu';
import { NewGame } from '@/pages/NewGame';
import { Dashboard } from '@/pages/Dashboard';

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/new-game" element={<NewGame />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </HashRouter>
  );
}
