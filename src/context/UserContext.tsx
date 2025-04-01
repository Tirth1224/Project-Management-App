import React, { createContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

interface Subtask {
  subtask: string;
}

interface Task {
  taskTitle: string;
  taskDescription: string;
  dueDate: string;
  projectStatus: "Pending" | "In-Progress" | "Completed"
  subtasks: Subtask[];
}

export interface Project {
  id: string;
  projectTitle: string;
  projectDescription: string;
  tasks: Task[];
} 

interface UserContextType {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updatedProject: Partial<Project>) => void;
  deleteProject: (id: string) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {

  const [projects, setProjects] = useState<Project[]>(() => {
    const savedProjects = localStorage.getItem("Project");
    return savedProjects ? JSON.parse(savedProjects) : [];
  })

  useEffect (() => {
    localStorage.setItem("Project", JSON.stringify(projects));
  }, [projects]);

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject : Project = { id:uuidv4(), ...project}
    setProjects((prevProjects) => [...prevProjects, newProject])
  }

  const updateProject = (id:string, updatedProject: Partial<Project>) => {
    setProjects((prevProjects) => prevProjects.map((project) => project.id === id ? {...project, ...updatedProject} : project))
  }

  const deleteProject = (id:string) => {
    setProjects((prevProjects) => prevProjects.filter((project) => project.id !== id));
    toast.success('Project Deleted Successfully', {duration:2000})
  }

  return (
    <UserContext.Provider value={{projects, setProjects, addProject, updateProject, deleteProject}}>
      {children}
    </UserContext.Provider>
  )
}

export { UserContext };