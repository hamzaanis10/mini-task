import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import List from "./components/List";
import PrivateRoute from "./components/PrivateRoute"; // Import the PrivateRoute component

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login route */}
        <Route path="/login" element={<Login />} />

        {/* Protected route */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<List />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
