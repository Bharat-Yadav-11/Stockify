import React from "react";
import { Box, Button, Container, Divider, Grid, Stack, Typography } from "@mui/material";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { colors } from "../../theme/Theme";

function Footer() {
  const navigate = useNavigate();
  const isAuthenticated = Boolean(localStorage.getItem("cmUser"));

  const footerColumns = [
    {
      title: "Platform",
      links: [
        { label: "Dashboard", type: "route", value: "/app/dashboard" },
        { label: "Orders", type: "route", value: "/app/orders" },
        { label: "Positions", type: "route", value: "/app/positions" },
      ],
    },
    {
      title: "Explore",
      links: [
        { label: "Platform", type: "section", value: "platform" },
        { label: "Experience", type: "section", value: "experience" },
        { label: "Access", type: "section", value: "pricing" },
      ],
    },
    {
      title: "Account",
      links: isAuthenticated
        ? [
            { label: "Go to dashboard", type: "route", value: "/app/dashboard" },
            { label: "Back to top", type: "section", value: "hero" },
          ]
        : [
            { label: "Sign in", type: "route", value: "/signin" },
            { label: "Open account", type: "route", value: "/signup" },
            { label: "Back to top", type: "section", value: "hero" },
          ],
    },
  ];

  const handleNavigate = (link) => {
    if (link.type === "route") {
      navigate(link.value);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const element = document.getElementById(link.value);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate("/");
      setTimeout(() => {
        const delayedElement = document.getElementById(link.value);
        if (delayedElement) {
          delayedElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  };

  return (
    <Box
      component="footer"
      sx={{
        mt: 10,
        borderTop: `1px solid ${alpha(colors.white, 0.08)}`,
        background: "linear-gradient(180deg, rgba(9, 20, 38, 0.92) 0%, rgba(6, 14, 28, 0.98) 100%)",
      }}
    >
      <Container maxWidth="xl" sx={{ py: { xs: 5, md: 6 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={5}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1.25} alignItems="center">
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "12px",
                    display: "grid",
                    placeItems: "center",
                    background: `linear-gradient(135deg, ${colors.brand} 0%, ${colors.accent} 100%)`,
                  }}
                >
                  <TrendingUpRoundedIcon sx={{ color: "#fff" }} />
                </Box>
                <Stack spacing={0.2}>
                  <Typography variant="h6">MarketPulse</Typography>
                  <Typography sx={{ color: "text.secondary", fontSize: "0.85rem" }}>
                    Serious tooling for retail market participants
                  </Typography>
                </Stack>
              </Stack>
              <Typography sx={{ color: "text.secondary", maxWidth: 470, lineHeight: 1.8 }}>
                MarketPulse brings a stronger product-first experience to your stock market workflow with charting, watchlists, execution views, risk planning, and market context built into one interface.
              </Typography>
              <Button
                onClick={() => navigate(isAuthenticated ? "/app/dashboard" : "/signup")}
                variant="outlined"
                endIcon={<ArrowOutwardRoundedIcon />}
                sx={{ alignSelf: "flex-start" }}
              >
                {isAuthenticated ? "Go to dashboard" : "Open your account"}
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} lg={7}>
            <Grid container spacing={3}>
              {footerColumns.map((column) => (
                <Grid item xs={12} sm={4} key={column.title}>
                  <Stack spacing={1.2}>
                    <Typography sx={{ fontWeight: 700 }}>{column.title}</Typography>
                    {column.links.map((link) => (
                      <Button
                        key={link.label}
                        onClick={() => handleNavigate(link)}
                        variant="text"
                        sx={{
                          justifyContent: "flex-start",
                          px: 0,
                          minWidth: 0,
                          color: "text.secondary",
                          "&:hover": {
                            backgroundColor: "transparent",
                            color: "text.primary",
                          },
                        }}
                      >
                        {link.label}
                      </Button>
                    ))}
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3.5 }} />
        <Typography sx={{ color: "text.secondary", fontSize: "0.92rem", textAlign: "center" }}>
          © 2026 MarketPulse. Built to feel closer to a modern trading terminal than a generic marketing page.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
