import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import ExpressPage from "@/pages/ExpressPage";
import ColdChainPage from "@/pages/ColdChainPage";
import SameCityPage from "@/pages/SameCityPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/express" element={<ExpressPage />} />
        <Route path="/cold-chain" element={<ColdChainPage />} />
        <Route path="/same-city" element={<SameCityPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
