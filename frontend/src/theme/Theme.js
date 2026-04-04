import { alpha, createTheme, responsiveFontSizes } from "@mui/material/styles";

export const colors = {
  background: "#07111f",
  backgroundAlt: "#0d1b2f",
  surface: "#101f35",
  surfaceAlt: "#142742",
  surfaceSoft: "#182d4c",
  border: "rgba(148, 163, 184, 0.18)",
  textPrimary: "#f8fafc",
  textSecondary: "#a7b7d3",
  brand: "#ff7a59",
  brandDark: "#e65d3b",
  accent: "#4fd1c5",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#60a5fa",
  white: "#ffffff",
  black: "#000000",
};

let theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: {
    mode: "dark",
    primary: {
      main: colors.brand,
      contrastText: colors.white,
    },
    secondary: {
      main: colors.accent,
    },
    success: {
      main: colors.success,
    },
    error: {
      main: colors.danger,
    },
    warning: {
      main: colors.warning,
    },
    info: {
      main: colors.info,
    },
    background: {
      default: colors.background,
      paper: colors.surface,
    },
    text: {
      primary: colors.textPrimary,
      secondary: colors.textSecondary,
    },
    divider: colors.border,
    brand: {
      main: colors.brand,
    },
    blue: {
      main: colors.info,
    },
    danger: {
      main: colors.danger,
    },
  },
  shape: {
    borderRadius: 20,
  },
  typography: {
    fontFamily: ["Segoe UI", "Trebuchet MS", "sans-serif"].join(","),
    h1: {
      fontSize: "3.4rem",
      fontWeight: 700,
      letterSpacing: "-0.04em",
    },
    h2: {
      fontSize: "2.6rem",
      fontWeight: 700,
      letterSpacing: "-0.03em",
    },
    h3: {
      fontSize: "2rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h4: {
      fontSize: "1.7rem",
      fontWeight: 700,
    },
    h5: {
      fontSize: "1.35rem",
      fontWeight: 700,
    },
    h6: {
      fontSize: "1.05rem",
      fontWeight: 700,
    },
    button: {
      fontWeight: 700,
      letterSpacing: "0.01em",
      textTransform: "none",
    },
    caption: {
      color: colors.textSecondary,
      fontSize: "0.8rem",
      fontWeight: 500,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            "radial-gradient(circle at top left, rgba(79, 209, 197, 0.12), transparent 28%), radial-gradient(circle at top right, rgba(255, 122, 89, 0.16), transparent 24%), linear-gradient(180deg, #07111f 0%, #091426 100%)",
          color: colors.textPrimary,
        },
      },
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: "xl",
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: alpha(colors.backgroundAlt, 0.72),
          backdropFilter: "blur(18px)",
          boxShadow: "none",
          borderBottom: `1px solid ${colors.border}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: alpha(colors.surface, 0.9),
          border: `1px solid ${colors.border}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backgroundColor: alpha(colors.surface, 0.92),
          border: `1px solid ${colors.border}`,
          boxShadow: "0 24px 80px rgba(2, 8, 23, 0.4)",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 20,
          minHeight: 44,
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${colors.brand} 0%, ${colors.brandDark} 100%)`,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: alpha(colors.surfaceSoft, 0.7),
          transition: "all 180ms ease",
          "& fieldset": {
            borderColor: colors.border,
          },
          "&:hover fieldset": {
            borderColor: alpha(colors.brand, 0.5),
          },
          "&.Mui-focused": {
            boxShadow: `0 0 0 4px ${alpha(colors.brand, 0.15)}`,
          },
        },
        input: {
          color: colors.textPrimary,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: colors.textSecondary,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: 999,
          background: `linear-gradient(90deg, ${colors.brand} 0%, ${colors.accent} 100%)`,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 700,
          minHeight: 56,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 700,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${alpha("#cbd5e1", 0.08)}`,
        },
        head: {
          color: colors.textSecondary,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          backgroundColor: alpha(colors.backgroundAlt, 0.98),
        },
      },
    },
    MuiModal: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(7, 17, 31, 0.45)",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: alpha("#cbd5e1", 0.08),
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
