import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import List from "./components/List";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home route */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<List />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
