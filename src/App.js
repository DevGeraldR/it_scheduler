import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/context/Context";
import { PrivateRoute } from "./components/route/PrivateRoute";
import Login from "./components/authentication/Login";
import Layout from "./components/home/Layout";
import Homepage from "./components/home/Homepage";
import AddEmployee from "./components/add_employee/AddEmployee";
import EmployeeInformation from "./components/employee_information/EmployeeInformation";
import EditEmployee from "./components/edit_employee/EditEmployee";
import { AuthenticationRoute } from "./components/route/AuthenticationRoute";
import AddLeave from "./components/leave/AddLeave";
import Leave from "./components/leave/Leave";
import AddAbsent from "./components/absent/AddAbsent";
import Absent from "./components/absent/Absent";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route element={<AuthenticationRoute />}>
            <Route path="/" element={<Login />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/homepage" element={<Layout />}>
              <Route index element={<Homepage />} />
              <Route path="/homepage/addEmployee" element={<AddEmployee />} />
              <Route
                path="/homepage/employeeInformation"
                element={<EmployeeInformation />}
              />
              <Route
                path="/homepage/EditEmployee/:employeeId"
                element={<EditEmployee />}
              />
              <Route
                path="/homepage/employeeInformation/leave"
                element={<Leave />}
              />
              <Route
                path="/homepage/employeeInformation/leave/addLeave"
                element={<AddLeave />}
              />
              <Route
                path="/homepage/employeeInformation/absent"
                element={<Absent />}
              />
              <Route
                path="/homepage/employeeInformation/absent/addAbsent"
                element={<AddAbsent />}
              />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
