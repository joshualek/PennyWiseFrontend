import { Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

const ProgressCircle = ({ progress, size = "35" }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const angle = progress * 360;
  return (
    <Box
      sx={{
        background: `radial-gradient(circle at 50%, ${colors.primary[400]} 49%, transparent 50%),
            conic-gradient(transparent 0deg ${angle}deg, ${"#7DB2DD"} ${angle}deg 360deg),
            ${"#1a6299"}`,
        borderRadius: "100%",
        width: `${size}px`,
        height: `${size}px`,
        marginBottom: "7.5px",
      }}
    />
  );
};

export default ProgressCircle;