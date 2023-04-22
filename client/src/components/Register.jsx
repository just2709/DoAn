import { FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, Button } from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { valid } from "../Util/valid";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "./Loader";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

const Register = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const initialState = {
    name: "",
    email: "",
    password: "",
    cf_password: "",
    pic: "",
  };
  const [userData, setUserData] = useState(initialState);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { name, email, password, cf_password, pic } = userData;

  const postDetails = (pics) => {
    setUploadingImage(true);
    if (pics === undefined) {
      toast.warn("Please add a Profile Picture");
      return;
    }
    if (pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "ChatApp");
      data.append("cloud_name", "dxzpcalac");
      fetch("https://api.cloudinary.com/v1_1/dxzpcalac/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setUserData({ ...userData, ["pic"]: data.url.toString() });
          setUploadingImage(false);
        })
        .catch((err) => {
          toast.error(err);
          setUploadingImage(false);
        });
    } else {
      toast.error("Chỉ ảnh định dạng .png được tải lên");
      setUploadingImage(false);
      return;
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  const handleSubmit = async () => {
    setIsLoading(true);
    const message = valid(name, email, password, cf_password);
    if (message) return toast.warn(message);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post("/api/users", { name, email, password, pic }, config);
      toast.info("Đăng ký thành công");
      localStorage.setItem("chatAppUser", JSON.stringify(data));
      setIsLoading(false);
      navigate("/chats");
    } catch (error) {
      toast.error(error);
      setIsLoading(false);
      return;
    }
  };
  if (isLoading) {
    return <Loader />;
  }
  return (
    <VStack spacing='30px'>
      <FormControl id='name' isRequired>
        <FormLabel mb='0px'>Họ tên</FormLabel>
        <Input onChange={handleChange} name='name' value={name} size='md' placeholder='VD: Nguyễn Văn A' />
      </FormControl>
      <FormControl id='email' isRequired>
        <FormLabel mb='0px'>Email</FormLabel>
        <Input onChange={handleChange} name='email' value={email} size='md' placeholder='VD: nguyenvana@gmail.com' />
      </FormControl>
      <FormControl id='password' isRequired>
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
      <FormControl id='cf_password' isRequired>
        <FormLabel mb='0px'>Xác nhận mật khẩu</FormLabel>
        <InputGroup size='md'>
          <Input pr='3rem' type={show ? "text" : "password"} placeholder='Nhập lại mật khẩu' onChange={handleChange} name='cf_password' value={cf_password} />
          <InputRightElement width='3rem'>
            <Button h='1.75rem' size='xs' onClick={handleClick}>
              {show ? <IoEyeOutline /> : <IoEyeOffOutline />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id='pic'>
        <FormLabel mb='0px'>Tải ảnh đại diện</FormLabel>
        <Input type='file' onChange={(e) => postDetails(e.target.files[0])} accept='image/*' name='pic' size='xl' />
      </FormControl>
      <Button bg={"#003de8"} colorScheme={"003de8"} color='#fff' width='100%' style={{ marginTop: "40px" }} onClick={handleSubmit} isLoading={uploadingImage}>
        Đăng ký
      </Button>
    </VStack>
  );
};

export default Register;
