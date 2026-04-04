import { Box, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import SurfaceCard from "./SurfaceCard";
import { MotionBox, fadeInUp, staggerContainer } from "./Motion";
import { colors } from "../../theme/Theme";

function AuthShell({ title, subtitle, sideTitle, sideText, children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: { xs: 2, md: 4 },
        py: { xs: 3, md: 5 },
        display: "flex",
        alignItems: "center",
      }}
    >
      <Stack
        component={MotionBox}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        direction={{ xs: "column", lg: "row" }}
        spacing={3}
        sx={{ width: "100%", maxWidth: 1240, mx: "auto" }}
      >
        <SurfaceCard
          sx={{
            flex: 1,
            minHeight: { lg: 640 },
            display: "flex",
            alignItems: "stretch",
            overflow: "hidden",
            p: 0,
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            sx={{ width: "100%", minHeight: "100%" }}
          >
            <Box
              component={MotionBox}
              variants={fadeInUp}
              sx={{
                flex: 0.95,
                p: { xs: 3, md: 4 },
                background: `linear-gradient(160deg, ${alpha(colors.brand, 0.22)} 0%, ${alpha(colors.backgroundAlt, 0.3)} 58%, ${alpha(colors.accent, 0.18)} 100%)`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderRight: { md: `1px solid ${colors.border}` },
                borderBottom: { xs: `1px solid ${colors.border}`, md: "none" },
              }}
            >
              <Stack spacing={2}>
                <Typography
                  sx={{
                    color: colors.brand,
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                  }}
                >
                  MarketPulse
                </Typography>
                <Typography variant="h3">{sideTitle}</Typography>
                <Typography sx={{ color: "text.secondary", maxWidth: 420 }}>
                  {sideText}
                </Typography>
              </Stack>
              <Stack spacing={1.25} sx={{ mt: 6 }}>
                <Typography sx={{ color: colors.textPrimary, fontWeight: 700 }}>
                  Real-time watchlists
                </Typography>
                <Typography sx={{ color: "text.secondary", fontSize: "0.95rem" }}>
                  Search, track, and act on market movement from one focused workspace.
                </Typography>
              </Stack>
            </Box>
            <Box
              component={MotionBox}
              variants={fadeInUp}
              sx={{
                flex: 1,
                p: { xs: 3, md: 4.5 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Stack spacing={1} sx={{ mb: 4 }}>
                <Typography variant="h4">{title}</Typography>
                <Typography sx={{ color: "text.secondary" }}>{subtitle}</Typography>
              </Stack>
              {children}
            </Box>
          </Stack>
        </SurfaceCard>
      </Stack>
    </Box>
  );
}

export default AuthShell;
