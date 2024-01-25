import React,{ useEffect } from "react";
import { Container, Box, Text,Tab,Tabs,TabList,TabPanel,TabPanels } from "@chakra-ui/react";
import LogIn from "../components/Aunthentication/LogIn";
import SighnUp from "../components/Aunthentication/SighnUp";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function Home() {
  const history = useHistory();
  useEffect(()=>{
    const userInfo = JSON.parse(localStorage.getItem("UserInfo"))
    if(userInfo)history.push("/chats")
  },[history])

  return (
    <Container maxW="xl" centerContent>
      <Box
        // d="flex"
        // justifyContent="center"
        // alignItems="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text
          fontSize="4xl"
          fontFamily="Work sans"
          textAlign="center"
          color="black"
        >
          Talk-A-Tive
        </Text>
      </Box>
      <Box bg="white" w="100%" borderRadius="lg" p="4" borderWidth="1px">
        <Tabs variant="soft-rounded" >
          <TabList w={"100%"} mb="1em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <LogIn/>
            </TabPanel>
            <TabPanel>
              <SighnUp/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}
