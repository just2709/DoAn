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
  name: yup.string().required("Hãy nhập tên của bạn"),
  email: yup.string().required("Hãy nhập Email").email("Email không hợp lệ"),
  password: yup
    .string()
    .required("Hãy nhập mật khẩu")
    .min(8, "Mật khẩu phải bao gồm ít nhất 8 ký tự")
    .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/, "Mật khẩu phải chứa ít nhất một chữ cái in hoa, một chữ cái in thường, một số và một ký tự đặc biệt"),
  cf_password: yup
    .string()
    .required("Hãy nhập lại mật khẩu")
    .oneOf([yup.ref("password")], "Mật khẩu không khớp"),
  pic: yup.mixed().test("fileType", "Bạn chỉ được tải lên ảnh có định dạng png | jpg", (value) => {
    return value && ["image/png", "image/jpeg"].includes(value[0].type);
  }),
});

const Register = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      cf_password: "",
      pic: "",
    },
    resolver: yupResolver(schema),
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    setIsLoading(true);
    if (data.pic[0]) {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append("file", data.pic[0]);
      formData.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET);
      formData.append("cloud_name", process.env.REACT_APP_CLOUD_NAME);
      await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`, {
        method: "post",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          setValue("pic", data.url.toString());
          setUploadingImage(false);
        })
        .catch((err) => {
          toast.error(err);
          setUploadingImage(false);
        });
    }
    if (!uploadingImage) {
      const { name, email, password, pic } = data;
      try {
        const response = await userApi.signup({ name, email, password, pic });
        localStorage.setItem("chatAppUser", JSON.stringify(response));
        toast.info("Đăng ký thành công");
        setIsLoading(false);
        navigate("/chats");
      } catch (err) {
        toast.error(err.message);
        setIsLoading(false);
        return;
      }
    }
  };
  if (isLoading) {
    return <Loader />;
  }
  return (
    <VStack spacing='30px'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl sx={{ mb: 5 }} id='name' isInvalid={errors.name}>
          <FormLabel mb='0px'>Họ tên</FormLabel>
          <Input {...register("name")} size='md' placeholder='VD: Nguyễn Văn A' />
          {errors.name && <FormErrorMessage>{errors.name.message}</FormErrorMessage>}
        </FormControl>
        <FormControl sx={{ mb: 5 }} id='email' isInvalid={errors.email}>
          <FormLabel mb='0px'>Email</FormLabel>
          <Input {...register("email")} size='md' placeholder='VD: nguyenvana@gmail.com' />
          {errors.email && <FormErrorMessage>{errors.email.message}</FormErrorMessage>}
        </FormControl>
        <FormControl sx={{ mb: 5 }} id='password' isInvalid={errors.password}>
          <FormLabel mb='0px'>Mật khẩu</FormLabel>
          <InputGroup size='md'>
            <Input pr='3rem' type={show ? "text" : "password"} placeholder='Nhập mật khẩu' {...register("password")} />
            <InputRightElement width='3rem'>
              <Button h='1.75rem' size='xs' onClick={handleClick}>
                {show ? <IoEyeOutline /> : <IoEyeOffOutline />}
              </Button>
            </InputRightElement>
          </InputGroup>
          {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
        </FormControl>
        <FormControl sx={{ mb: 5 }} id='cf_password' isInvalid={errors.cf_password}>
          <FormLabel mb='0px'>Xác nhận mật khẩu</FormLabel>
          <InputGroup size='md'>
            <Input pr='3rem' type={show ? "text" : "password"} placeholder='Nhập lại mật khẩu' {...register("cf_password")} />
            <InputRightElement width='3rem'>
              <Button h='1.75rem' size='xs' onClick={handleClick}>
                {show ? <IoEyeOutline /> : <IoEyeOffOutline />}
              </Button>
            </InputRightElement>
          </InputGroup>
          {errors.cf_password && <FormErrorMessage>{errors.cf_password.message}</FormErrorMessage>}
        </FormControl>
        <FormControl sx={{ mb: 5 }} id='pic' isInvalid={errors.pic}>
          <FormLabel mb='0px'>Tải ảnh đại diện</FormLabel>
          <Input type='file' accept='image/*' {...register("pic")} size='xl' />
          {errors.pic && <FormErrorMessage>{errors.pic.message}</FormErrorMessage>}
        </FormControl>
        <Button type='submit' bg={"#003de8"} colorScheme={"003de8"} color='#fff' width='100%' style={{ marginTop: "40px" }} isLoading={uploadingImage}>
          Đăng ký
        </Button>
      </form>
    </VStack>
  );
};

export default Register;
