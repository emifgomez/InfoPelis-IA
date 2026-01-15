import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./Index";
import Show from "./Show";
import NavBar from "./components/NavBar";
import MyList from "./MyList";
import Sidebar from "./components/Sidebar";
import ActorDetail from "./ActorDetail";

function App() {
  return (
    <div style={{ display: "flex" }}>
      <BrowserRouter>
        <Sidebar onSelectGenre={(id) => console.log("Filtrar por:", id)} />
        <NavBar />
        <Routes>
          <Route path="/mi-lista" element={<MyList />} />
          <Route path="/" element={<Index />} />
          <Route path="/show/:type/:id" element={<Show />} />
          <Route path="/:type/:id" element={<Show />} />
          <Route path="/actor/:id" element={<ActorDetail />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
