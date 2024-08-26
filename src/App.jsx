import React, { useState, useEffect, cloneElement } from "react";
import "./App.css";
import { getByName } from "./lib/api";
import ArtCard from "./ArtCard";
import { Input, Stack, TextField } from "@mui/material";

function App() {
  const [art, setArt] = useState(null);
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
      <h1>Rijksgalerij</h1>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <Stack direction={"row"} gap={3} margin={0} justifyContent={"center"}>
            <TextField
              variant="outlined"
              type="text"
              name="queryName"
              id="queryName"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter art name"
              color="warning"
              sx={{ input: { color: "white" } }}
            />
            <button type="submit">Buscar</button>
          </Stack>
        </form>
      </div>
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : art ? (
          <ArtCard
            title={art.title}
            author={art.author}
            imageUrl={art.imageUrl}
          />
        ) : (
          <p>Introduce un nombre o palabra para realizar tu primera búsqueda</p>
        )}
      </div>
    </>
  );
}

export default App;
