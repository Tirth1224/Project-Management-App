import { SetStateAction, useContext, useState, useEffect } from "react";
import { Project, UserContext } from "../context/UserContext";
import toast from "react-hot-toast";

interface FormProps {
  selectedProject: Project | null;
  setSelectedProject: React.Dispatch<SetStateAction<Project | null>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Form: React.FC<FormProps> = ({
  selectedProject,
  setSelectedProject,
  isOpen,
  setIsOpen,
}) => {
  
  const { addProject, updateProject } = useContext(UserContext)!;

  const [data, setData] = useState<Omit<Project, "id">>({
    projectTitle: "",
    projectDescription: "",
    tasks: [],
  });

  const [minDate, setMinDate] = useState<string>("");

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");

    setMinDate(`${year}-${month}-${day}`);
  }, []);

  useEffect(() => {
    if (selectedProject) {
      setData(selectedProject);
    }
  }, [selectedProject]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name] : e.target.value,
    })
  }

  const handleTaskChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index:number) => {
    const updatedTasks = [...data.tasks];
    updatedTasks[index] = {
      ...updatedTasks[index],
      [e.target.name] : e.target.value,
    };
    setData({...data, tasks:updatedTasks})
  }

  const handleSubTaskChange = (e: React.ChangeEvent<HTMLInputElement>, taskIndex: number, subtaskIndex: number) => {
    const updatedTasks = [...data.tasks];
    updatedTasks[taskIndex].subtasks[subtaskIndex].subtask = e.target.value;
    setData({...data, tasks:updatedTasks})
  }

  const addTask = () => {
    setData ({
      ...data,
      tasks: [
        ...data.tasks, {
          taskTitle: "",
          taskDescription: "",
          dueDate: minDate,
          projectStatus: "Pending",
          subtasks: [{ subtask: "" }],
        }
      ]
    })
  }

  const addSubTask = (taskIndex: number) => {
    const updatedTasks = [...data.tasks];
    updatedTasks[taskIndex].subtasks.push({ subtask: "" });
    setData({ ...data, tasks:updatedTasks});
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(selectedProject){
      updateProject(selectedProject.id, data);
      setSelectedProject(null);
      toast.success('Project Updated SuccessFully')
    }
    else{
      addProject(data);
      toast.success('Project Created SuccessFully')
    }
    setIsOpen(false);
    setData({
      projectTitle: "",
      projectDescription: "",
      tasks: [],
    })
  }

  const removeTask = (taskIndex: number) => {
    const updatedTasks = data.tasks.filter((_, index) => index !== taskIndex);
    setData({...data, tasks:updatedTasks});
  }

  const removeSubTask = (taskIndex: number, subtaskIndex: number) => {
    const updatedTasks = [...data.tasks];
    updatedTasks[taskIndex].subtasks = updatedTasks[taskIndex].subtasks.filter((_, index) => index !== subtaskIndex)
    setData({...data, tasks:updatedTasks});
  }

  return (
    <div className="font-Montserrat">
      <button
        className="px-4 py-2 mt-4 mx-auto block bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
        onClick={() => setIsOpen(true)}
      >
        Create Project
      </button>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-[3px] bg-black/80">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 h-auto max-h-[43rem] overflow-auto ml-3 mr-3 sm:ml-0 sm:mr-0">
            <div className="flex justify-between border-b pb-2 items-center">
              <h2 className="text-xl font-semibold">
                {selectedProject ? "Update Project" : "Add Project"}
              </h2>
              <button
                className="text-gray-500 hover:text:gray-700"
                onClick={() => {
                  setIsOpen(false);
                  setData({
                    projectTitle: "",
                    projectDescription: "",
                    tasks: [],
                  });
                  if (selectedProject) {
                    setSelectedProject(null);
                  }
                }}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="px-20 py-7">
              <div className="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="projectTitle"
                    className="block mb-2 text-sm font-medium text-blue-500"
                  >
                    Enter Project Title
                  </label>
                  <input
                    id="projectTitle"
                    name="projectTitle"
                    value={data.projectTitle}
                    onChange={handleChange}
                    className="bg-white-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="projectDescription"
                    className="block mb-2 text-sm font-medium text-blue-500"
                  >
                    Enter Description
                  </label>
                  <input
                    id="projectDescription"
                    name="projectDescription"
                    value={data.projectDescription}
                    onChange={handleChange}
                    className="bg-white-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required
                  />
                </div>
              </div>
              <button
                className="text-white mr-2 mb-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-auto px-5 py-2.5"
                type="button"
                onClick={addTask}
              >
                Add Task
              </button>

              {data.tasks.map((task, taskIndex) => (
                <div key={taskIndex} className="flex flex-col gap-5 border-2 border-blue-600 p-7 rounded-xl mt-5 mb-5">
                    <input 
                      name="taskTitle"
                      value={task.taskTitle}
                      onChange={(e) => handleTaskChange (e, taskIndex)}
                      placeholder="Enter Task Title"
                      className="bg-white-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      required
                    />
                    <input 
                      name="taskDescription"
                      value={task.taskDescription}
                      onChange={(e) => handleTaskChange(e, taskIndex)}
                      placeholder="Enter Task Description"
                      className="bg-white-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      required
                    />
                    <select 
                      name="projectStatus"
                      value={task.projectStatus}
                      onChange={(e) => handleTaskChange(e, taskIndex)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In-Progress">In-Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <input 
                      type="date"
                      name="dueDate"
                      value={task.dueDate}
                      min={minDate}
                      className="bg-white-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      required
                    />
                    <button 
                     type="button"
                     onClick={() => addSubTask(taskIndex)}
                     className="text-white bg-blue-700 hover:bg-blue-800 px-3 py-2.5 rounded-lg w-full"
                    >Add Subtask</button>

                    {task.subtasks.map((subtask, subtaskindex) => (
                      <div key={subtaskindex} className="flex gap-2 flex-wrap">
                        <input 
                          onChange={(e) => handleSubTaskChange(e, taskIndex, subtaskindex)}
                          value={subtask.subtask}
                          placeholder="Enter Subtask"
                          className="bg-white-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                        />
                        <button
                          type="button"
                          onClick={() => removeSubTask(taskIndex, subtaskindex)}
                          className="text-white bg-red-500 px-5 py-2.5 w-full mt-2 rounded-lg"
                        >
                          Remove Subtask
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => removeTask(taskIndex)}
                      className="text-white bg-red-500 px-5 py-2.5 w-full mt-2 rounded-lg"
                    >
                      Remove Task
                    </button>
                </div>
              ))}
              <button className="text-white bg-blue-700 hover:bg-blue-800 px-5 py-2 rounded-lg w-[200px]" type="submit">
                {selectedProject ? "Update Project" : "Submit Project"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
