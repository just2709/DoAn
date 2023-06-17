import React, { useEffect } from "react";
import { Box, Container, Grid, GridItem, Text, Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";

const Homepage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("chatAppUser"));
    if (user) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <Grid className='home_container' templateRows='1fr' templateColumns='repeat(6, 1fr)' h='100vh' w='100vw'>
      <GridItem colSpan={4} className='home_img'></GridItem>
      <GridItem colSpan={2} bg='#fff' minW={"500px"}>
        <Container maxW='xl' centerContent>
          <Box d='flex' justifyContent='center' alignContent='center' p='3' bg='#fff' mt='2em'>
            <Text fontSize='4xl'>Chat app</Text>
          </Box>
          <Box w='100%' p='4' mt='20px'>
            <Tabs isFitted variant='enclosed'>
              <TabList mb='1em'>
                <Tab>Đăng nhập</Tab>
                <Tab>Đăng ký</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Login />
                </TabPanel>
                <TabPanel>
                  <Register />
                </TabPanel>
              </TabPanels>
            </Tabs>
            <Box p='4'>
              <Link to='/forgotPassword'>Quên mật khẩu?</Link>
            </Box>
          </Box>
        </Container>
      </GridItem>
      <ToastContainer theme='colored' />
    </Grid>
  );
};

export default Homepage;
