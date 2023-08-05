// EmployeeList.js (Assuming this is the parent component that renders ListEmployee components)
import React, { useState, useEffect } from "react";
import { db } from "../firebase/Firebase";
import { collection, getDocs } from "firebase/firestore";
import ListEmployee from "./ListEmployee";

function EmployeeList() {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        // Fetch the list of employees from the Firestore database
        const fetchEmployees = async () => {
            const employeeCollection = collection(db, "Employees");
            const employeeSnapshot = await getDocs(employeeCollection);
            const employeesData = employeeSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setEmployees(employeesData);
        };

        fetchEmployees();
    }, []);

    // Handle removing an employee from the list
    const handleRemoveEmployee = (employeeId) => {
        setEmployees((prevEmployees) =>
            prevEmployees.filter((employee) => employee.id !== employeeId)
        );
    };

    return (
        <div>
            <h2>Employee List</h2>
            <table>
                <tbody>
                    {employees.map((employee, index) => (
                        <ListEmployee
                            key={employee.id}
                            employee={employee}
                            index={index}
                            onRemoveEmployee={handleRemoveEmployee} // Pass the handler to ListEmployee
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default EmployeeList;
