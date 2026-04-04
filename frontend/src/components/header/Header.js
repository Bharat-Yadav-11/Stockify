import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";
import { alpha } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { MotionBox, fadeInUp } from "../ui/Motion";
import { colors } from "../../theme/Theme";

const appPages = [
  { label: "Dashboard", path: "/app/dashboard" },
  { label: "Orders", path: "/app/orders" },
  { label: "Positions", path: "/app/positions" },
  { label: "Account", path: "/app/account" },
  { label: "Tools", path: "/app/tools" },
];

const landingLinks = [
  { label: "Platform", id: "platform" },
  { label: "Experience", id: "experience" },
  { label: "Access", id: "pricing" },
  { label: "Open account", id: "cta" },
];

function Header() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = Boolean(localStorage.getItem("cmUser"));
  const hideNavigation = ["/signup", "/signin"].includes(location.pathname);
  const isLandingPage = location.pathname === "/";
  const isAppRoute = location.pathname.startsWith("/app");

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleCloseNavMenu();
  };

  const handleScrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    handleCloseNavMenu();
  };

  const handleLogout = () => {
    localStorage.removeItem("cmUser");
    navigate("/signin", { replace: true });
  };

  const navigationItems = isLandingPage ? landingLinks : appPages;

  return (
    <AppBar
      position="sticky"
      sx={{
        background: isLandingPage ? "rgba(7, 17, 31, 0.58)" : alpha(colors.backgroundAlt, 0.78),
        borderBottom: `1px solid ${alpha(colors.white, 0.08)}`,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: 82 }}>
          <MotionBox
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.35 }}
            style={{ width: "100%" }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: "100%" }}>
              <Stack direction="row" alignItems="center" spacing={2.5}>
                <Stack direction="row" alignItems="center" spacing={1.25} sx={{ cursor: "pointer" }} onClick={() => navigate("/")}>
                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: "12px",
                      display: "grid",
                      placeItems: "center",
                      background: `linear-gradient(135deg, ${colors.brand} 0%, ${colors.accent} 100%)`,
                      boxShadow: `0 18px 36px ${alpha(colors.brand, 0.24)}`,
                    }}
                  >
                    <TrendingUpRoundedIcon sx={{ color: colors.white }} />
                  </Box>
                  <Stack spacing={0.15}>
                    <Typography sx={{ fontWeight: 800, fontSize: "1.16rem", letterSpacing: "-0.02em" }}>
                      MarketPulse
                    </Typography>
                    <Typography sx={{ color: "text.secondary", fontSize: "0.78rem" }}>
                      Trading and market intelligence
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>

              {!hideNavigation ? (
                <>
                  <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" }, justifyContent: "flex-end" }}>
                    <IconButton size="large" onClick={handleOpenNavMenu} color="inherit">
                      <MenuIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorElNav}
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      transformOrigin={{ vertical: "top", horizontal: "right" }}
                      open={Boolean(anchorElNav)}
                      onClose={handleCloseNavMenu}
                      PaperProps={{
                        sx: {
                          mt: 1.5,
                          borderRadius: 3,
                          minWidth: 220,
                          backgroundColor: alpha(colors.surface, 0.98),
                          border: `1px solid ${colors.border}`,
                        },
                      }}
                    >
                      {navigationItems.map((page) => (
                        <MenuItem
                          key={isLandingPage ? page.id : page.path}
                          onClick={() => (isLandingPage ? handleScrollToSection(page.id) : handleNavigate(page.path))}
                        >
                          <Typography>{page.label}</Typography>
                        </MenuItem>
                      ))}
                    </Menu>
                  </Box>

                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.5}
                    sx={{
                      display: { xs: "none", md: "flex" },
                      px: 1,
                      py: 0.85,
                      borderRadius: 2,
                      border: `1px solid ${alpha(colors.white, 0.08)}`,
                      backgroundColor: alpha(colors.surfaceAlt, 0.68),
                    }}
                  >
                    {navigationItems.map((page) => {
                      const active = !isLandingPage && location.pathname === page.path;
                      return (
                        <Button
                          key={isLandingPage ? page.id : page.path}
                          onClick={() => (isLandingPage ? handleScrollToSection(page.id) : handleNavigate(page.path))}
                          sx={{
                            color: active ? colors.textPrimary : colors.textSecondary,
                            backgroundColor: active ? alpha(colors.brand, 0.16) : "transparent",
                            borderRadius: 1.5,
                            px: 2,
                            "&:hover": {
                              backgroundColor: active ? alpha(colors.brand, 0.22) : alpha(colors.white, 0.05),
                            },
                          }}
                        >
                          {page.label}
                        </Button>
                      );
                    })}
                  </Stack>

                  {isAppRoute ? (
                    <Button
                      onClick={handleLogout}
                      variant="contained"
                      startIcon={<LogoutRoundedIcon />}
                      sx={{
                        display: { xs: "none", md: "inline-flex" },
                        ml: 2,
                      }}
                    >
                      Log out
                    </Button>
                  ) : (
                    <Stack direction="row" spacing={1.2} sx={{ display: { xs: "none", md: "flex" }, ml: 2 }}>
                      {!isAuthenticated ? (
                        <Button onClick={() => navigate("/signin")} variant="outlined">
                          Sign in
                        </Button>
                      ) : null}
                      <Button
                        onClick={() => navigate(isAuthenticated ? "/app/dashboard" : "/signup")}
                        variant="contained"
                        endIcon={<ArrowOutwardRoundedIcon />}
                      >
                        {isAuthenticated ? "Go to dashboard" : "Open account"}
                      </Button>
                    </Stack>
                  )}
                </>
              ) : null}
            </Stack>
          </MotionBox>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
