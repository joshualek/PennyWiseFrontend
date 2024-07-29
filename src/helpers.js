import api from "./api";
import { ACCESS_TOKEN } from './constants';


// arrow function that fecthes data given 'key' in localStorage and returns it
export const fetchData = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

//Fetching Analytics

export async function fetchAnalyticsData() {
  const token = localStorage.getItem(ACCESS_TOKEN);
  try {
      const response = await fetch('http://127.0.0.1:8000/api/analytics/', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              ...(token && { Authorization: `Bearer ${token}` }),
          },
      });

      if (!response.ok) {
          const errorDetails = await response.json();
          console.error('Failed to fetch analytics data,', errorDetails);
          throw new Error('Failed to fetch analytics data');
      }

      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error fetching analytics data:', error);
      throw error;
  }
}

export async function fetchDataDjango(endpoint, options = {}) {
  const url = `http://127.0.0.1:8000/api/${endpoint}`;

  const token = localStorage.getItem(ACCESS_TOKEN); 

  const fetchOptions = {
    method: 'GET', 
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      // Add the Authorization header if the token exists
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    ...options, // Spread any additional options passed to the function
  };

  try {
    const response = await fetch(url, fetchOptions);
    return response.json(); // parses JSON response into native JavaScript objects
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export async function fetchExpensesByBudgetId(budgetId) {
  const endpoint = `expenses/?id=${budgetId}`;
  return fetchDataDjango(endpoint);
}

// get budgets array in ExpenseItem.jsx
export const getBudgetsArray = async () => {
  try {
    const budgets = await fetchDataDjango("budgets/");
    return budgets;
  } catch (error) {
    console.error('Error fetching budgets:', error);
  }
};
// create budget in Dashboard.jsx
export async function createBudget({ name, amount}) {
  try {
    const token = localStorage.getItem(ACCESS_TOKEN);
    const response = await fetch("http://127.0.0.1:8000/api/budgets/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        
      },
      body: JSON.stringify({ name, amount}),
    });
    
    if (!response.ok) {
      const errorDetails = await response.json();
      console.error('failed to add budget,', errorDetails)
      throw new Error('Failed to create budget');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating budget:', error);
    throw error;
  }
}

export const createExpense = async ({ name, amount, budget, category }) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  const newItem = {
    name: name,
    created_at: Date.now(),
    amount: +amount,
    budget: budget,
    category: category,
  };

  const response = await fetch("http://127.0.0.1:8000/api/expenses/", {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newItem),
  });

  if (!response.ok) {
    throw new Error('Failed to create expense');
  }


};

export const createIncome = async ({ name, amount}) => {
  try {
    const token = localStorage.getItem(ACCESS_TOKEN);
    const response = await fetch("http://127.0.0.1:8000/api/income/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        
      },
      body: JSON.stringify({ name, amount }),
    });
    
    if (!response.ok) {
      const errorDetails = await response.json();
      console.error('failed to add income,', errorDetails)
      throw new Error('Failed to add income');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating income:', error);
    throw error;
  }
};

// delete item from local storage
export async function deleteItem(endpoint) {
  const url = `http://127.0.0.1:8000/api/${endpoint}`;

  const token = localStorage.getItem(ACCESS_TOKEN);

  const fetchOptions = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  try {
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const responseBody = await response.text(); // Use .text() first to handle empty body
    if (!responseBody) {
      console.log('Response body is empty');
      return null; // or appropriate handling for empty response
    }
    return JSON.parse(responseBody);
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
};

// total spent by budget
// Fetch expenses and calculate the total amount spent for a given budget
export const calculateSpentByBudget = async (budgetId) => {
  try {
    const expenses = await fetchDataDjango("expenses/");
    const filteredExpenses = expenses.filter(expense =>  expense.budget === budgetId);
    const totalSpent = filteredExpenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);    
    return totalSpent;
  } catch (error) {
    console.error("Error calculating spent by budget:", error);
    return 0; // Return 0 in case of an error
  }
};

// FORMATTING
// Format Percentage
export const formatPercentage = (amount) => {
  return amount.toLocaleString(undefined, {
    style: "percent",
    minimumFractionDigits: 0,
  })
}

// Format currency
export const formatCurrency = (amount) => {
  return amount.toLocaleString(undefined, {
    style: "currency",
    currency: "SGD",
  })
}


export async function createGoal({ name, target_amount }) {
  try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const response = await fetch("http://127.0.0.1:8000/api/goals/", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({ name, target_amount }),
      });

      if (!response.ok) {
          const errorDetails = await response.json();
          console.error('failed to create goal,', errorDetails);
          throw new Error('Failed to create goal');
      }

      const data = await response.json();
      return data; // Return the created savings goal or relevant data
  } catch (error) {
      console.error('Error creating savings goal:', error);
      throw error; // Rethrow the error to be handled by the caller
  }
}

export async function updateGoalProgress(goalId, amount) {
  const token = localStorage.getItem(ACCESS_TOKEN);
  const response = await fetch(`http://127.0.0.1:8000/api/goals/${goalId}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ current_amount: amount }),
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    console.error('Failed to update goal progress:', errorDetails);
    throw new Error('Failed to update goal progress');
  }

  return response.json();
}


export const getGoalsArray = async () => {
  try {
      const goals = await fetchDataDjango("goals/");
      return goals;
  } catch (error) {
      console.error('Error fetching goals:', error);
  }
};
