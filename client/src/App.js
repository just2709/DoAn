import { Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import NotfoundPage from "./pages/404";

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/chats' element={<ChatPage />} />
        <Route path='*' element={<NotfoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
