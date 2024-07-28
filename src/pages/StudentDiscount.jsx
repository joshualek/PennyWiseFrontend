import React, { useState, useEffect, useRef } from "react"
import { Link, Form, useFetcher, useLoaderData, useNavigate, } from "react-router-dom"

// Library
import { Bars3Icon } from '@heroicons/react/24/solid'

// Components
import Sidebar from "../components/Sidebar"
import StudentDiscountCard from "../components/StudentDiscountCard"
import Nav from "../components/Nav"

// Helper functions
import { fetchData, fetchDataDjango } from "../helpers"

// Loader function
export async function studentDiscountLoader() {
    const userName = await fetchData("userName");
    const studentDiscount = await fetchDataDjango("student-discount/");
    return { userName, studentDiscount };
}

const StudentDiscount = () => {
    const { userName, studentDiscount } = useLoaderData();

    console.log("Rendering StudentDiscount with data:", studentDiscount);

    // sidebar
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    return (
        <>
            <div className="dashboard-container">
                <Sidebar isVisible={sidebarVisible} />
                <button className="toggle-sidebar-btn" onClick={toggleSidebar}>
                    <Bars3Icon />
                </button>
                <div className={`dashboard ${sidebarVisible ? '' : 'dashboard-expanded'}`}>
                    <Nav userName={userName} />
                    <h1>Student Discounts</h1>
                    <p>Show By: Most Recent</p>
                    <div className="flex-md">
                        {studentDiscount.map((discount) => (
                            <StudentDiscountCard
                                key={discount.id}
                                date={discount.date}
                                channel_id={discount.channel_id}
                                message={discount.message}
                                channel_link={discount.channel_link}
                                discount_link={discount.discount_link}
                            />
                        ))}
                    </div>
                </div>
            </div >
        </>
    )
}

export default StudentDiscount;