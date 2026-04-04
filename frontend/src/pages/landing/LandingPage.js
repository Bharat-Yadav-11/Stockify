import React from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import SouthRoundedIcon from "@mui/icons-material/SouthRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import CandlestickChartRoundedIcon from "@mui/icons-material/CandlestickChartRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import ShowChartRoundedIcon from "@mui/icons-material/ShowChartRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import SavingsRoundedIcon from "@mui/icons-material/SavingsRounded";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ReactApexChart from "react-apexcharts";
import Footer from "../../components/footer/Footer";
import SurfaceCard from "../../components/ui/SurfaceCard";
import { colors } from "../../theme/Theme";

const MotionDiv = motion.div;

const sectionAnimation = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const heroSeries = [
  {
    name: "NIFTY",
    data: [22410, 22445, 22392, 22498, 22540, 22510, 22628, 22690, 22620, 22740, 22810, 22796],
  },
  {
    name: "BANKNIFTY",
    data: [48090, 48210, 48140, 48350, 48520, 48660, 48810, 48745, 48940, 49010, 49120, 49260],
  },
];

const heroChartOptions = {
  chart: {
    type: "area",
    toolbar: { show: false },
    sparkline: { enabled: false },
    zoom: { enabled: false },
    background: "transparent",
  },
  theme: { mode: "dark" },
  stroke: {
    curve: "smooth",
    width: 3,
  },
  fill: {
    type: "gradient",
    gradient: {
      opacityFrom: 0.32,
      opacityTo: 0.02,
    },
  },
  colors: [colors.accent, colors.brand],
  grid: {
    borderColor: "rgba(148, 163, 184, 0.10)",
    strokeDashArray: 5,
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: ["09:15", "09:45", "10:15", "10:45", "11:15", "11:45", "12:15", "12:45", "13:15", "13:45", "14:15", "15:00"],
    labels: {
      style: { colors: colors.textSecondary },
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: {
      style: { colors: colors.textSecondary },
      formatter: (value) => `${Math.round(value / 1000)}k`,
    },
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
    labels: { colors: colors.textPrimary },
  },
  tooltip: {
    theme: "dark",
  },
};

const allocationChartOptions = {
  chart: {
    type: "donut",
    background: "transparent",
  },
  theme: { mode: "dark" },
  labels: ["Large cap", "Banking", "Momentum", "Options hedge"],
  colors: [colors.accent, colors.info, colors.brand, colors.warning],
  dataLabels: { enabled: false },
  stroke: { width: 0 },
  legend: {
    position: "bottom",
    labels: { colors: colors.textSecondary },
  },
  plotOptions: {
    pie: {
      donut: {
        size: "72%",
        labels: {
          show: true,
          total: {
            show: true,
            label: "Capital",
            color: colors.textSecondary,
          },
          value: {
            color: colors.textPrimary,
          },
        },
      },
    },
  },
};

const marketPulse = [
  { symbol: "NIFTY 50", price: "22,796.40", move: "+1.28%" },
  { symbol: "BANK NIFTY", price: "49,260.15", move: "+0.91%" },
  { symbol: "SENSEX", price: "75,104.21", move: "+1.06%" },
  { symbol: "FINNIFTY", price: "23,814.75", move: "+0.68%" },
];

const platformHighlights = [
  {
    icon: <InsightsRoundedIcon />,
    title: "Market pulse dashboard",
    text: "Track status, movers, and holidays in a tighter decision screen built for real market rhythm.",
  },
  {
    icon: <CandlestickChartRoundedIcon />,
    title: "Chart-focused analysis",
    text: "Move from watchlist to a richer charting view without losing context or flow.",
  },
  {
    icon: <BoltRoundedIcon />,
    title: "Fast execution path",
    text: "Search, shortlist, buy, sell, and review positions inside one connected workspace.",
  },
  {
    icon: <TimelineRoundedIcon />,
    title: "Risk planning tools",
    text: "Use the built-in calculator to model margin, quantity, stop loss, and targets before entry.",
  },
];

const trustCards = [
  {
    title: "Built for active retail traders",
    metric: "Live watchlists",
    subtext: "Search and shortlist symbols from the same workspace where you execute trades.",
  },
  {
    title: "Product-led interface",
    metric: "Execution-first design",
    subtext: "The homepage now feels like a real trading product instead of a generic startup landing page.",
  },
  {
    title: "Modern without breaking CRA",
    metric: "CRA-safe stack",
    subtext: "Animations, charts, and long-form storytelling while keeping your older React app intact.",
  },
];

const pricingRows = [
  { label: "Watchlists and live tracking", value: "Included" },
  { label: "Orders, positions, account views", value: "Included" },
  { label: "Risk calculator and chart workspace", value: "Included" },
  { label: "Trading-ready UI overhaul", value: "Included" },
];

function scrollToSection(id) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function LandingPage() {
  const isAuthenticated = Boolean(localStorage.getItem("cmUser"));

  return (
    <Box sx={{ scrollBehavior: "smooth" }}>
      <Box
        id="hero"
        sx={{
          position: "relative",
          overflow: "hidden",
          pt: { xs: 14, md: 18 },
          pb: { xs: 8, md: 10 },
          borderBottom: "1px solid rgba(148, 163, 184, 0.10)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 10% 10%, rgba(79, 209, 197, 0.16), transparent 24%), radial-gradient(circle at 88% 14%, rgba(255, 122, 89, 0.18), transparent 24%), linear-gradient(180deg, rgba(7,17,31,0.2) 0%, rgba(7,17,31,0.72) 100%)",
            pointerEvents: "none",
          }}
        />
        <Container maxWidth="xl" sx={{ position: "relative" }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} lg={5}>
              <MotionDiv initial="hidden" animate="visible" variants={sectionAnimation} transition={{ duration: 0.6 }}>
                <Stack spacing={3}>
                  <Chip
                    label="Trading platform and market workspace"
                    sx={{
                      alignSelf: "flex-start",
                      backgroundColor: alpha(colors.accent, 0.12),
                      color: "text.primary",
                    }}
                  />
                  <Typography variant="h1" sx={{ maxWidth: 620, lineHeight: 1.03 }}>
                    Trade the markets with more clarity, less clutter.
                  </Typography>
                  <Typography sx={{ color: "text.secondary", fontSize: "1.06rem", maxWidth: 580, lineHeight: 1.8 }}>
                    MarketPulse brings watchlists, live market context, chart analysis, orders, positions, and risk planning into one serious trading interface inspired by the confidence of modern broker platforms.
                  </Typography>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                    <Button
                      component={Link}
                      to={isAuthenticated ? "/app/dashboard" : "/signup"}
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForwardRoundedIcon />}
                    >
                      {isAuthenticated ? "Go to dashboard" : "Open your account"}
                    </Button>
                    {!isAuthenticated ? (
                      <Button component={Link} to="/signin" variant="outlined" size="large">
                        Sign in
                      </Button>
                    ) : null}
                    <Button variant="text" size="large" endIcon={<SouthRoundedIcon />} onClick={() => scrollToSection("platform")}>
                      Explore the platform
                    </Button>
                  </Stack>
                  <Stack direction="row" spacing={1.2} flexWrap="wrap" useFlexGap sx={{ pt: 1 }}>
                    {marketPulse.map((item) => (
                      <Box
                        key={item.symbol}
                        sx={{
                          px: 1.5,
                          py: 1.1,
                          borderRadius: 1.75,
                          border: "1px solid rgba(148, 163, 184, 0.12)",
                          backgroundColor: "rgba(255, 255, 255, 0.045)",
                        }}
                      >
                        <Typography sx={{ color: "text.secondary", fontSize: "0.78rem" }}>{item.symbol}</Typography>
                        <Typography sx={{ fontWeight: 700, mt: 0.35 }}>{item.price}</Typography>
                        <Typography sx={{ color: "success.main", fontSize: "0.84rem", mt: 0.2 }}>{item.move}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Stack>
              </MotionDiv>
            </Grid>
            <Grid item xs={12} lg={7}>
              <MotionDiv initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.9, delay: 0.15 }}>
                <SurfaceCard
                  sx={{
                    p: { xs: 2, md: 3 },
                    borderRadius: 2.5,
                    overflow: "hidden",
                    background:
                      "linear-gradient(180deg, rgba(15, 29, 49, 0.98) 0%, rgba(12, 24, 42, 0.96) 100%)",
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Stack
                        direction={{ xs: "column", md: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", md: "center" }}
                        spacing={1.5}
                        sx={{ mb: 2 }}
                      >
                        <Stack spacing={0.5}>
                          <Typography variant="h5">Live market overview</Typography>
                          <Typography sx={{ color: "text.secondary" }}>
                            A cleaner look at trend structure, benchmark movement, and capital allocation.
                          </Typography>
                        </Stack>
                        <Chip label="MarketPulse Terminal" sx={{ backgroundColor: alpha(colors.brand, 0.14), color: "text.primary" }} />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={8}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: "1px solid rgba(148, 163, 184, 0.10)",
                          background: "rgba(255,255,255,0.055)",
                        }}
                      >
                        <ReactApexChart options={heroChartOptions} series={heroSeries} type="area" height={330} />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Stack spacing={2} sx={{ height: "100%" }}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            border: "1px solid rgba(148, 163, 184, 0.10)",
                            background: "rgba(255,255,255,0.055)",
                          }}
                        >
                          <Typography sx={{ color: "text.secondary", mb: 1 }}>Capital allocation</Typography>
                          <ReactApexChart options={allocationChartOptions} series={[38, 24, 20, 18]} type="donut" height={220} />
                        </Box>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            border: "1px solid rgba(148, 163, 184, 0.10)",
                            background: "rgba(255,255,255,0.055)",
                            flexGrow: 1,
                          }}
                        >
                          <Stack spacing={1.4}>
                            <Typography sx={{ color: "text.secondary" }}>Session momentum</Typography>
                            <Box>
                              <Stack direction="row" justifyContent="space-between">
                                <Typography>Large cap breadth</Typography>
                                <Typography>78%</Typography>
                              </Stack>
                              <LinearProgress variant="determinate" value={78} sx={{ mt: 1, height: 8, borderRadius: 999 }} />
                            </Box>
                            <Box>
                              <Stack direction="row" justifyContent="space-between">
                                <Typography>Breakout strength</Typography>
                                <Typography>64%</Typography>
                              </Stack>
                              <LinearProgress
                                variant="determinate"
                                value={64}
                                color="secondary"
                                sx={{ mt: 1, height: 8, borderRadius: 999 }}
                              />
                            </Box>
                            <Box>
                              <Stack direction="row" justifyContent="space-between">
                                <Typography>Options hedge cover</Typography>
                                <Typography>49%</Typography>
                              </Stack>
                              <LinearProgress
                                variant="determinate"
                                value={49}
                                color="warning"
                                sx={{ mt: 1, height: 8, borderRadius: 999 }}
                              />
                            </Box>
                          </Stack>
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                </SurfaceCard>
              </MotionDiv>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="xl">
        <Box id="platform" sx={{ py: { xs: 7, md: 10 } }}>
          <MotionDiv whileInView="visible" initial="hidden" viewport={{ once: true, amount: 0.2 }} variants={sectionAnimation}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} lg={5}>
                <Stack spacing={1.5}>
                  <Chip label="Platform" sx={{ alignSelf: "flex-start", backgroundColor: alpha(colors.info, 0.14) }} />
                  <Typography variant="h2">A trading stack that actually looks market-ready.</Typography>
                  <Typography sx={{ color: "text.secondary", maxWidth: 560, lineHeight: 1.8 }}>
                    The homepage now leads with platform credibility, not filler content. It presents charts, product structure, and serious visual hierarchy so visitors immediately understand they are looking at a trading website.
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} lg={7}>
                <Grid container spacing={2.5}>
                  {platformHighlights.map((item, index) => (
                    <Grid item xs={12} sm={6} key={item.title}>
                      <MotionDiv
                        whileInView="visible"
                        initial="hidden"
                        viewport={{ once: true, amount: 0.18 }}
                        variants={sectionAnimation}
                        transition={{ duration: 0.42, delay: index * 0.05 }}
                      >
                        <SurfaceCard sx={{ height: "100%", borderRadius: 2.5, background: `linear-gradient(180deg, ${alpha(colors.surfaceAlt, 0.98)} 0%, ${alpha(colors.surface, 0.95)} 100%)` }}>
                          <Stack spacing={2}>
                            <Avatar
                              variant="rounded"
                              sx={{
                                width: 50,
                                height: 50,
                                borderRadius: 1.5,
                                bgcolor: alpha(colors.brand, 0.16),
                                color: colors.textPrimary,
                              }}
                            >
                              {item.icon}
                            </Avatar>
                            <Typography variant="h5">{item.title}</Typography>
                            <Typography sx={{ color: "text.secondary" }}>{item.text}</Typography>
                          </Stack>
                        </SurfaceCard>
                      </MotionDiv>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </MotionDiv>
        </Box>

        <Box id="experience" sx={{ py: { xs: 6, md: 9 } }}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <MotionDiv whileInView="visible" initial="hidden" viewport={{ once: true, amount: 0.2 }} variants={sectionAnimation}>
                <SurfaceCard sx={{ borderRadius: 2.5, p: { xs: 2.5, md: 3 } }}>
                  <Stack spacing={2.5}>
                    <Stack spacing={1}>
                      <Typography variant="h3">Designed around trader behavior</Typography>
                      <Typography sx={{ color: "text.secondary", maxWidth: 720 }}>
                        Instead of pushing generic marketing cards, MarketPulse now tells a product story: scan opportunity, understand risk, act on price movement, then review positions in one continuous flow.
                      </Typography>
                    </Stack>
                    <Grid container spacing={2}>
                      {trustCards.map((card) => (
                        <Grid item xs={12} md={4} key={card.title}>
                          <Box
                            sx={{
                              height: "100%",
                              p: 2.25,
                              borderRadius: 2,
                              backgroundColor: alpha(colors.white, 0.05),
                              border: "1px solid rgba(148, 163, 184, 0.10)",
                            }}
                          >
                            <Typography sx={{ color: "text.secondary", fontSize: "0.82rem", mb: 1 }}>{card.title}</Typography>
                            <Typography variant="h5" sx={{ mb: 1.1 }}>
                              {card.metric}
                            </Typography>
                            <Typography sx={{ color: "text.secondary", fontSize: "0.94rem" }}>{card.subtext}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Stack>
                </SurfaceCard>
              </MotionDiv>
            </Grid>
            <Grid item xs={12} lg={4}>
              <MotionDiv whileInView="visible" initial="hidden" viewport={{ once: true, amount: 0.2 }} variants={sectionAnimation}>
                <SurfaceCard
                  sx={{
                    height: "100%",
                    borderRadius: 2.5,
                    background: `linear-gradient(180deg, ${alpha(colors.brand, 0.10)} 0%, ${alpha(colors.surface, 0.98)} 100%)`,
                  }}
                >
                  <Stack spacing={2.2}>
                    <Typography variant="h4">Built like a modern broker landing page</Typography>
                    <Typography sx={{ color: "text.secondary", lineHeight: 1.8 }}>
                      The structure now borrows the right cues from serious retail trading platforms: a strong hero, trust-led sections, platform storytelling, and clear calls to action.
                    </Typography>
                    <Divider />
                    <Stack direction="row" spacing={1.4} alignItems="center">
                      <WorkspacePremiumRoundedIcon sx={{ color: colors.accent }} />
                      <Typography>Focused, product-first visual direction</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1.4} alignItems="center">
                      <AccountBalanceRoundedIcon sx={{ color: colors.info }} />
                      <Typography>Long-form homepage with stronger credibility</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1.4} alignItems="center">
                      <ShowChartRoundedIcon sx={{ color: colors.brand }} />
                      <Typography>Chart-led storytelling instead of filler boxes</Typography>
                    </Stack>
                  </Stack>
                </SurfaceCard>
              </MotionDiv>
            </Grid>
          </Grid>
        </Box>

        <Box id="pricing" sx={{ py: { xs: 6, md: 9 } }}>
          <Grid container spacing={3} alignItems="stretch">
            <Grid item xs={12} lg={5}>
              <MotionDiv whileInView="visible" initial="hidden" viewport={{ once: true, amount: 0.2 }} variants={sectionAnimation}>
                <Stack spacing={1.5}>
                  <Chip label="Product access" sx={{ alignSelf: "flex-start", backgroundColor: alpha(colors.warning, 0.14) }} />
                  <Typography variant="h2">Everything important is easy to discover.</Typography>
                  <Typography sx={{ color: "text.secondary", lineHeight: 1.8, maxWidth: 520 }}>
                    Use this section like a trust-and-access area. It gives the page the long, informative feel that better trading sites use, without turning into a childish feature grid.
                  </Typography>
                </Stack>
              </MotionDiv>
            </Grid>
            <Grid item xs={12} lg={7}>
              <MotionDiv whileInView="visible" initial="hidden" viewport={{ once: true, amount: 0.2 }} variants={sectionAnimation}>
                <SurfaceCard sx={{ borderRadius: 2.5 }}>
                  <Stack spacing={0}>
                    {pricingRows.map((row, index) => (
                      <Box key={row.label}>
                        {index > 0 ? <Divider /> : null}
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 2.2 }}>
                          <Stack direction="row" spacing={1.2} alignItems="center">
                            {index === 0 ? <SecurityRoundedIcon sx={{ color: colors.accent }} /> : null}
                            {index === 1 ? <BoltRoundedIcon sx={{ color: colors.info }} /> : null}
                            {index === 2 ? <TimelineRoundedIcon sx={{ color: colors.brand }} /> : null}
                            {index === 3 ? <SavingsRoundedIcon sx={{ color: colors.warning }} /> : null}
                            <Typography sx={{ color: "text.primary" }}>{row.label}</Typography>
                          </Stack>
                          <Typography sx={{ color: "text.secondary", fontWeight: 700 }}>{row.value}</Typography>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                </SurfaceCard>
              </MotionDiv>
            </Grid>
          </Grid>
        </Box>

        <Box id="cta" sx={{ py: { xs: 6, md: 10 } }}>
          <MotionDiv whileInView="visible" initial="hidden" viewport={{ once: true, amount: 0.2 }} variants={sectionAnimation}>
            <SurfaceCard
              sx={{
                borderRadius: 2.5,
                p: { xs: 3, md: 4.5 },
                background:
                  "linear-gradient(135deg, rgba(255,122,89,0.14) 0%, rgba(79,209,197,0.12) 100%)",
              }}
            >
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Stack spacing={1.2}>
                    <Typography variant="h2">Ready to experience MarketPulse?</Typography>
                    <Typography sx={{ color: "text.secondary", maxWidth: 740, lineHeight: 1.8 }}>
                      {isAuthenticated
                        ? "Open your dashboard, build your watchlist, analyze charts, and continue from the rest of the trading workflow without friction."
                        : "Open the platform, build your watchlist, analyze charts, and move through the rest of the trading workflow from a much more polished interface."}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Stack spacing={1.2} alignItems={{ xs: "stretch", md: "flex-end" }}>
                    <Button
                      component={Link}
                      to={isAuthenticated ? "/app/dashboard" : "/signup"}
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForwardRoundedIcon />}
                    >
                      {isAuthenticated ? "Go to dashboard" : "Get started"}
                    </Button>
                    {!isAuthenticated ? (
                      <Button component={Link} to="/signin" variant="outlined" size="large">
                        Sign in to platform
                      </Button>
                    ) : null}
                  </Stack>
                </Grid>
              </Grid>
            </SurfaceCard>
          </MotionDiv>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
}

export default LandingPage;
