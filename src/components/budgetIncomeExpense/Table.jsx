import React, { useState } from 'react';
import ExpenseItem from './ExpenseItem';
import "../../styles/Table.css";

const Table = ({ expenses, categories = [] }) => {
    const [filterCategory, setFilterCategory] = useState("");
    const [sortOption, setSortOption] = useState("newestToOldest"); // Default sort option
    const [searchTerm, setSearchTerm] = useState("");

    const handleFilterChange = (event) => {
        setFilterCategory(event.target.value);
    };

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleReset = () => {
        setFilterCategory("");
        setSortOption("newestToOldest"); // Reset to default sort option
        setSearchTerm("");
    };

    // Debug: Log the selected filter category and available expenses
    console.log("Selected filter category:", filterCategory);
    console.log("Available expenses:", expenses);

    // Create a map of category IDs to names
    const categoryMap = categories.reduce((map, category) => {
        map[category.id] = category.name;
        return map;
    }, {});

    const filteredExpenses = expenses.filter(expense => {
        const expenseCategoryName = categoryMap[expense.category];
        const matchesCategory = filterCategory ? expenseCategoryName === filterCategory : true;
        const matchesSearchTerm = searchTerm ? expense.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;

        // Debug: Log the filtering process
        console.log("Expense:", expense);
        console.log("Expense Category Name:", expenseCategoryName);
        console.log("Filter Category:", filterCategory);
        console.log("Matches Category:", matchesCategory);
        console.log("Matches Search Term:", matchesSearchTerm);

        return matchesCategory && matchesSearchTerm;
    });
    // Debug: Log the filtered expenses
    console.log("Filtered expenses:", filteredExpenses);

    // Sort expenses based on selected sorting option
    const sortedExpenses = filteredExpenses.sort((a, b) => {
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
                    <label htmlFor="category-filter">Category:</label>
                    <select id="category-filter" onChange={handleFilterChange} value={filterCategory}>
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.name}>{category.name}</option>
                        ))}
                    </select>
                </div>
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
                                ["Name", "Amount", "Date", "Budget", "Category",""].map((header, index) => (
                                    <th key={index}>{header}</th>
                                ))
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            sortedExpenses.map((expense) => (
                                <tr key={expense.id}>
                                    <ExpenseItem expense={expense} />
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Table;