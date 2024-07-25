import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

// Library
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import Main, { mainLoader } from "./layouts/Main";

// Actions
import { logoutAction } from "./actions/logout";
import { deleteBudget } from "./actions/deleteBudget";

// Routes
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard, { dashboardAction, dashboardLoader } from "./pages/Dashboard";
import BudgetPage, { budgetAction, budgetLoader } from "./pages/BudgetPage";
import ExpensesPage, { expensesAction, expensesLoader } from "./pages/ExpensesPage";
import IncomePage, {incomeAction, incomeLoader } from "./pages/IncomePage";
import AnalyticsPage, {analyticsLoader} from "./pages/AnalyticsPage";
import Home, { homeAction, homeLoader } from "./pages/Home"
import Intro from "./pages/Intro";
import Error from "./pages/Error";
import Register from "./pages/Register";
import Login from "./pages/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    loader: mainLoader,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Intro />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "register",
        element: <Register />
      },
      {
        path: "logout",
        action: logoutAction
      },
      {
        path: "home",
        element: ( <Home />
          // <ProtectedRoute>
          //   <Home />
          // </ProtectedRoute>
        ),
        loader: homeLoader,
        action: homeAction,
        errorElement: <Error />
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
        loader: dashboardLoader,
        action: dashboardAction,
        errorElement: <Error />
      },
      {
        path: "budget/:id",
        element: <BudgetPage />,
        loader: budgetLoader,
        action: budgetAction,
        errorElement: <Error />,
        children: [
          {
            path: "delete",
            element: <Navigate to="/dashboard" />,
            loader: dashboardLoader,
            action: deleteBudget,
            errorElement: <Error />,
          }
        ]
      },
      {
        path: "expenses",
        element: <ExpensesPage />,
        loader: expensesLoader,
        action: expensesAction,
        errorElement: <Error />
      },

      {
        path: "income",
        element: <IncomePage />,
        loader: incomeLoader,
        action: incomeAction,
        errorElement: <Error />
      },

      {
        path: "analytics",
        element: <AnalyticsPage />,
        loader: analyticsLoader,
        errorElement: <Error />
      },
    ]
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
      <ToastContainer />
    </div>
  );
}

export default App;
