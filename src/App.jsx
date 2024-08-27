import { BrowserRouter as Router } from "react-router-dom";
import { Stack, Typography, Box, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import RoutesManager from "./Routes";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap/dist/css/bootstrap.css";

const App = () => {
  return (
    <Router>
      <Box
        className="App"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          textAlign: "center",
          minHeight: "100vh",
          padding: 0,
          margin: 0,
          backgroundColor: "#f5f5f5",
        }}
      >
        <Typography
          variant="h1"
          component="h2"
          sx={{
            fontFamily: "Inter, sans-serif",
            fontSize: "2.5em",
            lineHeight: 1.1,
            fontWeight: "bold",
            margin: "10px 0",
            color: "#333",
            paddingY: 2.5,
          }}
        >
          Rijksgalerij
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="center"
          sx={{ marginBottom: "20px" }}
        >
          <Button
            component={RouterLink}
            to="/"
            variant="outlined"
            sx={{
              borderColor: "#000",
              color: "#000",
              "&:hover": {
                borderColor: "#333",
                color: "#333",
              },
            }}
          >
            Home
          </Button>
          <Button
            component={RouterLink}
            to="/search"
            variant="outlined"
            sx={{
              borderColor: "#000",
              color: "#000",
              "&:hover": {
                borderColor: "#333",
                color: "#333",
              },
            }}
          >
            Search
          </Button>
          <Button
            component={RouterLink}
            to="/about"
            variant="outlined"
            sx={{
              borderColor: "#000",
              color: "#000",
              "&:hover": {
                borderColor: "#333",
                color: "#333",
              },
            }}
          >
            About
          </Button>
        </Stack>
        <RoutesManager />
        <Stack
          direction="row"
          gap={5}
          sx={{
            marginTop: "auto",
            paddingBottom: 2,
          }}
        >
          <Typography variant="overline" gutterBottom sx={{ display: "block" }}>
            MADE BY ALEXISABEL
          </Typography>{" "}
          -
          <Typography variant="overline" gutterBottom sx={{ display: "block" }}>
            <a
              href="https://github.com/alexisabels"
              style={{ color: "inherit" }}
            >
              GITHUB
            </a>{" "}
            /{" "}
            <a
              href="https://linkedin.com/in/alexisabel"
              style={{ color: "inherit" }}
            >
              LINKEDIN
            </a>
          </Typography>
        </Stack>
      </Box>
    </Router>
  );
};

export default App;
