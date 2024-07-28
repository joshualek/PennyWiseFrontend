import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const CategoryBox = ({ title, value }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box>
          <Typography variant="h4">
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CategoryBox;