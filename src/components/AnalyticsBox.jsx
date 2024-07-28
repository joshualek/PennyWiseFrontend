import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Card, CardActionArea, Box, Typography } from '@mui/material';
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

// AnalyticsBox component template
const AnalyticsBox = ({ title, value }) => {
  const navigate = useNavigate(); 

  return (
    <ThemeProvider theme={theme}>
      <Card sx={{ width: "300px", height: "110px", borderRadius: "25px" }} className="analyticsbox">
        <CardActionArea onClick={() => navigate('#')}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ color: "#000000", textAlign: 'center' }}
            >
              {title}
            </Typography>
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ color: "#1a6299", textAlign: 'center', mt: 1 }}
            >
              {value}
            </Typography>
          </Box>
        </CardActionArea>
      </Card>
    </ThemeProvider>
  );
};

export default AnalyticsBox;
