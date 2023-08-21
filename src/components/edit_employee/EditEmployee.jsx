import React, { useState, Fragment, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGlobal } from "../context/Context";
import { db, storage } from "../firebase/Firebase";
import { doc, updateDoc } from "firebase/firestore";

import { Dialog, Transition } from "@headlessui/react";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

function EditEmployee() {
  const { employeeId } = useParams();
  const { employee, setEmployee } = useGlobal();
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSuccessfulOpen, setIsSuccessfulOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState(employee.fullName);
  const [schedule, setSchedule] = useState(employee.schedule);
  const [shift, setShift] = useState(employee.shift);
  const [startTime, setStartTime] = useState(employee.startTime);
  const [endTime, setEndTime] = useState(employee.endTime);
  const [profile, setProfile] = useState(null);
  const [profileUrl, setProfileUrl] = useState(employee.profileUrl);
  const hiddenFileInput = useRef(null);
  // progress
  const [percent, setPercent] = useState(0);
  const [profilePath, setProfilePath] = useState(employee.profilePath);

  const handleShiftChange = (e) => {
    setShift(e.target.value);
  };

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };

  const handleChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      // Add the day to the schedule array
      setSchedule((prevSchedule) => {
        // Sort the days in the desired order (Monday to Sunday)
        const newSchedule = [...prevSchedule, value].sort((a, b) => {
          const days = ["M", "T", "W", "TH", "F", "SAT", "SU"];
          return days.indexOf(a) - days.indexOf(b);
        });
        return newSchedule;
      });
    } else {
      // Remove the day from the schedule array
      setSchedule((prevSchedule) =>
        prevSchedule.filter((day) => day !== value)
      );
    }
  };

  const handleEdit = async () => {
    setIsLoading(true);
    const employeeRef = doc(db, "employees", employeeId);

    // Prepare the data to be updated
    const updatedData = {
      fullName: fullName,
      schedule: schedule,
      shift: shift,
      profileUrl: profileUrl,
      profilePath: profilePath,
    };

    // Only update the start time if it is edited
    if (startTime !== employee.startTime) {
      updatedData.startTime = employee.startTime;
    }

    // Only update the end time if it is edited
    if (endTime !== employee.endTime) {
      updatedData.endTime = employee.endTime;
    }

    await updateDoc(employeeRef, updatedData);

    setEmployee({
      ...employee,
      ...updatedData,
    });

    setIsLoading(false);
    setIsSuccessfulOpen(true);
  };

  const handleClickUpload = (e) => {
    e.preventDefault();
    if (!profile) {
      setShowConfirmDialog(true);
      return;
    }

    const storageRef = ref(storage, `/images/${profile.name}`);

    // To check if file exist check its url
    getDownloadURL(storageRef)
      .then(() => {
        // If exist
        setShowConfirmDialog(true);
      })
      .catch((error) => {
        console.log(error);
        // If not
        // To be use for record
        setProfilePath(`/images/${profile.name}`);

        // progress can be paused and resumed. It also exposes progress updates.
        // Receives the storage reference and the file to upload.
        const uploadTask = uploadBytesResumable(storageRef, profile);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const percent = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );

            // update progress
            setPercent(percent);
          },
          (err) => console.log(err),
          () => {
            // download profileUrl
            getDownloadURL(uploadTask.snapshot.ref).then((profileUrl) => {
              setProfileUrl(profileUrl);
            });
          }
        );
      });
  };

  // Handles input change event and updates state
  function handleChangeProfile(event) {
    setProfile(event.target.files[0]);
  }

  const handleClickRemove = (e) => {
    e.preventDefault();
    // Create a reference to the file to delete
    const desertRef = ref(storage, profilePath);

    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        console.log("File deleted successfully");
      })
      .catch((error) => {
        console.log(error);
      });

    // To reformat the variable
    removeFile();
  };

  function removeFile() {
    hiddenFileInput.current.value = null;
    setProfile(null);
    setProfileUrl(employee.profileUrl);
    setPercent(0);
    setProfilePath(employee.profilePath);
  }

  return (
    <form
      className="flex flex-col min-h-full p-6 bg-gray-200 flex items-center justify-center"
      onSubmit={(e) => {
        e.preventDefault();
        handleEdit();
      }}
    >
      <div className="container max-w-screen-lg rounded-lg ">
        <div className="container max-w-screen-lg rounded-lg">
          <header className="bg-slate-900 p-3 rounded-t-lg">
            <div className="ml-5 text-gray-200 mx-auto max-w-screen-lg">
              <p className="font-bold text-white text-lg">Edit Employee</p>
              <p>Edit the employee's details</p>
            </div>
          </header>
          <div className="bg-white border border-slate-400 rounded-b-lg shadow-lg p-4 px-4 md:p-8 mb-6 ">
            <div className="lg:col-span-2">
              <div className="grid gap-4 gap-y-4  text-sm grid-cols-1 md:grid-cols-5"></div>
              <div className="md:col-span-5 ">
                <label className="font-bold">Full Name</label>
                <input
                  type="text"
                  required
                  className="h-10 border mt-1 mb-5 rounded px-4 w-full bg-gray-50"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                  }}
                />
              </div>
              <div className="md:col-span-5 ">
                <label className="font-bold">New profile picture</label>
                <div className="flex items-center mt-1">
                  <input
                    type="file"
                    accept="image/*"
                    className=" w-15"
                    ref={hiddenFileInput}
                    onChange={handleChangeProfile}
                  />

                  <button
                    onClick={handleClickUpload}
                    className="ml-auto px-3 py-1 bg-slate-900 text-white rounded hover:bg-slate-600"
                  >
                    Upload
                  </button>
                </div>
                <div className="mt-2">
                  <div className="relative h-2 bg-gray-300 rounded-md">
                    <div
                      className="absolute h-full bg-slate-500 rounded-md"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{percent}% done</p>
                </div>
                {percent === 100 && (
                  <button
                    onClick={handleClickRemove}
                    className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="md:col-span-5">
                <label className="font-bold">Select Shift</label>{" "}
                <select
                  id="shift"
                  value={shift}
                  type="combobox"
                  className="h-10 border mt-1  mb-5 rounded px-4 w-full bg-gray-50"
                  onChange={handleShiftChange}
                >
                  <option value="Morning">Morning</option>
                  <option value="Night">Night</option>
                </select>
              </div>
              <div className="md:col-span-5 mb-5 flex flex-col md:flex-row">
                <div className="mb-2 md:mb-0">
                  <label className="font-bold">Start Time:</label>
                  <input
                    type="time"
                    id="startTime"
                    className="h-10 border mt-1 ml-2 rounded px-4 w-500 bg-gray-50"
                    value={startTime}
                    onChange={handleStartTimeChange}
                  />
                </div>

                <div className="md:ml-2">
                  <label className="font-bold">End Time:</label>
                  <input
                    type="time"
                    id="endTime"
                    className="h-10 border mt-1 ml-2 rounded px-4 w-500 bg-gray-50"
                    value={endTime}
                    onChange={handleEndTimeChange}
                  />
                </div>
              </div>
              <div className="md:col-span-5 ">
                <label className="font-bold">Schedule</label>
                <ul className="items-center w-full text-gray-500 mt-2 bg-white sm:flex">
                  <li className="w-full rounded-lg ml-1 shadow-sm mt-1 border border-gray-200 hover:border-slate-400 ">
                    <div className="flex items-center pl-3">
                      <input
                        id="monday-checkbox-list"
                        type="checkbox"
                        className="w-4 h-4"
                        onChange={handleChange}
                        value="M"
                        checked={schedule.includes("M")}
                      />
                      <label
                        htmlFor="monday-checkbox-list"
                        className="w-full py-3 ml-2 text-sm font-medium"
                      >
                        Monday
                      </label>
                    </div>
                  </li>
                  <li className="w-full rounded-lg  ml-1 shadow-sm mt-1 border border-gray-200 hover:border-slate-400">
                    <div className="flex items-center pl-3">
                      <input
                        id="tuesday-checkbox-list"
                        type="checkbox"
                        className="w-4 h-4"
                        onChange={handleChange}
                        value="T"
                        checked={schedule.includes("T")}
                      />
                      <label
                        htmlFor="tuesday-checkbox-list"
                        className="w-full py-3 ml-2 text-sm font-medium"
                      >
                        Tuesday
                      </label>
                    </div>
                  </li>
                  <li className="w-full rounded-lg  ml-1 shadow-sm mt-1 border border-gray-200 hover:border-slate-400">
                    <div className="flex items-center pl-3">
                      <input
                        id="wednesday-checkbox-list"
                        type="checkbox"
                        onChange={handleChange}
                        value="W"
                        checked={schedule.includes("W")}
                        className="w-4 h-4"
                      />
                      <label
                        htmlFor="wednesday-checkbox-list"
                        className="w-full py-3 ml-2 text-sm font-medium"
                      >
                        Wednesday
                      </label>
                    </div>
                  </li>
                  <li className="w-full rounded-lg  ml-1 shadow-sm mt-1 border border-gray-200 hover:border-slate-400">
                    <div className="flex items-center pl-3">
                      <input
                        id="thursday-checkbox-list"
                        type="checkbox"
                        onChange={handleChange}
                        value="TH"
                        checked={schedule.includes("TH")}
                        className="w-4 h-4"
                      />
                      <label
                        htmlFor="thursday-checkbox-list"
                        className="w-full py-3 ml-2 text-sm font-medium"
                      >
                        Thursday
                      </label>
                    </div>
                  </li>
                  <li className="w-full rounded-lg  ml-1 shadow-sm mt-1 border border-gray-200 hover:border-slate-400">
                    <div className="flex items-center pl-3">
                      <input
                        id="friday-checkbox-list"
                        type="checkbox"
                        onChange={handleChange}
                        value="F"
                        checked={schedule.includes("F")}
                        className="w-4 h-4"
                      />
                      <label
                        htmlFor="friday-checkbox-list"
                        className="w-full py-3 ml-2 text-sm font-medium"
                      >
                        Friday
                      </label>
                    </div>
                  </li>
                  <li className="w-full rounded-lg  ml-1 shadow-sm mt-1 border border-gray-200 hover:border-slate-400">
                    <div className="flex items-center pl-3">
                      <input
                        id="saturday-checkbox-list"
                        type="checkbox"
                        onChange={handleChange}
                        value="SAT"
                        checked={schedule.includes("SAT")}
                        className="w-4 h-4"
                      />
                      <label
                        htmlFor="saturday-checkbox-list"
                        className="w-full py-3 ml-2 text-sm font-medium"
                      >
                        Saturday
                      </label>
                    </div>
                  </li>
                  <li className="w-full rounded-lg  ml-1 shadow-sm mt-1  border border-gray-200 hover:border-slate-400">
                    <div className="flex items-center pl-3 ">
                      <input
                        id="sunday-checkbox-list"
                        type="checkbox"
                        onChange={handleChange}
                        value="SU"
                        checked={schedule.includes("SU")}
                        className="w-4 h-4"
                      />
                      <label
                        htmlFor="sunday-checkbox-list"
                        className=" w-full py-3 ml-2 text-sm font-medium "
                      >
                        Sunday
                      </label>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Transition appear show={showConfirmDialog} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            setIsSuccessfulOpen(false);
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="transition-transform ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition-transform ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                  static
                >
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-red-900"
                  >
                    Error!
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-800">
                      Profile picture existed or no file selected!
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="hover:text-white mt-10 md:mt-0  bg-yellow-300 w-[80px] rounded-md transition duration-300 ease-in-out transform hover:scale-100  bg-gray-100 px-4 py-2 text-sm font-medium  text-black-900 hover:bg-yellow-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        setShowConfirmDialog(false);
                      }}
                    >
                      Okay
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <div className="flex flex-row gap-2">
        <div className="flex flex-row gap-2">
          {isLoading ? (
            <button
              disabled
              className="bg-blue-100 text-blue-900 hover:bg-blue-200 focus-visible:ring-blue-500 inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              <svg
                className="w-5 h-5 mr-3 -ml-1 text-blue-900 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Please wait...
            </button>
          ) : (
            <button
              type="submit"
              className="hover:text-white border border-slate-400 shadow-md border bg-yellow-300 w-[120px] rounded-md transition duration-300 ease-in-out transform hover:scale-110  px-4 py-2 text-sm font-bold  text-black-900 hover:bg-yellow-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Add
            </button>
          )}
        </div>
        <Transition appear show={isSuccessfulOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => {
              setIsSuccessfulOpen(false);
            }}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Success!
                    </Dialog.Title>
                    <div className="mt-4">
                      <button
                        type="button"
                        className="bg-blue-100 text-blue-900 hover:bg-blue-200 focus-visible:ring-blue-500 inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                        onClick={() => {
                          navigate("/homepage");
                          setIsSuccessfulOpen(false);
                        }}
                      >
                        Okay
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </form>
  );
}

export default EditEmployee;
