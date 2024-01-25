import React, { useState } from "react";
import {
  Box,
  Tooltip,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  Avatar,
  MenuItem,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Input,
  useToast,
} from "@chakra-ui/react";
import ChatLoading from "../../utils/ChatLoading";
import {Spinner} from "@chakra-ui/spinner";
import { useDisclosure } from "@chakra-ui/hooks";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import axios from "axios"
import { CiSearch } from "react-icons/ci";
import { ChatState } from "../../../context/ChatProvider";
import Profile from "../../utils/Profile";
import { useHistory } from "react-router-dom";
import UserListItem from "../../utils/UserListItem";
import chats from "../../../pages/data";

export default function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user ,setSelectedChat} = ChatState();
  const history = useHistory();
  const toast = useToast();

  const logOutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter something in search",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top-left",
      });
      try {
        setIsLoading(true)
        const config = {
          header: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const {data} = await axios.get(`/api/user?serch=${search}`,config)
        setIsLoading(false)
        setSearch(data)
        

 
        
      } catch (err) {
        toast({
          title:"Error occured",
          description:"Failed to load the search results",
          status:"error",
          duration:3000,
          isClosable:true,
          position:"bottom-left"
        })
      }
    }
  
  };
  const accessChat = async (userId)=>{
    try{
      setLoadingChat(true);
      const config = {
        header: {
          "Content-type":"application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const {data} = await axios.post("/api/chat",{userId} ,config)
      if(!chats.find((c)=>c._id===data._id)) setChats([data,...chats])
      setSelectedChat(data)
      setLoadingChat(true)
      onClose()

    } catch(err){
      toast({
        title:"Error fetching the chat",
        description:err.message,
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom-left"
      })

    }

  } 
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <CiSearch />
            <Text display={{ base: "none", md: "flex" }} p="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Works sans">
          Talk-A-Tive
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList></MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <Profile user={user}>
                <MenuItem>My Profile</MenuItem>
              </Profile>
              <MenuItem onClick={logOutHandler}>Log out</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay></DrawerOverlay>
        <DrawerContent>
          <DrawerHeader>Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email..."
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              ></Input>
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {
              loading?(
                <ChatLoading></ChatLoading>
              ):(
                    searchResult?.map(user =><UserListItem key={user._id} user={user} handleFunction={()=>accessChat()}/>)
              )
            }
            {
              loadingChat && <Spinner ml="auto" display="flex"/>
            }
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
