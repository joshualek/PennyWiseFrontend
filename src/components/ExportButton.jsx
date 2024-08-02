import React from 'react';
import { ACCESS_TOKEN } from '../constants';


const ExportButton = () => {
    const handleExport = async () => {
        try {
            const token = localStorage.getItem(ACCESS_TOKEN);
            const response = await fetch('http://127.0.0.1:8000/api/export/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'financial_data.xlsx';
                document.body.appendChild(a);
                a.click();
                a.remove();
            } else {
                console.error('Failed to export data');
            }
        } catch (error) {
            console.error('Error exporting data:', error);
        }
    };

    return (
        <button onClick={handleExport} className="btn btn--primary">
            Export Data to Excel
        </button>
    );
};

export default ExportButton;
