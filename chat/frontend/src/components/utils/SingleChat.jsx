import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import {
  Box,
  Text,
  Spinner,
  FormControl,
  Input,
  useToast,
} from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/button";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender } from "../../config/ChatLogics";
import Profile from "./Profile";
import { getSenderFull } from "../../config/ChatLogics";
// import UpdatedGroupChatModel from "./UpdatedGroupChatModel"
import UpdatedGroupChatModel from "./UpdatedGrouoChatModel";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from "react-lottie"
import "./styles.css";
import animationData from "./../../assets/typing.json"
let socket
let selectedChatCompare;
const ENDPOINT = "http://localhost:5173";
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [messages, setMessages] = useState();
  // const [isChatSelected,setChatIsSelected] = useState(ChatState().selectedChat) 
  const [socketConnected,setSocketConnected] = useState(false)
  const [typing,setTyping] = useState(false)
  const [isTyping,setIsTyping] = useState(false)
  const defaultOptions = {
    loop:true,
    autoplay:true,
    animationData:animationData,
    renderSettings:{
      preserveAspectRatio:"xMidYMid slice"
    }
  }

     
  const toast = useToast();
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup",user)
    socket.on("connection",()=>{
      setSocketConnected(true)
    })
    socket.on("typing",()=>setIsTyping(true))
    socket.on("stop typing",()=>setIsTyping(false  ))
  }, []);


  async function fectchMessages() {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat",selectedChat._id)
    } catch (err) {
      toast({
        title: "Error Occured",
        description: "Failed to load the Messages",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  }

  useEffect(() => {
    fectchMessages();
     selectedChatCompare = selectedChat 
    // return () => {
    //   setSelectedChat(selectedChat);
    // };
  }, [selectedChat]);
  useEffect(()=>
  {

    socket.on("message received",(newMessageReceived)=>{
      if(!selectedChatCompare || selectedChatCompare._id != newMessageReceived.chat._id){
        // give notification
      } else {
        setMessages([...messages,newMessageReceived])
      }
    })
  })
  async function sendMessage(e) {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing",selectedChat._id)
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("   ");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("new message",data)
        setMessages(...messages, data);
      } catch (err) {
        toast({
          title: "Error Occured",
          description: err.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  }
  function typingHandler(e) {
    setNewMessage(e.target.value);
    if(!socketConnected) return
    if(!typing){
      setTyping(true)
      socket.emit("typing",selectedChat._id)
    }
    let lastTypingTime = new Date().getTime()
    let timerLength = 3000;
    setTimeout(() =>{
      let timeNow = new Date.getTime()
      let timeDiff = timeNow-lastTypingTime
      if(timeDiff >= timerLength && typing){
        socket.emit("stop typing",selectedChat._id)
        setTyping(false)
      }
 
    },timerLength)
  }
 console.log(selectedChat)
  return ( 
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Works sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={setSelectedChat("")}
            ></IconButton>
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <Profile
                  user={getSenderFull(user, selectedChat.users)}
                ></Profile>
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdatedGroupChatModel
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fectchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#e8e8e8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY={"hidden"}
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage}>
              {isTyping && <Lottie options={defaultOptions} width={70} style={{marginBottom:25,marginLeft:0}}/>} 
              <Input
                variant="filled"
                bg="#e0e0ee0"
                placeholder="Enter a message.."
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click here start texting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
