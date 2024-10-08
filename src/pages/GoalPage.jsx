import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";

// Library
import { toast } from "react-toastify"

// Components
import AddGoalsForm from "../components/forms/AddGoalsForm";
import GoalItem from "../components/cards/GoalItem";
import Sidebar from "../components/nav/Sidebar";
import Nav from "../components/nav/Nav";
import MenuIcon from '@mui/icons-material/Menu';

// Helpers
import { fetchData, fetchDataDjango, createGoal } from "../helpers";

// Loader function to tell react router dom how to load the data (in this case GoalPage)
export async function goalLoader() {
    const userName = await fetchData("userName");
    const goals = await fetchDataDjango("goals/");
    return { userName, goals };
}

// Action
export async function goalAction({ request }) {
    const data = await request.formData();
    const { _action, ...values } = Object.fromEntries(data);

    if (_action === "createGoal") {
        try {
            await createGoal({
                name: values.goalName,
                target_amount: values.targetAmount,
            
            })
            return toast.success(`Goal created successfully`)
        } catch (e) {
            throw new Error("There was a problem creating your goal.")
        }
    }

    if (_action === "deleteGoal") {
        const goalId = values.goalId;
        try {
            await fetchDataDjango(`goals/delete/${goalId}/`, {
                method: "DELETE",
            });
            toast.success('Goal deleted successfully');
            return { success: true };
        } catch (e) {
            console.error("Error deleting goal:", e);
            if (e.response) {
                // If there is a response object, log its details
                console.error("Response status:", e.response.status);
                console.error("Response data:", e.response.data);
            }
            throw new Error("There was a problem deleting the goal.");
        }
    }

    if (_action === "addSavings") {
        const { goalId, amount } = values;
        try {
            await fetchDataDjango(`goals/${goalId}/add-savings/`, {
                method: "POST",
                body: JSON.stringify({ amount }),
            });
            toast.success('Savings added to goal successfully');
            return { success: true };
        } catch (e) {
            console.error("Error creating goal:", e);
            if (e.response) {
                // If there is a response object, log its details
                console.error("Response status:", e.response.status);
                console.error("Response data:", e.response.data);
            }
            throw new Error("There was a problem adding savings.");
        }
    }

    if (_action === "redeemGoal") {
        const goalId = values.goalId;
        try {
            await fetchDataDjango(`goals/${goalId}/redeem/`, {
                method: "POST",
            });
            toast.success('Goal redeemed successfully');
            return { success: true };
        } catch (e) {
            console.error("Error redeeming goal:", e);
            if (e.response) {
                // If there is a response object, log its details
                console.error("Response status:", e.response.status);
                console.error("Response data:", e.response.data);
            }
            throw new Error("There was a problem redeeming the goal.");
        }
    }
}

const GoalPage = () => {
    const { userName, goals } = useLoaderData();
    const [goalsList, setGoalsList] = useState(goals);

    // sidebar
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };


    const updateGoals = async () => {
        const updatedGoals = await fetchDataDjango("goals/");
        setGoalsList(updatedGoals);
    };


    return (
        <>
                <div className="dashboard-container">
                    <Sidebar isVisible={sidebarVisible} />
                    <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
                        <MenuIcon />
                    </button>
                    <div className={`dashboard ${sidebarVisible ? '' : 'dashboard-expanded'}`}>
                        <Nav userName={userName} /> 
                    <div className="grid-lg">
                        <h1 className="h2">
                            All Goals
                        </h1>
                        <AddGoalsForm updateGoals={updateGoals} />
                        <div className="flex-spread">
                            {goalsList && goalsList.length > 0 ? (
                                goalsList.map((goal) => (
                                    <GoalItem key={goal.id} goal={goal} updateGoals={updateGoals} />
                                ))
                            ) : (
                                <p>No goals found</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GoalPage;
