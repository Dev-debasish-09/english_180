import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { ProgressPage } from "./pages/Progress";
import { ComingSoon } from "./pages/ComingSoon";
import { GuidePage } from "./pages/Guide";
import { SettingsPage } from "./pages/Settings";
import { ensureSettings } from "./db/db";
import { useSettings } from "./hooks/useSettings";

function DarkModeEffect() {
  const settings = useSettings();

  useEffect(() => {
    if (!settings) return;
    document.documentElement.classList.toggle("dark", settings.darkMode);
  }, [settings?.darkMode]);

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
          <Route
            path="watch"
            element={<ComingSoon title="Watch and learn" phase="Phase 2" taskField="watchDone" />}
          />
          <Route
            path="grammar"
            element={<ComingSoon title="Grammar" phase="Phase 2" taskField="grammarDone" />}
          />
          <Route
            path="reading"
            element={<ComingSoon title="Reading" phase="Phase 3" taskField="readingDone" />}
          />
          <Route
            path="vocabulary"
            element={<ComingSoon title="Vocabulary" phase="Phase 2" taskField="vocabularyDone" />}
          />
          <Route
            path="writing"
            element={<ComingSoon title="Writing" phase="Phase 3" taskField="writingDone" />}
          />
          <Route
            path="speaking"
            element={<ComingSoon title="Speaking" phase="Phase 4" taskField="speakingDone" />}
          />
          <Route
            path="resources"
            element={<ComingSoon title="Resources" phase="Phase 5" taskField="extraDone" />}
          />
          <Route path="guide" element={<GuidePage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
