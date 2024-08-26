import { useState } from "react";

import "./App.css";
import { getByMaker, getByName } from "./lib/api";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div></div>
      <h1>Rijksgalerij</h1>
      <div className="card">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const value = document.getElementById("queryName").value;
            getByName(value);
          }}
        >
          {" "}
          <input type="text" name="queryName" id="queryName" />
          <button type="submit">Buscar</button>
        </form>
      </div>
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia sx={{ height: 140 }} src="" component="img" id="imgcard" />
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            id="artName"
          ></Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            id="author"
          ></Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    </>
  );
}

export default App;
