import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

const StudentDiscountCard = ({ date, channel_id, message, channel_link, discount_link }) => {

    let telegram_channel = "";
    if (channel_id === 1327141049){
        telegram_channel = "Student Perks";
    }
    const validDiscountLink = discount_link && discount_link.startsWith("bit.ly/") ? discount_link : null;

    return (
        <Card sx={{ width: 650, borderRadius: "25px" }}>
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
        </Card>
    );
}

export default StudentDiscountCard;