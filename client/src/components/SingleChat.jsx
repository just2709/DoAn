import { Avatar, Box, Button, Divider, FormControl, Heading, IconButton, Input, Text, Tooltip } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { toast } from "react-toastify";
import { getSender } from "../config/ChatLogics";
import { ChatState } from "../context/ChatProvider";
import Loader from "./Loader";
import ProfileModel from "./ProfileModel";
import ChatMessage from "./ChatMessage";
import UpdateGroupChatModal from "./group-chat/UpdateGroupChatModal";
import { IoHappyOutline, IoAddCircleOutline } from "react-icons/io5";
import io from "socket.io-client";
const ENDPOINT = "http://localhost:3000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState();
  const [isTyping, setIsTyping] = useState();

  const fetchAllMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (err) {
      toast.error(err);
      setLoading(false);
      return;
    }
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            chatId: selectedChat._id,
            content: newMessage,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (err) {
        toast.error(err);
        return;
      }
    }
  };

  const saveNotification = async () => {
    if (!notification.length) return;
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.post(
        "/api/notification",
        {
          notification: notification[0].chatId.latestMessage,
        },
        config
      );
    } catch (err) {
      toast.error(err);
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user.user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchAllMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  console.log(notification);
  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chatId._id) {
        if (!notification.includes()) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });
  useEffect(() => {
    saveNotification();
  }, [notification]);
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTimeout(() => {
        setTyping(true);
        socket.emit("typing", selectedChat._id);
      }, 1000);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Box py='3.0' px='4' w='100%' d='flex' justifyContent={{ base: "space-between" }} alignItems='center' bg='#fff' borderRadius='lg'>
            <Box d={{ base: "flex", md: "none" }} mr='5' onClick={() => setSelectedChat("")}>
              <IoIosArrowBack />
            </Box>
            {!selectedChat.isGroupChat ? (
              <Text width='100%' d='flex' py='3' alignItems='center' justifyContent={{ base: "space-between" }} fontSize={{ base: "1.5rem", md: "1.75rem" }}>
                <Box display='flex' flexDir='column' alignItems='flex-start'>
                  {getSender(user.user, selectedChat.users).name}
                </Box>

                <ProfileModel user={getSender(user.user, selectedChat.users)} />
              </Text>
            ) : (
              <>
                <Text width='100%' d='flex' py='3' alignItems='center' justifyContent={{ base: "space-between" }} fontSize={{ base: "1.5rem", md: "1.75rem" }}>
                  <Box display='flex' flexDir='column' alignItems='flex-start'>
                    {selectedChat.chatName}
                  </Box>
                </Text>
                <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchAllMessages={fetchAllMessages} />
              </>
            )}
          </Box>
          <Box d='flex' flexDir='column' p='3' w='100%' h={{ base: "73vh", md: "100%" }} overflowY='hidden'>
            {loading ? (
              <Loader />
            ) : (
              <div className='message'>
                {<ChatMessage messages={messages} />}
                {isTyping && user.user !== getSender(user.user, selectedChat.users) && (
                  <Box d='flex' mt='3'>
                    <Tooltip placement='bottom-start' hasArrow>
                      <Avatar mr='1' size='xs' cursor='pointer' name={getSender(user.user, selectedChat.users).name} src={getSender(user.user, selectedChat.users).image} />
                    </Tooltip>
                    <Text color='#fff'>Đang nhập...</Text>
                  </Box>
                )}
              </div>
            )}
          </Box>
          <FormControl w='100%' paddingX='0.5rem' alignItems='center' d='flex' onKeyDown={sendMessage} isRequired mt={{ base: "1", md: "3" }} borderRadius='8px'>
            <IconButton aria-label='Search database' icon={<IoHappyOutline fontSize='1.5rem' color='#fff' />} backgroundColor='rgba(76, 175, 80, 0.4)' borderRadius='full' mx='0.2rem' />
            <IconButton aria-label='Search database' icon={<IoAddCircleOutline fontSize='1.5rem' color='#fff' />} backgroundColor='rgba(76, 175, 80, 0.4)' borderRadius='full' mx='0.2rem' />
            <Input variant='outline' bg='#003de8' h='4rem' color='#fff' placeholder='Nhập một tin nhắn...' onChange={typingHandler} value={newMessage} borderRadius='full' mx='0.2rem' />
          </FormControl>
        </>
      ) : (
        <Box d='flex' alignItems='center' justifyContent='center' h='100%' flexDir='column' color='rgba(255, 255, 255, 0.685)'>
          <Heading size='4xl' mb='4'>
            Chat app
          </Heading>
          <Divider />
          <Text fontSize='3xl' px='3'>
            Lựa chọn một cuộc trò truyện để bắt đầu
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
