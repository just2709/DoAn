import { AbsoluteCenter, Box, Button, FormControl, FormErrorMessage, IconButton, Input, Text } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import * as yup from "yup";
import userApi from "../api/userApi";
import Loader from "../components/Loader";
const schema = yup.object({
  email: yup.string().required("Hãy nhập Email").email("Email không hợp lệ"),
});

const ForgotPassword = () => {
  const [message, setMessage] = useState(null);
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
      const res = await userApi.forgotPassword({ email: data.email });
      setMessage(res.message);
    } catch (err) {
      setMessage(err);
    }
  };
  return (
    <Box position='relative' width={"100vw"} h='100vh' bgGradient={"linear-gradient(to right, #11998e, #38ef7d);"}>
      <AbsoluteCenter p='4' axis='both'>
        {isSubmitting ? (
          <Loader />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box d='flex' width={"full"} mb={10} color='white'>
              <FormControl isInvalid={errors.email}>
                <Input {...register("email")} minW={"300px"} />
                {errors.email && <FormErrorMessage color={"yellow"}>{errors.email.message}</FormErrorMessage>}
                {message && <Text sx={{ color: "yellow" }}>{message}</Text>}
              </FormControl>
              <Button type='submit' bgColor={"blue"} color={"white"} width={"full"} p={5}>
                Gửi mail xác thực
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

export default ForgotPassword;
