import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./Index";
import Show from "./Show";
import NavBar from "./components/NavBar";
import MyList from "./MyList";
import Sidebar from "./components/Sidebar";
import ActorDetail from "./ActorDetail";

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="app-container">
      <BrowserRouter>
        {!isMobile && <Sidebar onSelectGenre={(id) => console.log("Filtrar por:", id)} />}
        <NavBar />
        <div className="main-content">
          <Routes>
            <Route path="/mi-lista" element={<MyList />} />
            <Route path="/" element={<Index />} />
            <Route path="/show/:type/:id" element={<Show />} />
            <Route path="/:type/:id" element={<Show />} />
            <Route path="/actor/:id" element={<ActorDetail />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
