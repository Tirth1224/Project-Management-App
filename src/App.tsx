
import { useState } from 'react';
import './App.css';
import { Project, UserProvider } from './context/UserContext';
import { Form } from './components/Form';
import { Card } from './components/Card';
import { Toaster } from 'react-hot-toast';

function App() {
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <UserProvider>
      <h1 className='text-center font-Montserrat text-blue-600 text-3xl mt-4 mb-5 font-semibold'>Project Manager</h1>
      <Form selectedProject = {selectedProject} setSelectedProject= {setSelectedProject} isOpen={isOpen} setIsOpen={setIsOpen}/>
      <Card setSelectedProject={setSelectedProject} setIsOpen={setIsOpen}/>
      <Toaster position='top-right' reverseOrder={false} />
    </UserProvider>
  )
}

export default App
