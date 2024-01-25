import React, { useState } from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import { Button } from "@chakra-ui/button";
import axios from "axios";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
  Input,
  Box,
} from "@chakra-ui/react";
import { FormControl } from "@chakra-ui/form-control";
import { ChatState } from "../../context/ChatProvider";
import UserListItem from "./UserListItem";
import UserBadgeItem from "./UserBadgeItem";
const GroupChatModel = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const { user, chats, setChats } = ChatState();

  async function handleSearch(query) {
    setSearch(query);
    if (!query) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (err) {
      toast({
        title: "Error occured!",
        description: "Failed to load Search results",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }
  function handlerGroup(userToBeAdded) {
    if (selectedUsers.includes(userToBeAdded)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: top,
      });
      return;
    }
    setSelectedUsers(...selectedUsers, userToBeAdded);
  }
  async function handleSubmit() {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/chats/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      onClose();
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 3000,
        isClosable: false,
        position: "bottom",
      });
    } catch (err) {
      toast({
        title: "Failed to Create the Chat",
        description: err.response.data,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  }

  function handleDelete(delUser) {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  }

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              ></Input>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: John"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              ></Input>
              <Box display="flex" w="100%" flexWrap="wrap">
                {
                  /* selected users*/
                  selectedUsers.map((user) => (
                    <UserBadgeItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleDelete(user)}
                    />
                  ))
                }
              </Box>

              {
                /*render searched users*/
                loading ? (
                  <div>Loading</div>
                ) : (
                  searchResults
                    ?.slice(0, 4)
                    .map((user) => (
                      <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={() => handlerGroup(user)}
                      />
                    ))
                )
              }
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create Chat
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModel;
