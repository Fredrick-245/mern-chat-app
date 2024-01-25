import React, { useState } from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  useToast
} from "@chakra-ui/react";
import axios from "axios";
import {useHistory} from "react-router-dom"
export default function SighnUp() {
    const [show,setShow]=useState(false)
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [pic, setPic] = useState();
  const [loading,setIsLoading]=useState(false);
  const history = useHistory()
  const toast = useToast()


  const postDetails = (pic)=>{
    setIsLoading(true)
    if(pic===undefined){
        toast({
            title: 'Please select an Image!',
            // description: "We've created your account for you.",
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position:"bottom"
          })
          return
    }
    if(pic.type === "image/jpeg" || pic.type==="image/png"){
        const data = new FormData();
        data.append("file",pic)
        data.append("upload_preset","chatApp")
        data.append("cloud_name","tengeya")
        fetch("https://api.cloudinary.com/v1_1/dr66bmrie/image/apload",{
            method:"POST",
            body:data
        }).then((res)=>res.json()).then(data=>{
            setPic(data.url.toString())
            setIsLoading(false)
        }).catch(err=>{
            console.log(err)
            setIsLoading(false)
        })
    } else {
        toast({
            title: 'Please select an Image!',
            // description: "We've created your account for you.",
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position:"bottom"
        })
        setIsLoading(false)
        return;
    }
  }
  const submitHandler = async ()=>{
    if(!name || !password || !email || !pic){
        toast({
            title: "Please fill all  the fields",
            // description: "We've created your account for you.",
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position:"bottom"
        })

    }
    if(password !== confirmPassword){
        toast({
            title: 'Passwords do not match',
            // description: "We've created your account for you.",
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position:"bottom"
        })
    }
    try {
    const config = {
            headers:{
                "Content-type":"application/json"
            }
        }
    const {data} = await axios.post("/api/user",{name,password,email,pic})
    toast({
        title: 'Login succesful',
        // description: "We've created your account for you.",
        status: 'succes',
        duration: 5000,
        isClosable: true,
        position:"bottom"
    })
    localStorage.setItem("UserInfo",JSON.stringify(data))
    setIsLoading(false)
    history.pus
    } catch(err){
        toast({
            title: "Error",
            description: `${err}`,
            status: 'error',
            duration: 5000,
            isClosable: true,
            position:"bottom"
        })
        console.log(err)
        
    }
    
  }
  return (
    <VStack spacing="5px">
      <FormControl isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Fredrick Ndemo"
          onChange={(e) => setName(e.target.value)}
        ></Input>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="example@gmail.com"
          onChange={(e) => setEmail(e.target.value)}
        ></Input>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
          type={show?"text":"password"}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          ></Input>
          <InputRightElement width="4.5rem">
            <Button h="1.75rem"size="sm" onClick={()=>setShow(!show)}>{show?"Hide":"Show"}</Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Confirm Pasword</FormLabel>
        <InputGroup>
          <Input
          type={show?"text":"password"}
            placeholder="Confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Input>
          <InputRightElement width="4.5rem">
            <Button h="1.75rem"size="sm" onClick={()=>setShow(!show)}>{show?"Hide":"Show"}</Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Upload your picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        ></Input>
      </FormControl>
      <Button 
      colorScheme="blue"
      width="100%"
      style={{marginTop:15}}
      onClick={submitHandler}
      isLoading={loading}
      >
            Sign Up
      </Button>
    </VStack>
  );
}
