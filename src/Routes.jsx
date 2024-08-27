import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import Search from "./Search";
import About from "./About";
import ArtDetails from "./ArtDetails";
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
