import "./App.css";
import { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./Index";
import Show from "./Show";
import NavBar from "./components/NavBar";
import MyList from "./MyList";
import Sidebar from "./components/Sidebar";
import ActorDetail from "./ActorDetail";

const GenreContext = createContext();

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [genreQuery, setGenreQuery] = useState("");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleGenreSelect = (genreId) => {
    setSelectedGenre(genreId);
    setGenreQuery("");
  };

  return (
    <GenreContext.Provider value={{ selectedGenre, setSelectedGenre, genreQuery, setGenreQuery, handleGenreSelect }}>
      <div className="app-container">
        <BrowserRouter>
          <Sidebar 
            onSelectGenre={handleGenreSelect} 
            isMobileSidebarOpen={isMobileSidebarOpen}
            setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          />
          <NavBar 
            isMobileSidebarOpen={isMobileSidebarOpen}
            setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          />
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
    </GenreContext.Provider>
  );
}

export function useGenreContext() {
  return useContext(GenreContext);
}

export default App;
