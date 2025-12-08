import { Link, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Usuarios from "./pages/Usuarios";

function App() {
  return (
    <div style={{ padding: "1.5rem", fontFamily: "sans-serif" }}>
      {/* Menú */}
      <nav style={{ marginBottom: "1rem" }}>
        <Link to="/" style={{ marginRight: "1rem" }}>Inicio</Link>
        <Link to="/about" style={{ marginRight: "1rem" }}>Acerca de</Link>
        <Link to="/usuarios">Usuarios</Link>
      </nav>

      <hr />

      {/* Rutas */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="*" element={<h2>Página no encontrada (404)</h2>} />
      </Routes>
    </div>
  );
}

export default App;
