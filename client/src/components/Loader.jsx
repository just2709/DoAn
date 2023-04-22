import React from "react";
import { Spinner, Box } from "@chakra-ui/react";

const Loader = () => {
  return (
    <Box d='flex' justifyContent='center' alignItems='center' width='100%' height='100%'>
      <Spinner h={16} w={16} color='#fff' emptyColor='#003de8' speed='0.4s' />
    </Box>
  );
};

export default Loader;
