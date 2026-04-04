import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function Loading({ color = "#ff7a59", size = 26 }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <CircularProgress size={size} sx={{ color: color }} />
    </Box>
  );
}

export default Loading;
