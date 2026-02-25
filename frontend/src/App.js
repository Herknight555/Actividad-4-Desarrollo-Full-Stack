import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Playlist from "./components/Playlist";
import AdminUsers from "./components/AdminUsers";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/playlist" element={<Playlist />} />
      <Route path="/admin" element={<AdminUsers />} />
    </Routes>
  );
}

export default App;
