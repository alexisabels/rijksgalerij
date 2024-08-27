import DefaultCarousel from "./DefaultCarousel";
import data from "../public/homedata.json";
import { Box } from "@mui/material";

function Home() {
  return (
    <Box
      sx={{
        overflowX: "hidden",
        overflowY: "hidden",
        padding: 0,
        margin: 0,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <DefaultCarousel art={data} />
    </Box>
  );
}

export default Home;
