import { Box, Image, Button } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

const FourOFour = () => {
  const navigate = useNavigate();
  const handleBackToHome = () => {
    navigate("/");
  };
  return (
    <Box w='100vw' h='100vh'>
      <Image
        mx='auto'
        my='auto'
        h='100vh'
        objectFit='contain'
        src='https://static.vecteezy.com/system/resources/previews/007/100/525/non_2x/holding-signboard-404-not-found-cute-pear-cartoon-vector.jpg'
        alt='not found'
      />
      <Button onClick={handleBackToHome}>Quay lại trang chủ</Button>
    </Box>
  );
};

export default FourOFour;
