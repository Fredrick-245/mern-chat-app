import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { Box, Text,Spinner,FormControl,Input,useToast  } from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/button";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender } from "../../config/ChatLogics";
import Profile from "./Profile";
import { getSenderFull } from "../../config/ChatLogics";
// import UpdatedGroupChatModel from "./UpdatedGroupChatModel"
import UpdatedGroupChatModel from "./UpdatedGrouoChatModel";
import { axios } from 'axios';
import ScrollableChat from "./ScrollableChat";
import "./styles.css"
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [loading,setLoading] = useState(false)
  const [newMessage,setNewMessage] = useState()
  const [messages,setMessages] = useState()
  const toast = useToast()
  async function fectchMessages(){
    if(!selectedChat) return;
    try{
      setLoading(true)
      const config = {
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      }
      const {data} = await axios.get(`api/message/:${selectedChat._id}`,config)
      setMessages(data)
      setLoading(false)

    } catch(err){
      toast({
        title:"Error Occured",
        description:"Failed to load the Messages",
        status:"error",
        duration:3000,
        isClosable:true,
        position:"bottom"


      })
    }
  }

  useEffect(()=>{
    fectchMessages() 
  },[selectedChat])
  async function sendMessage(e){
    if(e.key==="Enter" && newMessage){
      try{
        const config = {
          headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${user.token}`
          }
        }
        setNewMessage("   ")
        const {data}  = await axios.post("/api/message",{
          content:newMessage,
          chatId:selectedChat._id
        },config)
        setMessages(...messages,newMessage)
      }catch(err){
        toast({
          title:"Error Occured",
          description:err.message,
          status:"error",
          duration:3000,
          isClosable:true
        })
      }


    }
  }
  function typingHandler(e){
    setNewMessage(e.target.value)
    // Typing indicator logiv
   }
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
            {loading? (
              <Spinner 
              size="xl"
              w={20}
              h={20}
              alignSelf="center"
              margin="auto"
              
              />
            ):(
              <div className="messages">
                 <ScrollableChat messages={messages}/>
              </div>
            )}
            <FormControl onKeyDown={sendMessage}>
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
