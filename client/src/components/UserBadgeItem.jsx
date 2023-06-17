import React from "react";
import { Tag, TagLabel } from "@chakra-ui/react";
import { IoMdClose } from "react-icons/io";

const UserBadgeItem = ({ isAdmin, user, handleFunction }) => {
  console.log(user);
  return (
    <Tag size='lg' colorScheme='blackAlpha' borderRadius='lg' mr='2' mt='2'>
      <TagLabel d='flex' alignItems='center'>
        {user.name}
        {isAdmin && <span style={{ color: "red" }}>(Nhóm trưởng)</span>}
        <IoMdClose onClick={handleFunction} cursor='pointer' />
      </TagLabel>
    </Tag>
  );
};

export default UserBadgeItem;
