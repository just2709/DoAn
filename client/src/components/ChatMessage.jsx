import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../config/ChatLogics";
import { ChatState } from "../context/ChatProvider";
import { Tooltip, Avatar, Image } from "@chakra-ui/react";

const ChatMessage = ({ messages }) => {
  const { user } = ChatState();
  return (
    <ScrollableFeed forceScroll={true}>
      {messages &&
        messages.map((message, index) => (
          <div style={{ display: "flex" }} key={message._id}>
            {(isSameSender(messages, message, index, user.user._id) || isLastMessage(messages, index, user.user._id)) && (
              <Tooltip label={message.sender.name} placement='bottom-start' hasArrow>
                <Avatar mt='20px' mr='1' size='xs' cursor='pointer' name={message.sender.name} src={message.sender.image} />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: message.sender._id === user.user._id ? "#bee3f8" : "#b9f5d0",
                borderRadius: message.sender._id !== user.user._id ? "0.8rem 0.8rem 0.8rem 0" : "0.8rem 0.8rem 0 0.8rem",
                padding: "0.5rem 1rem",
                maxWidth: "66%",
                marginLeft: isSameSenderMargin(messages, message, index, user.user._id),
                marginTop: isSameUser(messages, message, index, user.user._id) ? 3 : 10,
              }}>
              {message.content.text}
              {message.content.images && message.content.images.map((e) => <Image src={e} />)}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ChatMessage;
