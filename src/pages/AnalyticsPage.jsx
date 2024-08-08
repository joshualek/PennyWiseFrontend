import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";

// Library
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { Box, Grid, Select, MenuItem, FormControl, InputLabel, useTheme } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Components
import Sidebar from "../components/Sidebar";
import Nav from "../components/Nav";
import AnalyticsBox from "../components/AnalyticsBox";
import Piechart from "../components/charts/Piechart";


// Helper functions
import { fetchData, fetchDataDjango } from "../helpers";

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

    const spendingPerMonthData = analyticsData.spending_per_month.map(item => ({
        month: months[item.month - 1],
        total_spent: item.total_spent,
    }));

    const netIncomePerMonthData = analyticsData.net_income_per_month.map(item => ({
        month: months[item.month - 1],
        net_income: item.net_income,
    }));

    // Merge the data for the line chart
    const lineChartData = months.map((month, index) => {
        const spendingData = spendingPerMonthData.find(data => data.month === month) || {};
        const incomeData = netIncomePerMonthData.find(data => data.month === month) || {};
        return {
            month,
            total_spent: spendingData.total_spent || 0,
            net_income: incomeData.net_income || 0
        };
    });

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

    // Pie Chart colours
    const customColors = ({ id, data }) => {
        if (id === 'Food') return '#87CEEB';
        if (id === 'Transport') return '#00B4D8';
        if (id === 'Shopping') return '#2C7DA0';
        return '#1a6299'; // Default: Blue color
    };
    // for chart labels
    const theme = {
        labels: {
            text: {
                fontSize: 15, 
                fontWeight: 'bold',
            },
        },
        legends: {
            text: {
                fontSize: 15, 
                fontWeight: 'bold',
            },
        },
    };
    return (
        <div className="dashboard-container">
            <Sidebar isVisible={sidebarVisible} />
            <div className={`dashboard ${sidebarVisible ? '' : 'dashboard-expanded'}`}>
                <Nav userName={userName} />
                <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
                    <Bars3Icon />
                </button>
                <div className="grid-lg">
                    <h2>Analytics</h2>
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
                    <Grid container spacing={4} justifyContent="center" alignItems="center">
                        {[
                            { title: "Most Spent on Category", value: `${analyticsData.most_spent_category?.category__name || "N/A"} ($${analyticsData.most_spent_category?.total_spent?.toFixed(2) || 0})` },
                            { title: "Least Spent on Category", value: `${analyticsData.least_spent_category?.category__name || "N/A"} ($${analyticsData.least_spent_category?.total_spent?.toFixed(2) || 0})` },
                            { title: "Average Monthly Spent", value: `$${analyticsData.average_monthly_spent?.toFixed(2) || 0}` },
                            { title: "Net Income", value: `$${analyticsData.net_income_current_month?.toFixed(2) || 0}` },
                            { title: "Total Spending This Month", value: `$${analyticsData.total_spent_current_month?.toFixed(2) || 0}` },
                            { title: "Budgets Exceeded", value: `${analyticsData.budgets_exceeded}` },
                        ].map((stat, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index} display="flex" justifyContent="center" alignItems="center">
                                <AnalyticsBox title={stat.title} value={stat.value} />
                            </Grid>
                        ))}
                    </Grid>
                    <Box my={4}>
                        <h3>Monthly Spending and Net Income</h3>
                        <div style={{ height: 400 }}>
                            <ResponsiveContainer>
                                <LineChart
                                    data={lineChartData}
                                    margin={{ top: 20, right: 30, bottom: 70, left: 20 }}  // Adjust the bottom margin here
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="month"
                                        tick={{ fontSize: 12 }}  // Adjust the font size of the tick labels
                                        angle={-45}              // Rotate the tick labels if needed
                                        textAnchor="end"         // Align the rotated labels
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12 }}  // Adjust the font size of the tick labels
                                    />
                                    <Tooltip
                                        formatter={(value, name) => {
                                            const formattedValue = `$${value.toFixed(2)}`;
                                            if (name === 'total_spent') {
                                                return ['Total Spent', formattedValue];
                                            } else if (name === 'net_income') {
                                                return ['Net Income', formattedValue];
                                            }
                                            return [name, formattedValue];
                                        }}
                                        contentStyle={{ fontSize: '12px' }}  // Adjust the font size of the tooltip text
                                    />
                                    <Legend
                                        formatter={(value) => {
                                            switch (value) {
                                                case 'total_spent':
                                                    return 'Total Spent';
                                                case 'net_income':
                                                    return 'Net Income';
                                                default:
                                                    return value;
                                            }
                                        }}
                                        wrapperStyle={{ fontSize: 12 }}  // Smaller font size for legend
                                        layout="vertical"  // Vertical layout
                                        align="right"  // Align to the right
                                        verticalAlign="top"  // Align to the top
                                    />
                                    <Line type="monotone" dataKey="total_spent" stroke="#7dbddd" strokeWidth={3} activeDot={{ r: 8 }} />  {/* Thicker blue color for Total Spent */}
                                    <Line type="monotone" dataKey="net_income" stroke="#1e90ff" strokeWidth={3} />  {/* Contrasting blue color for Net Income */}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Box>
                    <Box my={4}>
                        <h3>Weekly Expenses for the Month</h3>
                        <div style={{ height: 400 }}>
                            <ResponsiveBar
                                data={weeklyExpensesData}
                                keys={['total_spent']}
                                indexBy="week"
                                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                                padding={0.3}
                                valueScale={{ type: 'linear' }}
                                indexScale={{ type: 'band', round: true }}
                                colors={"#7dbddd"}
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
                                theme={theme}
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
                        <h3>Spending by Category</h3>
                        <div style={{ height: 400 }}>
                            <ResponsivePie
                                data={spendingByCategoryData}
                                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                                innerRadius={0.5}
                                padAngle={0.7}
                                cornerRadius={3}
                                colors={customColors}
                                borderWidth={1}
                                borderColor={{ from: 'color', modifiers: [['darker', 0.6]] }}
                                radialLabelsSkipAngle={10}
                                radialLabelsTextColor="#333333"
                                radialLabelsLinkColor={{ from: 'color' }}
                                sliceLabelsSkipAngle={10}
                                sliceLabelsTextColor="#333333"
                                theme={theme}
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

                            />
                        </div>
                    </Box>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
