import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StartView } from "../views/StartView";
import { KidsView } from "../views/KidsView";
import { ParentView } from "../views/ParentView";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartView />} />
        <Route path="/kids" element={<KidsView />} />
        <Route path="/parent" element={<ParentView />} />
      </Routes>
    </BrowserRouter>
  );
}
