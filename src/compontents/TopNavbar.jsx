import { Stack, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

function TopNavbar() {
  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      justifyContent="center"
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
  );
}

export default TopNavbar;
