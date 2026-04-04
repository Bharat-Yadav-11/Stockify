import { Chip, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { MotionBox, fadeInUp } from "./Motion";
import { colors } from "../../theme/Theme";

function PageHeader({ eyebrow, title, description, action }) {
  return (
    <MotionBox
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.4 }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Stack spacing={1}>
          {eyebrow ? (
            <Chip
              label={eyebrow}
              sx={{
                alignSelf: "flex-start",
                color: colors.textPrimary,
                backgroundColor: alpha(colors.accent, 0.14),
              }}
            />
          ) : null}
          <Typography variant="h4">{title}</Typography>
          {description ? (
            <Typography sx={{ color: "text.secondary", maxWidth: 720 }}>
              {description}
            </Typography>
          ) : null}
        </Stack>
        {action}
      </Stack>
    </MotionBox>
  );
}

export default PageHeader;
