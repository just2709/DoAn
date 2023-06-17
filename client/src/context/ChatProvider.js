import { createContext, useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);
  const location = useLocation();
  console.log(location);
  const navigate = useNavigate();
  useEffect(() => {
    const pagesNotAuth = ["forgotPassword", "resetPassword"];
    if (!pagesNotAuth.some((page) => location.pathname.includes(page))) {
      const userInfo = JSON.parse(localStorage.getItem("chatAppUser"));
      setUser(userInfo);
      if (!userInfo) {
        navigate("/");
      }
    }
  }, [navigate]);
  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
      }}>
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
