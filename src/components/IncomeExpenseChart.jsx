// src/components/IncomeExpensesChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../helpers';

const IncomeExpensesChart = ({ income, expenses }) => {
    // Calculate total income and expenses
    const totalIncome = income.reduce((acc, curr) => acc + Number(curr.amount), 0);
    const totalExpenses = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);

    // Data for the chart
    const data = [
        { name: 'Income', amount: totalIncome },
        { name: 'Expenses', amount: totalExpenses }
    ];

    return (
        <div style={{ width: '100%', height: 300 }}>
            <h3>Income vs. Expenses</h3>
            <ResponsiveContainer>
                <BarChart data={data}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="amount" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default IncomeExpensesChart;
