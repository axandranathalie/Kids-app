import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StartView } from "../views/StartView";
import { KidsView } from "../views/KidsView";
import { ParentView } from "../views/ParentView";
import { ActivitySuggestionView } from "../views/ActivitySuggestionView";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartView />} />
        <Route path="/kids" element={<KidsView />} />
        <Route path="/activity-suggestion" element={<ActivitySuggestionView />} />
        <Route path="/parent" element={<ParentView />} />
      </Routes>
    </BrowserRouter>
  );
}
