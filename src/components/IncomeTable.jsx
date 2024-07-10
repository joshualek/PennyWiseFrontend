import IncomeItem from "./IncomeItem"



export const IncomeTable = ({ income, incomeId}) => {
    return (
        <div className="table">
            <table>
                <thead>
                    <tr>
                        {
                            ["Name", "Amount", "Date"].map((header, index) => (
                                <th key={index}>{header}</th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        income.map((income) => (
                            <tr key={income.id}>
                                <IncomeItem income={income} incomeId={incomeId}/>
                            </tr>    
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default IncomeTable
