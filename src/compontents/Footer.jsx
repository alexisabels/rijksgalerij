import { Stack, Typography } from "@mui/material";

function Footer() {
  return (
    <Stack
      direction="row"
      gap={5}
      sx={{
        backgroundColor: "#f5f5f5",
        justifyContent: "center",
        padding: "10px 0",
      }}
    >
      <Typography
        variant="overline"
        gutterBottom
        sx={{ display: "block", color: "#333" }}
      >
        MADE BY ALEXISABEL
      </Typography>
      -
      <Typography variant="overline" gutterBottom sx={{ display: "block" }}>
        <a href="https://github.com/alexisabels" style={{ color: "#333" }}>
          GITHUB
        </a>{" "}
        /{" "}
        <a href="https://linkedin.com/in/alexisabel" style={{ color: "#333" }}>
          LINKEDIN
        </a>
      </Typography>
    </Stack>
  );
}

export default Footer;
