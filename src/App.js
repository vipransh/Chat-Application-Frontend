import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'; 
import Login from './components/Login';
import ChatCenter from './components/ChatCenter';
import AppContext from './Context/AppContext';
import Signup from './components/Signup';
function App() {
  return (
    <div className="App">
    <BrowserRouter>
    <AppContext>
      <Routes>
      <Route path='/' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/chatCenter' element={<ChatCenter/>}/>
      </Routes>
      </AppContext>
    </BrowserRouter>
    </div>
  );
}

export default App;
