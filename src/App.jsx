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
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          padding: 0,
          margin: 0,
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <RouterLink to="/" style={{ textDecoration: "none" }}>
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
                "&:hover": {
                  textShadow: "0 1px 3px rgba(0, 0, 0, 0.25)",
                  color: "#000",
                },
              }}
            >
              Rijksgalerij
            </Typography>
          </RouterLink>
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
                borderColor: "#333",
                color: "#333",
                borderRadius: 0,
                "&:hover": {
                  borderColor: "#000",
                  color: "#000",
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
                borderColor: "#333",
                color: "#333",
                borderRadius: 0,

                "&:hover": {
                  borderColor: "#000",
                  color: "#000",
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
                borderColor: "#333",
                color: "#333",
                borderRadius: 0,

                "&:hover": {
                  borderColor: "#000",
                  color: "#000",
                },
              }}
            >
              About
            </Button>
          </Stack>
          <RoutesManager />
        </Box>
        <Stack
          direction="row"
          gap={5}
          sx={{
            backgroundColor: "#f5f5f5",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="overline"
            gutterBottom
            sx={{ display: "block", color: "#333" }}
          >
            MADE BY ALEXISABEL
          </Typography>{" "}
          -
          <Typography variant="overline" gutterBottom sx={{ display: "block" }}>
            <a href="https://github.com/alexisabels" style={{ color: "#333" }}>
              GITHUB
            </a>{" "}
            /{" "}
            <a
              href="https://linkedin.com/in/alexisabel"
              style={{ color: "#333" }}
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
