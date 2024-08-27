import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getById } from "./lib/api";
import { Box, Chip, Stack, Typography } from "@mui/material";

function ArtDetails() {
  const { id } = useParams();
  const [artDetails, setArtDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtDetails = async () => {
      try {
        const details = await getById(id);
        setArtDetails(details);
      } catch (error) {
        console.error("Error fetching art details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!artDetails) return <div>No data found</div>;

  const {
    longTitle,
    label,
    plaqueDescriptionEnglish,
    description,
    dating,
    dimensions,
    physicalMedium,
    webImage,
  } = artDetails;

  return (
    <Box padding={2} maxWidth="100vh">
      <Stack
        direction={{ xs: "column-reverse", sm: "row" }}
        spacing={2}
        alignItems="center"
      >
        <Box flex={1}>
          <Typography variant="h4" gutterBottom>
            {longTitle}
          </Typography>
          <Typography
            variant="subtitle1"
            style={{ color: "gray" }}
            gutterBottom
          >
            {label?.makerLine}
          </Typography>
          <Typography variant="body1">
            {plaqueDescriptionEnglish || description}
          </Typography>
          <Stack direction="row" spacing={1} marginTop={2}>
            <Chip
              style={{ color: "gray" }}
              label={dating?.presentingDate || "Date Unknown"}
            />
            <Chip
              style={{ color: "gray" }}
              label={`${dimensions?.[0]?.value || "0"} x ${
                dimensions?.[1]?.value || "0"
              } x ${dimensions?.[2]?.value || "0"} cm`}
            />
            <Chip
              style={{ color: "gray" }}
              label={physicalMedium || "Medium Unknown"}
              sx={{ textTransform: "capitalize" }}
            />
          </Stack>
        </Box>
        <Box flex={1} display="flex" justifyContent="center">
          {webImage && (
            <img
              src={webImage.url}
              alt={longTitle}
              style={{ maxWidth: "100%", height: "auto", maxHeight: "60vh" }}
            />
          )}
        </Box>
      </Stack>
    </Box>
  );
}

export default ArtDetails;
