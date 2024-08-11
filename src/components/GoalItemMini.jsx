import React from 'react';
import { useNavigate } from 'react-router-dom';

// Libraries
import { Card, CardActionArea, CardContent, Box, LinearProgress, Typography } from '@mui/material';

// Helpers
import { formatCurrency } from "../helpers";

const GoalItemMini = ({ goal }) => {

    // Progressbar color based on percentage
    const percentage = (goal.current_amount / goal.target_amount) * 100;
    let progressBarColor;
    if (percentage >= 75) {
        progressBarColor = "green";
    } else if (percentage >= 50) {
        progressBarColor = "orange";
    } else {
        progressBarColor = "red";
    }
    // Styles for GoalItemMini component
    const styles = {
        progressText: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
        },
        goalName: {
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: '#000',
        },
        goalTarget: {
            fontSize: '0.875rem',
            color: '#1a6299',
        },
        progressBarContainer: {
            width: '100%',
            backgroundColor: '#eee',
            borderRadius: '20px',
            overflow: 'hidden',
            height: '24px',
            margin: '10px 0 10px 0',
            position: 'relative',
        },
        progressBar: {
            height: '100%',
            borderRadius: '20px',
        },
        percentageText: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#000',
            fontWeight: 'bold',
        },
    };

    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/goals");
    };

    return (
        <Card 
            sx={{ height: `calc(100% / 4)`, borderRadius: "20px", marginTop: "16px" }}
            className="content-box">
            <CardActionArea onClick={handleClick}>
                <CardContent>
                    <div className="progress-text" style={styles.progressText}>

                        <Typography variant="h6" component="div" sx={styles.goalName}>
                            {goal.name}
                        </Typography>
                        <Typography variant="h6" component="div" sx={styles.goalTarget}>
                            Goal: ${formatCurrency(goal.target_amount)}
                        </Typography>
                    </div>
                    <div className="progress-bar" style={styles.progressBarContainer}>
                        <LinearProgress
                            variant="determinate"
                            value={percentage}
                            sx={{
                                ...styles.progressBar,
                                backgroundColor: '#f0f0f0',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: progressBarColor,
                                },
                            }}
                        />
                        <Typography variant="body2" style={styles.percentageText}>
                            {Math.round(percentage)}%
                        </Typography>
                    </div>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default GoalItemMini;