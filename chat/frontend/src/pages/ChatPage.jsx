import React, { useEffect, useState } from "react";
import axios from "axios";
import chatsData from "./data";
import { ChatState } from "../context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/Aunthentication/chats/SideDrawer";
import MyChats from "../components/Aunthentication/chats/MyChats";
import ChatBox from "../components/Aunthentication/chats/ChatBox";

export default function ChatPage() {
  const { user } = ChatState() || 1;
  const [fetchAgain,setFetchAgain]= useState()

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
      >
        {user && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}  />}
        {user && <ChatBox  fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
    </div>
  );
}
