import { FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, Button } from "@chakra-ui/react";
import React, { useState } from "react";
import { validateEmail } from "../Util/valid";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import Loader from "./Loader";

const Login = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const initialState = {
    email: "",
    password: "",
  };
  const [userData, setUserData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const { email, password } = userData;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  const handleSubmit = async () => {
    setLoading(true);

    if (!email || !password) {
      toast.warn("Please enter all the required fields");
    }
    if (!validateEmail(email)) {
      toast.warn("Invalid Email");
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post("/api/users/login", { email, password }, config);
      toast.success("User Logged In successfully");
      localStorage.setItem("chatAppUser", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (err) {
      toast.error("Login Failed: Either the email or password is incorrect");
      setLoading(false);
      return;
    }
  };
  if (loading) {
    return <Loader />;
  }
  return (
    <VStack spacing='30px'>
      <FormControl id='loginEmail' isRequired>
        <FormLabel mb='0px'>Email</FormLabel>
        <Input onChange={handleChange} name='email' value={email} size='md' placeholder='VD: nguyenvana@gmail.com' />
      </FormControl>
      <FormControl id='loginPassword' isRequired>
        <FormLabel mb='0px'>Mật khẩu</FormLabel>
        <InputGroup size='md'>
          <Input pr='3rem' type={show ? "text" : "password"} placeholder='Nhập mật khẩu' onChange={handleChange} name='password' value={password} />
          <InputRightElement width='3rem'>
            <Button h='1.75rem' size='xs' onClick={handleClick}>
              {show ? <IoEyeOutline /> : <IoEyeOffOutline />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button bg={"#003de8"} colorScheme={"#003de8"} color='#fff' width='100%' style={{ marginTop: "40px" }} onClick={handleSubmit}>
        Đăng nhập
      </Button>
    </VStack>
  );
};

export default Login;
