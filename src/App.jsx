import { BrowserRouter as Router } from "react-router-dom";
import { Box } from "@mui/material";
import RoutesManager from "./Routes";
import Header from "./compontents/Header";
import Footer from "./compontents/Footer";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap/dist/css/bootstrap.css";

function App() {
  return (
    <Router>
      <Box
        className="App"
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          padding: 0,
          margin: 0,
        }}
      >
        <Header />
        <Box sx={{ flex: 1 }}>
          <RoutesManager />
        </Box>
        <Footer />
      </Box>
    </Router>
  );
}

export default App;
