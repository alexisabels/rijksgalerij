import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import About from "./pages/About";
import ArtDetails from "./pages/ArtDetails";
const RoutesManager = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/about" element={<About />} />
      <Route path="/art/:id" element={<ArtDetails />} />
    </Routes>
  );
};

export default RoutesManager;
