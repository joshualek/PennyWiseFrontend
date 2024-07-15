import ExpenseItem from "./ExpenseItem"


export const Table = ({ expenses, expenseId }) => {
    return (
        <div className="table">
            <table>
                <thead>
                    <tr>
                        {
                            ["Name", "Amount", "Date", "Budget", "Category"].map((header, index) => (
                                <th key={index}>{header}</th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        expenses.map((expense) => (
                            <tr key={expense.id}>
                                <ExpenseItem expense={expense} expenseId={expenseId}/>
                            </tr>    
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Table