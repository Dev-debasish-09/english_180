import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { ProgressPage } from "./pages/Progress";
import { ComingSoon } from "./pages/ComingSoon";
import { GuidePage } from "./pages/Guide";
import { SettingsPage } from "./pages/Settings";
import { GrammarPage } from "./pages/Grammar";
import { ReadingPage } from "./pages/Reading";
import { VocabularyPage } from "./pages/Vocabulary";
import { WritingPage } from "./pages/Writing";
import { SpeakingPage } from "./pages/Speaking";
import { ensureSettings } from "./db/db";
import { useSettings } from "./hooks/useSettings";

function DarkModeEffect() {
  const settings = useSettings();
  const darkMode = settings?.darkMode ?? false;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return null;
}

function App() {
  useEffect(() => {
    ensureSettings();
  }, []);

  return (
    <BrowserRouter>
      <DarkModeEffect />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="grammar" element={<GrammarPage />} />
          <Route path="reading" element={<ReadingPage />} />
          <Route path="vocabulary" element={<VocabularyPage />} />
          <Route path="writing" element={<WritingPage />} />
          <Route path="speaking" element={<SpeakingPage />} />
          <Route path="resources" element={<ComingSoon title="Resources" phase="Phase 5" />} />
          <Route path="guide" element={<GuidePage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
