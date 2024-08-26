import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import React from "react";

function ArtCard({ title, author, imageUrl }) {
  return (
    <Card sx={{ maxWidth: 345, borderRadius: 3 }}>
      <CardMedia sx={{ height: 200 }} image={imageUrl} component="img" />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {author}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" sx={{ margin: "auto" }}>
          Ver más
        </Button>
      </CardActions>
    </Card>
  );
}

export default ArtCard;
