import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Card, CardActionArea, Box, Typography } from '@mui/material';
import ProgressCircle from "./ProgressCircle";
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Override to prevent a grey background from appearing when hovering on the card
const theme = createTheme({
  components: {
    MuiCardActionArea: {
      styleOverrides: {
        focusHighlight: {
          backgroundColor: 'transparent !important',
        },
      },
    },
    MuiTouchRipple: {
      styleOverrides: {
        root: {
        overflow: 'visible',
        },
      },
    },
  },
});


// Statbox component template
const StatBox = ({ title, subtitle, icon, link, progress }) => {
  const navigate = useNavigate(); 
  const handleClick = () => {
    navigate(link);
  };

  return (
    <ThemeProvider theme={theme}>
      <Card sx={{ width: "300px", height: "145px", borderRadius: "20px" }} className="content-box statbox">
        <CardActionArea onClick={handleClick}>
          <Box>
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ color: "#000000" }}
                >
                  {title}
                </Typography>
              </Box>
              <Box>
                {title === "% of Budget Spent" ? <ProgressCircle progress={progress} /> : icon}
              </Box>
            </Box>
            <Box display="flex" justifyContent="space-between" mt="2px">
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ color: "#1a6299" }}>
                {subtitle}
              </Typography>
            </Box>
          </Box>
        </CardActionArea>
      </Card>
    </ThemeProvider>
  );
};

export default StatBox;