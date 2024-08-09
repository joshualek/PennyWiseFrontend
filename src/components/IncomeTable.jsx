import IncomeItem from "./IncomeItem"
import React, { useState } from 'react';


export const IncomeTable = ({ income, incomeId }) => {
    const [sortOption, setSortOption] = useState("newestToOldest"); // Default sort option
    const [searchTerm, setSearchTerm] = useState("");

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleReset = () => {
        setSortOption("newestToOldest"); // Reset to default sort option
        setSearchTerm("");
    };

    // Filter income by search term
    const searchedIncome = searchTerm
        ? income.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : income;

    // Sort income based on selected sorting option
    const sortedIncome = searchedIncome.sort((a, b) => {
        switch (sortOption) {
            case "newestToOldest":
                return new Date(b.created_at) - new Date(a.created_at);
            case "oldestToNewest":
                return new Date(a.created_at) - new Date(b.created_at);
            case "lowToHigh":
                return a.amount - b.amount;
            case "highToLow":
                return b.amount - a.amount;
            default:
                return 0; // Default to no sorting if unknown option
        }
    });

    return (
        <div className="table-panel-container">
            <div className="filters-panel">
                <div className="filter-group">
                    <label htmlFor="search-filter">Search:</label>
                    <input
                        type="text"
                        id="search-filter"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search by name"
                    />
                </div>
                <div className="filter-group">
                    <label htmlFor="sort-filter">Sort By:</label>
                    <select id="sort-filter" onChange={handleSortChange} value={sortOption}>
                        <option value="newestToOldest">Newest to Oldest</option>
                        <option value="oldestToNewest">Oldest to Newest</option>
                        <option value="lowToHigh">Amount: Low to High</option>
                        <option value="highToLow">Amount: High to Low</option>
                    </select>
                </div>
                <button className="reset-button" onClick={handleReset}>Reset Filters</button>
            </div>
            <div className="table">
                <table>
                    <thead>
                        <tr>
                            {
                                ["Name", "Amount", "Date", ""].map((header, index) => (
                                    <th key={index}>{header}</th>
                                ))
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            sortedIncome.map((item) => (
                                <tr key={item.id}>
                                    <IncomeItem income={item} />
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default IncomeTable;