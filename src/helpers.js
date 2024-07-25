import api from "./api";
import { ACCESS_TOKEN } from './constants';


// arrow function that fecthes data given 'key' in localStorage and returns it
export const fetchData = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

// export const fetchDataDjango = async (key) => {
//   try {
//     // Use the API client instead of fetch. Assuming 'api' is an Axios instance
//     const response = await api.get(`/api/${key}`);
//     console.log(response.data);
//     // No need to call .json() as Axios automatically parses JSON responses
//     return response.data;
//   } catch (error) {
//     console.error("Failed to fetch data in database: ", error);
//   }
// };
export async function fetchDataDjango(endpoint, options = {}) {
  const url = `http://127.0.0.1:8000/api/${endpoint}`; // Construct the full URL

  const token = localStorage.getItem(ACCESS_TOKEN); // Retrieve the token

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
    throw error; // Rethrow the error for further handling
  }
}

export async function fetchExpensesByBudgetId(budgetId) {
  const endpoint = `expenses/?id=${budgetId}`;
  return fetchDataDjango(endpoint);
}

// get all items that match a certain key in ExpenseItem.jsx
// export const getAllMatchingItems = async ({ category, key, value }) => {
//   try {
//     const endpoint = `${category}/${value}/`;
//     return await fetchDataDjango(endpoint);
//   } catch (error) {
//     console.error('Error in getAllMatchingItems:', error);
//     return [];
//   }
// };

// export const getAllMatchingItems = async ({ category, key, value }) => {
//   try {
//     const items = await fetchDataDjango(category);
//     return items.filter((item) => item[key] === value);
//   } catch (error) {
//     console.error('Error in getAllMatchingItems:', error);
//   }
// };
// export const getAllMatchingItems = async ({ category, key, value }) => {
//   try {
//     const items = await fetchDataDjango(category); // Await the resolution of the promise
//     console.log('Fetched items:', items); // Debug: Log fetched items
//     if (!Array.isArray(items)) {
//       console.error('Expense items is not an array:', items);
//     } else if (items.length === 0) {
//       console.error('Expense items is an empty array');
//     } else {
//       console.log(`Filtering by ${key}: ${value}`); // Debug: Log filter criteria
//       const filteredItems = items.filter((item) => {
//         console.log(`Item ${key}:`, item[key]); // Debug: Log item key value
//         return item[key] === value;
//       });
//       console.log('Filtered items:', filteredItems); // Debug: Log filtered items
//       return filteredItems;
//     }
//   } catch (error) {
//     console.error('Error in getAllMatchingItems:', error);
//   }
// };
// export const getAllMatchingItems = ({ category, key, value }) => {
//   const items = fetchDataDjango(category)
//   if (!Array.isArray(items)) {
//     console.error('Expense items is not an array:', items);
//   } else if (items.length === 0) {
//     console.error('expense items is an empty array');
//   } else {
//     // existing reduce logic
//     return items.filter((item) => item[key] === value)
//   }
// }

// create budget in Dashboard.jsx

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
// category might not be needed
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
    return data; // Return the created budget or relevant data
  } catch (error) {
    console.error('Error creating budget:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

// export const createExpense = async ({ name, amount, budgetId }) => {
//   const accessToken = localStorage.getItem(ACCESS_TOKEN);
//   if (!name || !amount || !budgetId) {
//     console.error('Missing required fields: name, amount, or budgetId');
//     return;
//   }

//   const newItem = {
//     name,
//     amount: +Number(amount), // Ensure amount is a number
//     budgetId: budgetId, // Adjusted to match a common backend naming convention
//   };

//   try {
//     const response = await fetch('https://pennywisebackend.onrender.com/api/expenses/', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${accessToken}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(newItem),
//     });

//     if (!response.ok) {
//       const errorDetails = await response.text();
//       console.error('Failed to create expense:', errorDetails);
//       throw new Error('Failed to create expense');
//     }
//   } catch (e) {
//     console.error('Error creating expense:', e);
//     throw e; // Re-throw the error to be handled by the caller
//   }
// };

export const createExpense = async ({ name, amount, budget, category}) => {
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
    return data; // Return the created income or relevant data
  } catch (error) {
    console.error('Error creating income:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
};


// export const createBudget = (e, amount, name) => {
//   e.preventDefault();
//   api
//     .post("https://pennywisebackend.onrender.com/api/budgets/", { amount, name })
//     .then((res) => {
//         if (res.status === 201) alert("Budget created!");
//         else alert("Failed to make budget.");
//         getBudgets();
//     })
//     .catch((err) => alert(err));

//     console.log("hi hi hi")
// };

// export const createBudget = ({
//   name, amount 
// }) => {
//     const newItem = {
//       id: crypto.randomUUID(),
//       name: name, 
//       createdAt: Date.now(),
//       amount: +amount,
//       color: generateRandomColor(),
//     }
//     const existingBudgets = fetchData("budgets") ?? []
//     return localStorage.setItem("budgets", JSON.stringify([...existingBudgets, newItem]))
// }

// export const createBudget = ({ name, amount }) => {
//     const username = JSON.parse(localStorage.getItem("userName"));
//     const newItem = {
//         id: crypto.randomUUID(),
//         name: name, 
//         createdAt: Date.now(),
//         amount: +amount,
//         color: generateRandomColor(),
//     };
//     const existingBudgets = fetchData(`${username}-budgets`) ?? [];
//     return localStorage.setItem(`${username}-budgets`, JSON.stringify([...existingBudgets, newItem]));
// };

// export const createBudget = async ({ name, amount }) => {
//   const accessToken = localStorage.getItem('ACCESS_TOKEN'); // Assuming the access token is stored in localStorage
//   const username = JSON.parse(localStorage.getItem("userName")); // This might still be used for local operations or replaced by user identification through token on the backend
//   const newItem = {
//     id: crypto.randomUUID(),
//     name: name, 
//     createdAt: Date.now(),
//     amount: +amount,
//     color: generateRandomColor(),
//   };

//   // Example of sending newItem to a backend API with the access token
//   const response = await fetch('api/budgets/create', {
//     method: 'POST',
//     headers: {
//       'Authorization': `Bearer ${accessToken}`,
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(newItem),
//   });

//   if (!response.ok) {
//     throw new Error('Failed to create budget');
//   }
// };

//create expense in Dashboard.jsx
// export const createExpense = ({ name, amount, budgetId }) => {
//     const username = JSON.parse(localStorage.getItem("userName"));
//     const newItem = {
//       id: crypto.randomUUID(),
//       name: name, 
//       createdAt: Date.now(),
//       amount: +amount,
//       budgetId: budgetId,
//     }
//     const existingExpenses = fetchData(`${username}-expenses`) ?? []
//     return localStorage.setItem(`${username}-expenses`, JSON.stringify([...existingExpenses, newItem]))
// }

// delete item from local storage
export async function deleteItem(endpoint) {
  const url = `http://127.0.0.1:8000/api/${endpoint}`; // Construct the full URL

  const token = localStorage.getItem(ACCESS_TOKEN); // Retrieve the token

  const fetchOptions = {
    method: 'DELETE', // Ensure the method is DELETE
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
    // Handle the error (e.g., show an error message to the user)
  }
};

// export const deleteItem = ({ key, id }) => {
//   const existingData = fetchData(key) ?? []

//   if (id) { // in this case we filter in, so we keep the items that do not have the id
//     const newData = existingData.filter((item) => item.id !== id)
//     return localStorage.setItem(key, JSON.stringify(newData))
//   }
//   return localStorage.removeItem(key);
// }

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
// export const calculateSpentByBudget = async (budgetId) => {
//   try {
//       const expenses = await getAllMatchingItems({
//           category: "expenses",
//           key: "budgetId",
//           value: budgetId
//       });

//       if (!expenses || expenses.length === 0) {
//           return 0;
//       }

//       const totalSpent = expenses.reduce((total, expense) => total + expense.amount, 0);
//       return totalSpent;
//   } catch (error) {
//       console.error("Error calculating spent by budget:", error);
//       return 0;
//   }
// };

// export const calculateSpentByBudget = async (budgetId) => {
//   try {
//     const expenses = await getAllMatchingItems({ category: 'expenses', key: 'budget', value: budgetId });
//     if (!expenses.length) {
//       return 0;
//     }
//     return expenses.reduce((total, expense) => total + expense.amount, 0);
//   } catch (error) {
//     console.error('Error calculating spent by budget:', error);
//     return 0;
//   }
// };

// export const calculateSpentByBudget = (budgetId) => {
//   const expenses = fetchDataDjango("expenses/") ?? []
//   const budgetSpent = expenses.reduce((acc, expense) => {
//     if (expense.budgetId === budgetId) {
//       return acc + expense.amount
//     }
//     return acc
//   }, 0)
//   return budgetSpent
//   // this should do the same thing as above
//   // return expenses
//   //   .filter((exp) => exp.budgetId === budgetId)
//   //   .reduce((acc, curr) => acc + curr.amount, 0)
// }

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
