import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";

// Library
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveLine } from '@nivo/line';
import { Container, Typography, Box, Grid, Card, CardContent, Select, MenuItem, FormControl, InputLabel, useTheme } from '@mui/material';

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
    const { userName, analyticsData: initialAnalyticsData } = useLoaderData();
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
    const [analyticsData, setAnalyticsData] = useState(initialAnalyticsData);
    const theme = useTheme();

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    const handleMonthChange = async (event) => {
        const newMonth = event.target.value;
        setSelectedMonth(newMonth);
        // Fetch the analytics data for the new selected month
        const newAnalyticsData = await fetchDataDjango(`analytics/?month=${newMonth}`);
        setAnalyticsData(newAnalyticsData);
    };

    // Format the data for the line chart
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    const spendingPerMonthData = {
        id: "Total Spending",
        data: analyticsData.spending_per_month.map(item => ({
            x: months[item.month - 1],
            y: item.total_spent,
        })),
    };

    const netIncomePerMonthData = {
        id: "Net Income",
        data: analyticsData.net_income_per_month.map(item => ({
            x: months[item.month - 1],
            y: item.net_income,
        })),
    };

    // Weekly Expenses Data
    const weeklyExpensesData = analyticsData.weekly_expenses.map((item) => ({
        week: `Week ${item.week}`,
        total_spent: item.total_spent,
    }));

    const spendingByCategoryData = analyticsData.spending_by_category.map(item => ({
        id: item.category__name,
        label: item.category__name,
        value: item.total_spent
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
                            {months.map(month => (
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
                            { title: "Net Income", value: `$${analyticsData.net_income_current_month?.toFixed(2) || 0}` },
                            { title: "Total Spending This Month", value: `$${analyticsData.total_spent_current_month?.toFixed(2) || 0}` },
                            { title: "Budgets Exceeded", value: `${analyticsData.budgets_exceeded}` },
                        ].map((stat, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <AnalyticsBox title={stat.title} value={stat.value} />
                            </Grid>
                        ))}
                    </Grid>
                    <Box my={4}>
                        <Typography variant="h5" gutterBottom>
                            Monthly Spending and Net Income
                        </Typography>
                        <div style={{ height: 400 }}>
                        <ResponsiveLine
                                data={[spendingPerMonthData, netIncomePerMonthData]}
                                margin={{ top: 50, right: 150, bottom: 50, left: 60 }}
                                xScale={{ type: 'point' }}
                                yScale={{ type: 'linear', stacked: false, min: 'auto', max: 'auto' }}
                                axisTop={null}
                                axisRight={null}
                                axisBottom={{
                                    orient: 'bottom',
                                    legendPosition: 'middle',
                                    legendOffset: 32,
                                    tickValues: months.filter((_, index) => spendingPerMonthData.data.some(data => data.x === months[index])),
                                }}
                                axisLeft={{
                                    orient: 'left',
                                    legendPosition: 'middle',
                                    legendOffset: -40,
                                }}
                                colors={{ scheme: 'blues' }}
                                pointSize={10}
                                pointColor={{ theme: 'background' }}
                                pointBorderWidth={2}
                                pointBorderColor={{ from: 'serieColor' }}
                                pointLabelYOffset={-12}
                                useMesh={true}
                                legends={[
                                    {
                                        anchor: 'bottom-right',
                                        direction: 'column',
                                        justify: false,
                                        translateX: 100,
                                        translateY: 0,
                                        itemsSpacing: 0,
                                        itemDirection: 'left-to-right',
                                        itemWidth: 80,
                                        itemHeight: 20,
                                        itemOpacity: 0.75,
                                        symbolSize: 12,
                                        symbolShape: 'circle',
                                        symbolBorderColor: 'rgba(0, 0, 0, .5)',
                                        effects: [
                                            {
                                                on: 'hover',
                                                style: {
                                                    itemBackground: 'rgba(0, 0, 0, .03)',
                                                    itemOpacity: 1,
                                                },
                                            },
                                        ],
                                    },
                                ]}
                                tooltip={({ point }) => (
                                    <div style={{ background: 'black', padding: '5px', border: '1px solid #ccc' }}>
                                        <strong>{point.serieId}</strong>
                                        <br />
                                        Month: {point.data.xFormatted}
                                        <br />
                                        Amount: ${point.data.yFormatted}
                                    </div>
                                )}
                            />
                        </div>
                    </Box>
                    <Box my={4}>
                        <Typography variant="h5" gutterBottom>
                            Weekly Expenses for the Month
                        </Typography>
                        <div style={{ height: 400 }}>
                            <ResponsiveBar
                                data={weeklyExpensesData}
                                keys={['total_spent']}
                                indexBy="week"
                                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                                padding={0.3}
                                valueScale={{ type: 'linear' }}
                                indexScale={{ type: 'band', round: true }}
                                colors={ "#7dbddd" }
                                defs={[
                                    {
                                        id: 'lines',
                                        type: 'patternLines',
                                        background: 'inherit',
                                        color: '#eed312',
                                        rotation: -45,
                                        lineWidth: 6,
                                        spacing: 10,
                                    },
                                ]}
                                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                                axisTop={null}
                                axisRight={null}
                                axisBottom={{
                                    tickSize: 5,
                                    tickPadding: 5,
                                    tickRotation: 0,
                                    legendPosition: 'middle',
                                    legendOffset: 32,
                                }}
                                axisLeft={{
                                    tickSize: 5,
                                    tickPadding: 5,
                                    tickRotation: 0,
                                    legendPosition: 'middle',
                                    legendOffset: -40,
                                }}
                                labelSkipWidth={12}
                                labelSkipHeight={12}
                                labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                                legends={[
                                    {
                                        dataFrom: 'keys',
                                        anchor: 'bottom-right',
                                        direction: 'column',
                                        justify: false,
                                        translateX: 120,
                                        translateY: 0,
                                        itemsSpacing: 2,
                                        itemWidth: 100,
                                        itemHeight: 20,
                                        itemDirection: 'left-to-right',
                                        itemOpacity: 0.85,
                                        symbolSize: 20,
                                        effects: [
                                            {
                                                on: 'hover',
                                                style: {
                                                    itemOpacity: 1,
                                                },
                                            },
                                        ],
                                    },
                                ]}
                                role="application"
                                ariaLabel="Nivo bar chart demo"
                                barAriaLabel={function (e) {
                                    return e.id + ': ' + e.formattedValue + ' in week: ' + e.indexValue;
                                }}
                                tooltip={({ id, value, indexValue }) => (
                                    <div style={{ background: 'white', padding: '5px', border: '1px solid #ccc' }}>
                                        <strong>{id}</strong>
                                        <br />
                                        Week: {indexValue}
                                        <br />
                                        Amount: ${value}
                                    </div>
                                )}
                            />
                        </div>
                    </Box>
                    <Box my={4}>
                        <Typography variant="h5" gutterBottom>
                            Spending by Category
                        </Typography>
                        <div style={{ height: 400 }}>
                            <ResponsivePie
                                data={spendingByCategoryData}
                                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                                innerRadius={0.5}
                                padAngle={0.7}
                                cornerRadius={3}
                                colors={{ scheme: 'blues',  modifiers: [['darker', 1]] }}
                                borderWidth={1}
                                borderColor={{ from: 'color', modifiers: [['darker', 0.6]] }}
                                radialLabelsSkipAngle={10}
                                radialLabelsTextColor="#333333"
                                radialLabelsLinkColor={{ from: 'color' }}
                                sliceLabelsSkipAngle={10}
                                sliceLabelsTextColor="#333333"
                                legends={[
                                    {
                                        anchor: 'bottom',
                                        direction: 'row',
                                        justify: false,
                                        translateX: 0,
                                        translateY: 56,
                                        itemsSpacing: 0,
                                        itemWidth: 100,
                                        itemHeight: 18,
                                        itemTextColor: '#999',
                                        itemDirection: 'left-to-right',
                                        itemOpacity: 1,
                                        symbolSize: 18,
                                        symbolShape: 'circle',
                                        effects: [
                                            {
                                                on: 'hover',
                                                style: {
                                                    itemTextColor: '#000',
                                                },
                                            },
                                        ],
                                    },
                                ]}
                                tooltip={({ id, value, color }) => (
                                    <div style={{ background: 'black', padding: '5px', border: '1px solid #ccc', color }}>
                                        <strong>{id}</strong>
                                        <br />
                                        Amount: ${value}
                                    </div>
                                )}
                            />
                        </div>
                    </Box>
                </Container>
            </div>
        </div>
    );
};

export default AnalyticsPage;