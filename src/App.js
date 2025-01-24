import "./App.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import OutfitDetailsPage from "./screens/OutfitDetailsPage";
import HomePage from "./screens/HomePage";

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/outfit/:id" element={<OutfitDetailsPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
