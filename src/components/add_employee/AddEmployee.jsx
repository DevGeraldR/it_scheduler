import React, { useRef } from "react";
import { useState, Fragment } from "react";
import { db, storage } from "../firebase/Firebase";
import { doc, setDoc } from "firebase/firestore";
import { Dialog, Transition } from "@headlessui/react";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

function AddEmployee() {
  const [fullName, setFullName] = useState();
  const [isSuccessfulOpen, setIsSuccessfulOpen] = useState(false);
  const [eid, setEID] = useState();
  const [schedule, setSchedule] = useState([]);
  const [shift, setShift] = useState("Morning");
  // State to keep track of the selected time
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("12:00");
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState("IT Support Specialist");
  const [profile, setProfile] = useState(null);
  const [profileUrl, setProfileUrl] = useState("");
  // progress
  const [percent, setPercent] = useState(0);
  const [profilePath, setProfilePath] = useState("");
  const hiddenFileInput = useRef(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Event handler for when the user changes the time
  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);
  };

  const handleEndTimeChange = (event) => {
    setEndTime(event.target.value);
  };

  const handlePositionChange = (event) => {
    setPosition(event.target.value);
  };

  const handleShiftChange = (event) => {
    setShift(event.target.value);
  };
  const handleChange = (e) => {
    // Destructuring
    const { value, checked } = e.target;

    // Case 1 : The user checks the box
    if (checked) {
      setSchedule((prevSchedule) => {
        // Sort the days in the order of Monday to Sunday
        const updatedSchedule = [...prevSchedule, value].sort((a, b) => {
          const order = { M: 1, T: 2, W: 3, TH: 4, F: 5, SAT: 6, SU: 7 };
          return order[a] - order[b];
        });
        return updatedSchedule;
      });
    }

    // Case 2: The user unchecks the box
    else {
      setSchedule((prevSchedule) => prevSchedule.filter((e) => e !== value));
    }
  };
  const handleClick = async () => {
    setIsLoading(true);
    const employeeRef = doc(db, "employees", eid);

    await setDoc(employeeRef, {
      fullName: fullName,
      eid: eid,
      position: position,
      schedule: schedule,
      shift: shift,
      startTime: startTime,
      endTime: endTime,
      leave: [],
      absent: [],
      profileUrl: profileUrl
        ? profileUrl
        : "https://firebasestorage.googleapis.com/v0/b/it-scheduler-fcf53.appspot.com/o/images%2FdefaultAvatar.jpg?alt=media&token=d9fddc6c-14ea-463c-836b-c643c14b05bd",
      profilePath: profilePath ? profilePath : "/images/defaultAvatar.jpg",
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
              console.log(profileUrl);
            });
          }
        );
      });
  };

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

  // Handles input change event and updates state
  function handleChangeProfile(event) {
    setProfile(event.target.files[0]);
  }

  function removeFile() {
    hiddenFileInput.current.value = null;
    setProfile(null);
    setProfileUrl("");
    setPercent(0);
    setProfilePath("");
  }

  return (
    <form
      className="flex flex-col min-h-full p-6 flex items-center"
      onSubmit={(e) => {
        e.preventDefault();
        handleClick();
      }}
    >
      <div className="container max-w-screen-lg">
        <header className="bg-slate-900 p-3 rounded-t-lg">
          <div className="ml-5 text-gray-200 mx-auto max-w-screen-lg">
            <p className="font-bold text-white text-lg">Add Employee</p>
            <p>Please input all the employee's details</p>
          </div>
        </header>
        <div className="bg-white border border-slate-400 rounded-b-lg shadow-lg p-4 px-4 md:p-8 mb-6 ">
          <div className="lg:col-span-2">
            <div className="grid gap-4 gap-y-4 text-sm grid-cols-1 md:grid-cols-5">
              <div className="md:col-span-5">
                <label className="font-bold">Full Name</label>
                <input
                  type="text"
                  required
                  className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                  }}
                />
              </div>
              <div className="md:col-span-5">
                <label className="font-bold">Employee ID</label>
                <input
                  type="text"
                  required
                  className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                  placeholder="Employee ID"
                  value={eid}
                  onChange={(e) => {
                    setEID(e.target.value);
                  }}
                />
              </div>
              <div className="md:col-span-5 ">
                <label className="font-bold">Profile picture</label>
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
                    className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="md:col-span-5">
                <label className="font-bold">Position</label>{" "}
                <select
                  id="position"
                  value={position}
                  type="combobox"
                  className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                  onChange={handlePositionChange}
                >
                  <option value="IT Support Specialist">
                    IT Support Specialist
                  </option>
                  <option value="Senior IT Support Specialist">
                    Senior IT Support Specialist
                  </option>
                  <option value="IT Supervisor">IT Supervisor</option>
                  <option value="IT Manager">IT Manager</option>
                </select>
              </div>
              <div className="md:col-span-5">
                <label className="font-bold">Shift</label>{" "}
                <select
                  id="shift"
                  value={shift}
                  type="combobox"
                  className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
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
              {/*To be optimized*/}
              <div className="md:col-span-5">
                <label className="font-bold">Schedule</label>
                <ul className="items-center w-full text-gray-500 bg-white sm:flex">
                  <li className="w-full hover:border-slate-400 rounded-lg  ml-1 shadow-sm mt-1 border border-gray-200">
                    <div className="flex items-center pl-3">
                      <input
                        id="monday-checkbox-list"
                        type="checkbox"
                        className="w-4 h-4"
                        onChange={handleChange}
                        value="M"
                      />
                      <label
                        htmlFor="monday-checkbox-list"
                        className="w-full py-3 ml-2 text-sm font-medium"
                      >
                        Monday
                      </label>
                    </div>
                  </li>
                  <li className="w-full hover:border-slate-400 rounded-lg  ml-1 shadow-sm mt-1 border border-gray-200">
                    <div className="flex items-center pl-3">
                      <input
                        id="tuesday-checkbox-list"
                        type="checkbox"
                        className="w-4 h-4"
                        onChange={handleChange}
                        value="T"
                      />
                      <label
                        htmlFor="tuesday-checkbox-list"
                        className="w-full py-3 ml-2 text-sm font-medium"
                      >
                        Tuesday
                      </label>
                    </div>
                  </li>
                  <li className="w-full hover:border-slate-400 rounded-lg  ml-1 shadow-sm mt-1 border border-gray-200">
                    <div className="flex items-center pl-3">
                      <input
                        id="wednesday-checkbox-list"
                        type="checkbox"
                        onChange={handleChange}
                        value="W"
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
                  <li className="w-full hover:border-slate-400 rounded-lg  ml-1 shadow-sm mt-1 border border-gray-200">
                    <div className="flex items-center pl-3">
                      <input
                        id="thursday-checkbox-list"
                        type="checkbox"
                        onChange={handleChange}
                        value="TH"
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
                  <li className="w-full hover:border-slate-400 rounded-lg  ml-1 shadow-sm mt-1 border border-gray-200">
                    <div className="flex items-center pl-3">
                      <input
                        id="friday-checkbox-list"
                        type="checkbox"
                        onChange={handleChange}
                        value="F"
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
                  <li className="w-full hover:border-slate-400 rounded-lg  ml-1 shadow-sm mt-1 border border-gray-200">
                    <div className="flex items-center pl-3">
                      <input
                        id="saturday-checkbox-list"
                        type="checkbox"
                        onChange={handleChange}
                        value="SAT"
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
                  <li className="w-full hover:border-slate-400 rounded-lg  ml-1 shadow-sm mt-1 border border-gray-200">
                    <div className="flex items-center pl-3">
                      <input
                        id="sunday-checkbox-list"
                        type="checkbox"
                        onChange={handleChange}
                        value="SU"
                        className="w-4 h-4"
                      />
                      <label
                        htmlFor="sunday-checkbox-list"
                        className="w-full py-3 ml-2 text-sm font-medium "
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
            setShowConfirmDialog(false);
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
                <Dialog.Panel
                  className="w-full border border-slate-400 max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-center align-middle shadow-xl transition-all flex flex-col items-center justify-center"
                  static
                >
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-bold leading-6 text-gray-900 mb-2"
                  >
                    <AiOutlineCloseCircle
                      size={70}
                      className="text-red-500 mb-2 mt-2"
                    />
                    Error!
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-500">
                      File existed or no file selected!
                    </p>
                  </div>

                  <div className="mt-10 ">
                    <button
                      type="button"
                      className="hover:text-white bg-yellow-300 w-[100px] rounded-md transition duration-300 ease-in-out transform hover:scale-100 bg-gray-100 px-4 py-2 text-sm font-medium text-black-900 hover:bg-yellow-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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

      <div className="flex p-2  justify-center">
        {isLoading ? (
          <button
            disabled
            className=" mt-10 md:mt-0 bg-yellow-400 transition duration-300 ease-in-out transform hover:scale-100 text-black hover:bg-yellow-500 focus-visible:ring-white inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <svg
              className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
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
            className="hover:text-white shadow-md border bg-yellow-300 w-[120px] rounded-md transition duration-300 ease-in-out transform hover:scale-110  bg-gray-100 px-4 py-2 text-sm font-medium  text-black-900 hover:bg-yellow-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
                <Dialog.Panel
                  className="w-full border border-slate-400 max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-center align-middle shadow-xl transition-all flex flex-col items-center justify-center"
                  static
                >
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-bold leading-6 text-gray-900 mb-2"
                  >
                    <AiOutlineCheckCircle
                      size={70}
                      className="text-green-500"
                    />
                    Success!
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-500">
                      Employee has been added.
                    </p>
                  </div>

                  <div className="mt-10 ">
                    <button
                      type="button"
                      className="hover:text-white bg-yellow-300 w-[100px] rounded-md transition duration-300 ease-in-out transform hover:scale-100 bg-gray-100 px-4 py-2 text-sm font-medium text-black-900 hover:bg-yellow-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        setFullName("");
                        setEID("");
                        removeFile();
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
    </form>
  );
}

export default AddEmployee;
