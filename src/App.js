import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/context/Context";
import { PrivateRoute } from "./components/route/PrivateRoute";
import Login from "./components/authentication/Login";
import Layout from "./components/home/Layout";
import Homepage from "./components/home/Homepage";
import AddEmployee from "./components/add_employee/AddEmployee";
import EmployeeInformation from "./components/employee_information/EmployeeInformation";
import { AuthenticationRoute } from "./components/route/AuthenticationRoute";

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
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
