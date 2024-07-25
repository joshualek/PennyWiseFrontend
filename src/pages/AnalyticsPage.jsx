import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";

// Library
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { Container, Typography, Box, Grid, Card, CardContent, Select, MenuItem, FormControl, InputLabel, useTheme } from '@mui/material';
import styled from 'styled-components';
import { tokens } from "../theme";

// Components
import Sidebar from "../components/Sidebar";
import Nav from "../components/Nav";
import AnalyticsBox from "../components/AnalyticsBox";

// Helper functions
import { fetchData, fetchDataDjango } from "../helpers";

// Mock Data
import { mockStatData } from "../data/mockData";

// Heroicons
import { Bars3Icon } from '@heroicons/react/24/solid';

// Loader function to fetch analytics data
export async function analyticsLoader() {
    const userName = await fetchData("userName");
    const analyticsData = await fetchDataDjango('analytics/');
    return { userName, analyticsData };
}

const AnalyticsPage = () => {
    const { userName, analyticsData } = useLoaderData();
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  
    const toggleSidebar = () => {
      setSidebarVisible(!sidebarVisible);
    };
  
    const handleMonthChange = (event) => {
      setSelectedMonth(event.target.value);
    };
  
    const calculatePercentageChange = (current, previous) => {
      if (previous === 0) return "N/A";
      const change = ((current - previous) / previous) * 100;
      return `${change > 0 ? "+" : ""}${change.toFixed(2)}%`;
    };
  
    const getBarData = (key) => {
      return mockStatData.monthly_data.map((item, index, array) => ({
        month: item.month,
        [key]: item[key],
        percentageChange: index > 0 ? calculatePercentageChange(item[key], array[index - 1][key]) : "N/A"
      }));
    };
  
    const expenditureData = getBarData('expenditure');
    const netIncomeData = getBarData('net_income');
  
    const spendingByCategoryData = mockStatData.spending_by_category
      .filter(item => new Date(item.created_at).toLocaleString('default', { month: 'long' }) === selectedMonth)
      .map(item => ({
        id: item.category__name,
        label: item.category__name,
        value: item.total_spent,
      }));
  
    return (
      <div className="dashboard-container">
        <Sidebar isVisible={sidebarVisible} />
        <div className={`dashboard ${sidebarVisible ? '' : 'dashboard-expanded'}`}>
          <Nav userName={userName} />
          <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
            <Bars3Icon />
          </button>
          <Container>
            <Typography variant="h4" gutterBottom>
              Analytics
            </Typography>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel id="month-select-label">Month</InputLabel>
              <Select
                labelId="month-select-label"
                value={selectedMonth}
                onChange={handleMonthChange}
                label="Month"
              >
                {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(month => (
                  <MenuItem value={month} key={month} style={{ fontWeight: month === new Date().toLocaleString('default', { month: 'long' }) ? 'bold' : 'normal' }}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Grid container spacing={4}>
              {[
                { title: "Most Spent on Category", value: `${analyticsData.most_spent_category?.category__name || "N/A"} ($${analyticsData.most_spent_category?.total_spent?.toFixed(2) || 0})` },
                { title: "Least Spent on Category", value: `${analyticsData.least_spent_category?.category__name || "N/A"} ($${analyticsData.least_spent_category?.total_spent?.toFixed(2) || 0})` },
                { title: "Average Monthly Spent", value: `$${analyticsData.average_monthly_spent?.toFixed(2) || 0}` },
                { title: "Net Income", value: `$${analyticsData.net_income?.toFixed(2) || 0}` },
                { title: "Total Spending This Month", value: `$${analyticsData.total_spent_current_month?.toFixed(2) || 0}` },
              ].map((stat, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <AnalyticsBox
                    title={stat.title}
                    value={stat.value}
                  />
                </Grid>
              ))}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Monthly Expenditure</Typography>
                    <Box height="400px">
                      <ResponsiveBar
                        data={expenditureData}
                        keys={['expenditure']}
                        indexBy="month"
                        margin={{ top: 50, right: 100, bottom: 50, left: 50 }}
                        padding={0.2}
                        colors={colors.primary[500]}
                        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
                          tickSize: 5,
                          tickPadding: 5,
                          tickRotation: 0,
                          legend: 'Month',
                          legendPosition: 'middle',
                          legendOffset: 32
                        }}
                        axisLeft={{
                          tickSize: 5,
                          tickPadding: 5,
                          tickRotation: 0,
                          legend: 'Expenditure',
                          legendPosition: 'middle',
                          legendOffset: -40
                        }}
                        tooltip={({ id, value, data }) => (
                          <div
                            style={{
                              padding: '12px',
                              background: '#fff',
                              border: '1px solid #ccc'
                            }}
                          >
                            <strong>{id}</strong>
                            <br />
                            Expenditure: ${value.toFixed(2)}
                            <br />
                            <span style={{ color: data.percentageChange.startsWith('+') ? 'green' : 'red' }}>
                              {data.percentageChange}
                            </span>
                          </div>
                        )}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Net Income</Typography>
                    <Box height="400px">
                      <ResponsiveBar
                        data={netIncomeData}
                        keys={['net_income']}
                        indexBy="month"
                        margin={{ top: 50, right: 100, bottom: 50, left: 50 }}
                        padding={0.2}
                        colors={colors.primary[500]}
                        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
                          tickSize: 5,
                          tickPadding: 5,
                          tickRotation: 0,
                          legend: 'Month',
                          legendPosition: 'middle',
                        legendOffset: 32
                      }}
                      axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Net Income',
                        legendPosition: 'middle',
                        legendOffset: -40
                      }}
                      tooltip={({ id, value, data }) => (
                        <div
                          style={{
                            padding: '12px',
                            background: '#fff',
                            border: '1px solid #ccc'
                          }}
                        >
                          <strong>{id}</strong>
                          <br />
                          Net Income: ${value.toFixed(2)}
                          <br />
                          <span style={{ color: data.percentageChange.startsWith('+') ? 'green' : 'red' }}>
                            {data.percentageChange}
                          </span>
                        </div>
                      )}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Spending by Category</Typography>
                  <Box height="400px">
                    <ResponsivePie
                      data={spendingByCategoryData}
                      margin={{ top: 50, right: 100, bottom: 50, left: 50 }}
                      innerRadius={0.5}
                      padAngle={0.7}
                      cornerRadius={3}
                      colors={{ scheme: 'nivo' }}
                      borderColor={{ from: 'color', modifiers: [['darker', 0.6]] }}
                      radialLabelsSkipAngle={10}
                      radialLabelsTextColor="#333333"
                      radialLabelsLinkColor={{ from: 'color' }}
                      sliceLabelsSkipAngle={10}
                      sliceLabelsTextColor="#333333"
                      tooltip={({ datum: { id, value, color } }) => (
                        <div
                          style={{
                            padding: '12px',
                            background: '#fff',
                            border: '1px solid #ccc'
                          }}
                        >
                          <strong style={{ color }}>{id}</strong>
                          <br />
                          ${value.toFixed(2)}
                        </div>
                      )}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </div>
    </div>
  );
};

export default AnalyticsPage;
