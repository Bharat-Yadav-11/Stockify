import React, { useEffect } from "react";
import { Box, Chip, Grid, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Outlet, useNavigate } from "react-router-dom";
import Watchlist from "../../components/watchlist/Watchlist";
import SurfaceCard from "../../components/ui/SurfaceCard";
import { MotionBox, fadeInUp, staggerContainer } from "../../components/ui/Motion";
import { colors } from "../../theme/Theme";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("cmUser")) {
      navigate("/signup", { replace: true });
    } else if (window.location.pathname === "/app") {
      navigate("/app/dashboard", { replace: true });
    }
  }, [navigate]);

  return (
    <Box sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 3 } }}>
      <Grid
        component={MotionBox}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        container
        spacing={2.5}
      >
        <Grid item xs={12} lg={4}>
          <MotionBox variants={fadeInUp}>
            <SurfaceCard
              sx={{
                height: "100%",
                minHeight: 780,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(circle at top left, rgba(79, 209, 197, 0.12), transparent 28%), radial-gradient(circle at bottom right, rgba(255, 122, 89, 0.16), transparent 25%)",
                  pointerEvents: "none",
                }}
              />
              <Stack spacing={1} sx={{ position: "relative", mb: 2.5 }}>
                <Chip
                  label="Market radar"
                  sx={{
                    alignSelf: "flex-start",
                    color: colors.textPrimary,
                    backgroundColor: alpha(colors.accent, 0.12),
                  }}
                />
                <Typography variant="h5">Watchlist</Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  Search scrips, monitor price movement, and launch orders or charts from one compact panel.
                </Typography>
              </Stack>
              <Watchlist />
            </SurfaceCard>
          </MotionBox>
        </Grid>
        <Grid item xs={12} lg={8}>
          <MotionBox variants={fadeInUp}>
            <SurfaceCard
              sx={{
                minHeight: 780,
                background: `linear-gradient(180deg, ${alpha(colors.surface, 0.88)} 0%, ${alpha(colors.surfaceAlt, 0.94)} 100%)`,
              }}
            >
              <Outlet />
            </SurfaceCard>
          </MotionBox>
        </Grid>
      </Grid>
    </Box>
  );
}
