import { BrowserRouter } from 'react-router-dom'
import './App.css'
import Header from './Components/Header'
import { api } from './Api';
import type { Tool } from './Types/Tool';
import ToolCard from './Components/ToolCard';


const {data: tools} = await api.get<Tool[]>('/tool');
function App() {

  return (
    <BrowserRouter>
      <Header />
      {tools?.map(tool => (
        <ToolCard key={tool.id} {...tool} /> 
      ))}
    </BrowserRouter>
  )
}

export default App
