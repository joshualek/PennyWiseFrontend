import { Box } from "@mui/material";

const ProgressCircle = ({ progress, size = "35" }) => {
  const angle = progress * 360;
  return (
    <Box
      sx={{
        background: `radial-gradient(circle at 50%, ${"#fff"} 49%, transparent 50%),
            conic-gradient(transparent 0deg ${angle}deg, ${"#7DBDDD"} ${angle}deg 360deg),
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