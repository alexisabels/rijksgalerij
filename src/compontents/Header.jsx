import { Typography, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import TopNavbar from "./TopNavbar";

function Header() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        marginBottom: "20px",
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
            transition: "color 0.3s ease, text-shadow 0.3s ease",
            "&:hover": {
              textShadow: "0 1px 3px rgba(0, 0, 0, 0.25)",
              color: "#000",
            },
          }}
        >
          Rijksgalerij
        </Typography>
      </RouterLink>
      <TopNavbar />
    </Box>
  );
}

export default Header;
