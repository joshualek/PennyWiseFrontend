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
      <Card sx={{ width: "300px", height: "130px", borderRadius: "20px", padding: "25px" }}>
        <CardActionArea onClick={() => navigate('#')}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Typography
              fontWeight="bold"
              sx={{ fontSize: '1.1rem', color: "#000000", textAlign: 'center' }}
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
