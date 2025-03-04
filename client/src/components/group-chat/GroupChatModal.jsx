import React, { useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Divider, FormControl, Input, Box } from "@chakra-ui/react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDisclosure } from "@chakra-ui/hooks";
import { ChatState } from "../../context/ChatProvider";
import { IoIosArrowForward } from "react-icons/io";
import UserListItem from "../UserListItem";
import Loader from "../Loader";
import UserBadgeItem from "../UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUser, setSelectedUser] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      // ? if query string is empty
      toast.info("Hãy tìm để thêm thành viên mới");
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
  const handleSelectUser = (user) => {
    console.log(user);
    if (selectedUser.includes(user)) {
      toast.info("Người dùng này đã có trong nhóm");
      return;
    }
    setSelectedUser([...selectedUser, user]);
  };
  const handleRemoveUser = (user) => {
    setSelectedUser(selectedUser.filter((sel) => sel._id !== user._id));
  };
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUser) {
      toast.info("Hãy nhập hết các trường");
      return;
    }
    if (selectedUser.length < 2) {
      toast.info("Nhóm phải có ít nhất 3 thành viên");
      return;
    }
    // create chat
    setSubmitLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const usersString = JSON.stringify(selectedUser.map((u) => u._id));
      const { data } = await axios.post("/api/chats/group", { name: groupChatName, users: usersString }, config);
      setChats([data, ...chats]);
      onClose();
      setSubmitLoading(false);
      toast.success(`${groupChatName} được tạo thành công`);
      setSelectedUser([]);
    } catch (err) {
      toast.error(err);
      setSubmitLoading(false);
      return;
    }
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize='1.5rem' d='flex' justifyContent='center' textTransform='capitalize'>
            Tạo nhóm
          </ModalHeader>
          <Divider />
          <ModalCloseButton />
          <ModalBody d='flex' flexDir='column' alignItems='center'>
            <FormControl pb='5' pt='5'>
              <Input placeholder='Tên nhóm' onChange={(e) => setGroupChatName(e.target.value)} />
            </FormControl>
            <FormControl>
              <Input placeholder='Nhập tên người dùng để tìm kiếm' onChange={(e) => handleSearch(e.target.value)} />
            </FormControl>
            <Box w='100%' d='flex' flexWrap='wrap' mb='3'>
              {selectedUser.map((user) => (
                <UserBadgeItem key={user._id} user={user} handleFunction={() => handleRemoveUser(user)} />
              ))}
            </Box>
            <Divider />
            <Box minHeight='350px' maxHeight='150px' w='100%' mt='3' overflowY='scroll'>
              {loading ? <Loader /> : searchResult?.slice(0, 4).map((user) => <UserListItem width='100%' key={user._id} user={user} handleFunction={() => handleSelectUser(user)} />)}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button bg='#003de8' color='#fff' colorScheme='003de8' mr={3} onClick={handleSubmit} rightIcon={<IoIosArrowForward />} isLoading={submitLoading}>
              Tạo mới
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
