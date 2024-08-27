import { useState } from "react";
import "./App.css";
import { getByName } from "./lib/api";
import ArtCard from "./ArtCard";
import {
  Grid,
  Stack,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";

function Search() {
  const [art, setArt] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const artData = await getByName(query);
    setArt(artData);
    setLoading(false);
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          padding: 3,
          backgroundColor: "#f5f5f5",
          marginBottom: 4,
          borderRadius: 2,
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <TextField
              variant="outlined"
              type="text"
              name="queryName"
              id="queryName"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by artist or artwork..."
              color="primary"
              sx={{
                input: { color: "#333" },
                backgroundColor: "#fff",
                borderRadius: 1,
                width: { xs: "100%", sm: "400px" },
                "& .MuiOutlinedInput-root": {
                  height: "100%",
                  "& fieldset": {
                    borderColor: "#ccc",
                  },
                  "&:hover fieldset": {
                    borderColor: "#999",
                  },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              sx={{
                height: "56px",
                textTransform: "none",
                backgroundColor: "#333",
                "&:hover": {
                  backgroundColor: "#555",
                },
                color: "#fff",
                borderRadius: 1,
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Search"
              )}
            </Button>
          </Stack>
        </form>
      </Paper>
      <div>
        {loading ? (
          <Typography variant="h6" align="center" color="textSecondary">
            <CircularProgress color="inherit" />
            <br />
            Loading...
          </Typography>
        ) : art.length > 0 ? (
          <Grid container spacing={4} sx={{ padding: 2 }}>
            {art.map((artItem) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={artItem.title}>
                <ArtCard
                  title={artItem.title}
                  author={artItem.author}
                  imageUrl={artItem.imageUrl}
                  sx={{
                    borderRadius: 2,
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="h6" align="center" color="textSecondary">
            Enter a name or keyword to start your first search.
          </Typography>
        )}
      </div>
    </>
  );
}

export default Search;
