import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ToolDetailPage from './pages/ToolDetailPage';
import TrackerPage from './pages/TrackerPage';
import StrategyPage from './pages/StrategyPage';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-surface-secondary">
          <Navbar />
          <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-6">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/tool/:slug" element={<ToolDetailPage />} />
              <Route path="/tracker" element={<TrackerPage />} />
              <Route path="/strategy" element={<StrategyPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
