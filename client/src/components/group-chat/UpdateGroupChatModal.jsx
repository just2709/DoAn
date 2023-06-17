import { useDisclosure } from "@chakra-ui/hooks";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Divider,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { IoEllipsisVertical } from "react-icons/io5";
import { toast } from "react-toastify";
import { ChatState } from "../../context/ChatProvider";
import Loader from "../Loader";
import UserBadgeItem from "../UserBadgeItem";
import UserListItem from "../UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchAllMessages }) => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedChat, user, setSelectedChat } = ChatState();
  const [groupChatName, setGroupChatName] = useState(selectedChat.chatName);
  console.log(selectedChat);
  const handleRemoveUser = async (userToBeRemoved) => {
    if (user.user._id !== selectedChat.groupAdmin._id) {
      toast.info("Bạn không có quyền thực hiện");
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chats/groupremove`,
        {
          userId: userToBeRemoved._id,
          chatId: selectedChat._id,
        },
        config
      );

      userToBeRemoved._id === user._d ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchAllMessages();
      setLoading(false);
    } catch (err) {
      toast.error(err);
      setLoading(false);
    }
  };
  const handleRename = async () => {
    if (!groupChatName) {
      return;
    }
    setRenameLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put("/api/chats/grouprename", { chatName: groupChatName, chatId: selectedChat._id }, config);
      toast.info(`Tên nhóm đã được thay đổi thành công!`);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (err) {
      toast.error(err);
      setRenameLoading(false);
      return;
    }
    setGroupChatName("");
  };
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      toast.info("Hãy tìm kiếm để thêm thành viên mới");
    }
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/users?search=${search}`, config);
      setSearchResult(data.users);
      setLoading(false);
    } catch (err) {
      toast.error(err);
      setLoading(false);
    }
  };
  const handleAddMember = async (userToAdd) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      toast.info("Người dùng trên đã có trong nhóm");
      return;
    }
    if (user.user._id !== selectedChat.groupAdmin._id) {
      toast.info("Bạn không có quyền thực hiện");
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chats/groupadd`,
        {
          userId: userToAdd._id,
          chatId: selectedChat._id,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (err) {
      toast.error(err);
      setLoading(false);
    }
  };
  const handleRemove = async (userToBeRemoved) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.put(
        `/api/chats/groupremove`,
        {
          userId: userToBeRemoved.user._id,
          chatId: selectedChat._id,
        },
        config
      );
      setSelectedChat();
      setFetchAgain(!fetchAgain);
      fetchAllMessages();
      setLoading(false);
    } catch (err) {
      toast.error(err);
      setLoading(false);
    }
  };
  console.log(selectedChat.users[0]);
  return (
    <>
      <Button onClick={onOpen} d={{ base: "flex" }}>
        <IoEllipsisVertical fontSize='1.4rem' />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize='1.75rem' d='flex' justifyContent='center' textTransform='capitalize'>
            <FormControl d='flex' mt='10' width='100%'>
              <Input placeholder='Chat Name' value={groupChatName} mb='1' onChange={(e) => setGroupChatName(e.target.value)} />
              <Button variant='solid' bg='#003de8' color='#fff' colorScheme='blackAlpha' ml='1' isLoading={renameLoading} onClick={handleRename}>
                Lưu
              </Button>
            </FormControl>
          </ModalHeader>

          <ModalCloseButton />
          <Divider />
          <ModalBody>
            <Box>
              <Text>Danh sách thành viên</Text>
              {selectedChat.users.map((user) => (
                <UserBadgeItem isAdmin={selectedChat.groupAdmin.email === user.email} key={user._id} user={user} handleFunction={() => handleRemoveUser(user)} />
              ))}
            </Box>

            <FormControl d='flex' width='100%' mt='3'>
              <Input placeholder='Thêm thành viên' mb='3' onChange={(e) => handleSearch(e.target.value)} />
            </FormControl>
            {loading ? (
              <Box minH='100px' width='100%' d='flex' justifyContent='center' alignItems='center'>
                <Loader />
              </Box>
            ) : (
              <Box minH='100px' maxH='100px' overflowY='scroll'>
                {searchResult?.map((user) => (
                  <UserListItem width='100%' key={user._id} user={user} handleFunction={() => handleAddMember(user)} />
                ))}
              </Box>
            )}
            <Box></Box>
          </ModalBody>

          <ModalFooter>
            <Accordion width='100%'>
              <AccordionItem>
                <AccordionButton d='flex' justifyContent='center' width='100%'>
                  Thêm
                </AccordionButton>
                <AccordionPanel>
                  <Button mt='2' colorScheme='red' width='100%' onClick={() => handleRemove(user)}>
                    Rời nhóm
                  </Button>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
