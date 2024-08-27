import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import Search from "./Search";

const RoutesManager = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
    </Routes>
  );
};

export default RoutesManager;
