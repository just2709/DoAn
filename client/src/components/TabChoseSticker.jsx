import { Center, Grid, GridItem, Image, TabPanel } from "@chakra-ui/react";
import React from "react";

const TabChoseSticker = ({ listItem, sendMessage }) => {
  return (
    <Grid templateColumns='repeat(3, 1fr)' gap={2} border='1px' borderColor='gray.200' mt={2} p={2} borderRadius={10}>
      {listItem.map((item) => (
        <Center border='1px' borderColor='gray.200'>
          <GridItem w='100%'>
            <Image cursor={"pointer"} onClick={() => sendMessage(item)} src={item} />
          </GridItem>
        </Center>
      ))}
    </Grid>
  );
};

export default TabChoseSticker;
