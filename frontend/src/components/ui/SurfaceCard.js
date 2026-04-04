import { alpha } from "@mui/material/styles";
import { Card } from "@mui/material";
import { colors } from "../../theme/Theme";

function SurfaceCard({ children, sx, ...props }) {
  return (
    <Card
      sx={{
        p: { xs: 2, md: 2.5 },
        background: `linear-gradient(180deg, ${alpha(colors.surfaceAlt, 0.94)} 0%, ${alpha(colors.surface, 0.92)} 100%)`,
        border: `1px solid ${colors.border}`,
        boxShadow: "0 24px 60px rgba(2, 8, 23, 0.38)",
        borderRadius: 3,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Card>
  );
}

export default SurfaceCard;
