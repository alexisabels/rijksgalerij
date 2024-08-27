import { Box, Typography, Link } from "@mui/material";

function About() {
  return (
    <Box maxWidth="60%" margin="auto" padding={2}>
      <Typography paragraph>
        This project is a web application that allows users to explore and
        search through the Rijksmuseum's art collection.
      </Typography>
      <Typography paragraph>
        Built with
        <Link
          href="https://react.dev/"
          color="inherit"
          underline="hover"
          sx={{ fontWeight: "bold", marginX: 0.5 }}
        >
          React
        </Link>
        and
        <Link
          href="https://mui.com/"
          color="inherit"
          underline="hover"
          sx={{ fontWeight: "bold", marginX: 0.5 }}
        >
          Material-UI
        </Link>
        on the frontend, it utilizes the official
        <Link
          href="https://data.rijksmuseum.nl/object-metadata/api/#collection-api"
          color="#F5C300"
          underline="hover"
          sx={{ fontWeight: "bold", marginX: 0.5 }}
        >
          Rijksmuseum API
        </Link>
        to fetch and display detailed information about various artworks.
      </Typography>
      <Typography paragraph>
        The goal is to provide an easy and accessible way for users to discover
        and appreciate the museum's vast collection.
      </Typography>
    </Box>
  );
}

export default About;
