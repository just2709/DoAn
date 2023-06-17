import { AbsoluteCenter, Box, Button, FormControl, FormErrorMessage, FormLabel, IconButton, Input, Text } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import userApi from "../api/userApi";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useState } from "react";
const schema = yup.object({
  password: yup
    .string()
    .required("Hãy nhập mật khẩu")
    .min(8, "Mật khẩu phải bao gồm ít nhất 8 ký tự")
    .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/, "Mật khẩu phải chứa ít nhất một chữ cái in hoa, một chữ cái in thường, một số và một ký tự đặc biệt"),
  cf_password: yup
    .string()
    .required("Hãy nhập lại mật khẩu")
    .oneOf([yup.ref("password")], "Mật khẩu không khớp"),
});

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await userApi.resetPassword({ password: data.password }, token);
      localStorage.setItem("chatAppUser", JSON.stringify(response));
      navigate("/chats");
    } catch (err) {
      setMessage(err.message);
      return;
    }
  };
  return (
    <Box position='relative' width={"100vw"} h='100vh' bgGradient={"linear-gradient(to right, #11998e, #38ef7d);"}>
      <AbsoluteCenter p='4' axis='both'>
        {isSubmitting ? (
          <Loader />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box maxWidth={"400"} width={"full"} mb={10} color='white'>
              {message && <Text sx={{ color: "yellow" }}>{message}</Text>}
              <FormControl isInvalid={errors.password} mb={5}>
                <FormLabel mb='0px'>Mật khẩu</FormLabel>
                <Input {...register("password")} minW={"300px"} type='password' />
                {errors.password && <FormErrorMessage color={"white"}>{errors.password.message}</FormErrorMessage>}
              </FormControl>
              <FormControl isInvalid={errors.cf_password} mb={5}>
                <FormLabel mb='0px'>Xác nhận mật khẩu</FormLabel>
                <Input {...register("cf_password")} minW={"300px"} type='password' />
                {errors.cf_password && <FormErrorMessage color={"white"}>{errors.cf_password.message}</FormErrorMessage>}
              </FormControl>
              <Button type='submit' bgColor={"blue"} color={"white"} width={"full"} p={5}>
                Lưu
              </Button>
            </Box>
            <Link to='/'>
              <Button>
                <IconButton icon={<IoReturnUpBackOutline />} />
                Quay về trang chủ
              </Button>
            </Link>
          </form>
        )}
      </AbsoluteCenter>
    </Box>
  );
};

export default ResetPassword;
