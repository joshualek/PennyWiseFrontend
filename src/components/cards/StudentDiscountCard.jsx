import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { Card, CardActions, CardActionArea, CardContent, Button, Typography } from '@mui/material';
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

const StudentDiscountCard = ({ date, channel_id, message, channel_link, discount_link }) => {
    const navigate = useNavigate(); 
    const handleClick = () => {
        navigate("/student-discounts");
        window.scrollTo(0, 0); // Scroll to the top of the page

    };

    let telegram_channel = "";
    if (channel_id === 1327141049) {
        telegram_channel = "Student Perks";
    }
    const validDiscountLink = discount_link && discount_link.startsWith("bit.ly/") ? discount_link : null;

    return (
        <ThemeProvider theme={theme}>
        <Card sx={{ width: 650, borderRadius: "25px" }} className="content-box">
        <CardActionArea onClick={handleClick}>

            <div>
                <CardContent>
                    <Typography variant="h6" component="div">
                        Date Posted: {date}
                    </Typography>
                    <Typography variant="h6" color="#1a6299" component="div">
                        Telegram Channel: <Link to={channel_link}>{telegram_channel}</Link>
                    </Typography>

                    <Typography variant="h6" component="div">
                        <br /> {message}
                    </Typography>
                </CardContent>
                <CardActions>
                    {validDiscountLink ? (
                        <Button size="small" component="a" href={`https://${discount_link}`} target="_blank" rel="noopener noreferrer">Learn More</Button>
                    ) : (
                        <Typography variant="body2" color="textSecondary">No Advertisement Link Available</Typography>
                    )}
                </CardActions>
            </div>
        </CardActionArea>
        </Card>
        </ThemeProvider>
    );
}

export default StudentDiscountCard;