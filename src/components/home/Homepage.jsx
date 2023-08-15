import React from "react";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/Firebase";
import EmplooyeesList from "./EmployeesList";
import { HiDocumentPlus } from "react-icons/hi2";
import { MdPersonSearch } from "react-icons/md";


function Hompage() {
  const [employees, setEmployees] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [hoverTextadd, setHoverTextadd] = useState("");
  useEffect(() => {
    //Use to listen to the database and get the new
    const unsub = onSnapshot(collection(db, "Employees"), (snapshot) => {
      const employee = [];
      snapshot.forEach((doc) => {
        employee.push(doc.data());
      });
      setEmployees(employee);
      setSearchList(employee);
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  const searchFilterFunction = (text) => {
    if (text) {
      const newData = employees.filter(function (item) {
        const itemData = item.eid ? item.eid : "";
        const textData = text;
        return itemData.indexOf(textData) > -1;
      });
      setSearchList(newData);
      setSearch(text);
    } else {
      setSearchList(employees);
      setSearch(text);
    }
  };
  const handleClickAdd = () => {
    // Redirect to the EditEmployee page with the employee ID as a route parameter
    navigate(`/homepage/addEmployee`);
  };

  return (
    <div className="flex h-full justify-center bg-gray-100 px-2">
      <div className="my-5 w-[1300px] h-[680px] border border-slate-400 bg-white p-5 rounded-xl shadow-lg text-gray-700">
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <h1 className="font-bold text-slate-900 block mb-0 leading-none pb-5">
            < MdPersonSearch size={50} />
          </h1>
          <div className="relative flex flex-wrap items-stretch mb-4">
            <input
              type="search"
              value={search}
              className="form-control relative flex-auto min-w-0 block px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-black focus:outline-none"
              placeholder="Search EID"
              aria-label="Search"
              aria-describedby="button-addon2"
              onChange={(e) => searchFilterFunction(e.target.value)}
            />
          </div>
          <button
            className="font-bold ml-auto   text-slate-900 hover:text-yellow-400 transition duration-300 ease-in-out transform  hover:scale-110 flex items-center"
            onClick={handleClickAdd}
            onMouseEnter={() => setHoverTextadd("Add Employee")}
            onMouseLeave={() => setHoverTextadd("")}
          // Add your onClick event to navigate to the "Add Employee" page
          >
            < HiDocumentPlus size={36} />
            {hoverTextadd && (
              <div className="ml-2 text-yellow-400 text-sm">{hoverTextadd}</div>
            )}
          </button>
        </div>
        <br />
        {isLoading ? (
          <h1 className="text-center pt-5">Retrieving data...</h1>
        ) : (
          <div className="max-h-[500px] overflow-scroll">
            <EmplooyeesList employees={searchList} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Hompage;
