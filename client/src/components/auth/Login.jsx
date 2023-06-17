import { Button, FormControl, FormErrorMessage, FormLabel, Input, InputGroup, InputRightElement, VStack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import userApi from "../../api/userApi";
import Loader from "../Loader";

const schema = yup.object({
  email: yup.string().required("Hãy nhập Email").email("Email không hợp lệ"),
  password: yup.string().required("Hãy nhập mật khẩu"),
});

const Login = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const initialState = {
    email: "",
    password: "",
  };
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data) => {
    setLoading(true);
    const { email, password } = data;
    try {
      const response = await userApi.login({ email, password });
      localStorage.setItem("chatAppUser", JSON.stringify(response));
      setLoading(false);
      toast.success("Đăng nhập thành công");
      navigate("/chats");
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };
  if (loading) {
    return <Loader />;
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack>
        <FormControl id='loginEmail' isInvalid={errors.email}>
          <FormLabel mb='0px'>Email</FormLabel>
          <Input {...register("email")} size='md' placeholder='VD: nguyenvana@gmail.com' />
          {errors.email && <FormErrorMessage>{errors.email.message}</FormErrorMessage>}
        </FormControl>
        <FormControl id='loginPassword' isInvalid={errors.password}>
          <FormLabel mb='0px'>Mật khẩu</FormLabel>
          <InputGroup size='md'>
            <Input {...register("password")} pr='3rem' type={show ? "text" : "password"} placeholder='Nhập mật khẩu' />
            <InputRightElement width='3rem'>
              <Button h='1.75rem' size='xs' onClick={handleClick}>
                {show ? <IoEyeOutline /> : <IoEyeOffOutline />}
              </Button>
            </InputRightElement>
          </InputGroup>
          {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
        </FormControl>
        <Button type='submit' bg={"#003de8"} colorScheme={"#003de8"} color='#fff' width='100%' style={{ marginTop: "40px" }}>
          Đăng nhập
        </Button>
      </VStack>
    </form>
  );
};

export default Login;
