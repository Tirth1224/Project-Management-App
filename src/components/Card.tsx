import { SetStateAction, useContext, useState } from "react"
import { Project, UserContext } from "../context/UserContext"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"
import { DropResult } from "react-beautiful-dnd"
import { MdDelete } from "react-icons/md"
import { TbEdit } from "react-icons/tb"
import { Line } from "rc-progress"

interface CardProps {
  setSelectedProject : React.Dispatch<SetStateAction<Project | null>>
  setIsOpen: React.Dispatch<SetStateAction<boolean>>
}

export const Card: React.FC<CardProps> = ({ setSelectedProject, setIsOpen }) => {

  const { projects, setProjects, deleteProject } = useContext(UserContext)!;
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)

  const handleDragEnd = (result: DropResult) => {
      if(!result.destination) return;

      const recordedProjects = [...projects];
      const sourceIndex = result.source.index;
      const destinationIndex = result.destination.index;

      [recordedProjects[sourceIndex], recordedProjects[destinationIndex]] = [recordedProjects[destinationIndex], recordedProjects[sourceIndex]];

      setProjects(recordedProjects);
  }

  const handleDeleteConfirmation = (projectId: string) => {
    setProjectToDelete(projectId);
    setDeleteOpen(true);
  }

  const confirmDelete = () => {
    if(projectToDelete){
      deleteProject(projectToDelete);
      setDeleteOpen(false);
      setProjectToDelete(null);
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="projects">
        {(provided) => (
          <div 
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex flex-col gap-5 p-4 px-20 font-Montserrat lg:px-100 md:px-50"
          >
            {projects.map((project, index) => (
              <Draggable key={project.id} draggableId={project.id} index={index}>
                {(provided, snapshot) => (
                  <div 
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`bg-white shadow-md rounded-lg p-5 w-full border ${snapshot.isDragging ? "bg-gray-100" : ""}`}
                  >
                    <div className="flex flex-row justify-between gap-5 flex-wrap">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          Project Title:- {project.projectTitle}
                        </h2>
                        <p className="text-gray-700 mb-2">
                          Project Description:- {project.projectDescription}
                        </p>
                        <h5 className="text-xl font-bold text-gray-900">
                          Project Priority:- {index+1}
                        </h5>
                      </div>
                      <div className="flex flex-row gap-2 flex-wrap">
                        <div>
                          <button className="text-white bg-[#FF0800] hover:bg-red-600 px-2 py-2 rounded-lg" onClick={() => handleDeleteConfirmation(project.id)}>
                            <MdDelete size={24}/>
                          </button>
                          {deleteOpen && (
                            <div 
                              id="delete-model"
                              className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[1px] bg-black/24"
                              role="dialog"
                              aria-labelledby="delete-model-label"
                            >
                              <div className="bg-white shadow-lg rounded-xl w-96 p-6">
                                <div className="text-center">
                                  <span className="inline-flex justify-center items-center size-16 rounded-full bg-yellow-100 text-yellow-500 border-4 border-yellow-50">
                                  <svg
                                      className="size-6"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="red"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                                    </svg>
                                  </span>
                                  <h3 id="delete-modal-label" className="mt-4 text-2xl font-bold text-gray-800">Delete Project</h3>
                                  <p className="text-gray-500">Are you sure you want to delete this project? This action cannot be undone.</p>

                                  <div className="mt-6 flex justify-center gap-x-4">
                                    <button type="button" className="py-2 px-3 text-sm font-medium rounded-lg border border-gray-200 bg-[#FF0800] text-white hover:bg-red-600" onClick={confirmDelete}>
                                      Delete
                                    </button>
                                    <button type="button" className="py-2 px-3 text-sm font-medium rounded-lg bg-white-600 text-black hover:bg-gray-100 border border-gray-300" onClick={() => setDeleteOpen(false)}>Cancel</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div>
                          <button onClick={() => {setSelectedProject(project); setIsOpen(true)}} className="text-white bg-yellow-400 hover:bg-yellow-500 px-2 py-2 rounded-lg">
                            <TbEdit size={24}/>
                          </button>
                        </div>
                      </div>
                    </div>
                    <hr className="mt-4 mb-2 text-gray-400"/>
                    <ul className="list-disc list-inside mb-4 flex flex-wrap gap-10">
                      {project.tasks.map((task, taskIndex) => (
                        <div key={taskIndex} className="mt-2">
                          <h3 className="text-md font-semibold text-gray-800">Tasks:- {taskIndex+1}</h3>
                          <p className="text-gray-900 font-medium">Task Title:- {task.taskTitle}</p>
                          <p className="text-gray-900 text-sm">Task Description:- {task.taskDescription}</p>
                          <p className="text-gray-900 text-sm">Due Date:- {task.dueDate}</p>
                          <p className="text-gray-800 font-semibold mt-2 mb-1">Status:- {task.projectStatus}</p>
                          <Line key={index} strokeWidth={3} trailWidth={3} strokeColor={task.projectStatus === "Completed" ? "#03C03C" : task.projectStatus === "In-Progress" ? "#FFDA03" : "#F44336"} percent={task.projectStatus === "Completed" ? 100 : task.projectStatus === "In-Progress" ? 50 : 0} /> 
                          {task.subtasks.length > 0 && (
                            <ul className="ml-4 list-disc text-sm text-gray-900">
                              <hr className="mt-4 mb-2 text-gray-400"/>
                              {task.subtasks.map((subtask, subIndex) => (
                                <li key={subIndex} className="mt-2">
                                  SubTask {subIndex+1}:- {subtask.subtask}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </ul>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
