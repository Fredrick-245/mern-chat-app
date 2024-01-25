import React from 'react'
import {useDisclosure} from "@chakra-ui/hooks"
import {IconButton} from "@chakra-ui/button"
import {Image} from "@chakra-ui/image"
import {ViewIcon} from "@chakra-ui/icons"
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Text
  } from '@chakra-ui/react'

const Profile = ({user,children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    
  return (
    <div>
        {
            children?<span onClick={onOpen}>{children}</span>:(<IconButton display={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}/>)
        }
        <Modal size={"lg"} isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="40px"  fontFamily="Works sans" display="flex" justifyContent="center" >{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} alignItems={"center"} gap={"10px"}>
          <Image borderRadius="full" boxSize={"150px"} src={user.pic} alt={user.name}></Image>
            <Text 
            fontSize={{basel:"28px",md:"30px"}} 
            fontFamily={"Work sans"}
            >Email: {user.email}</Text>
          </ModalBody>
            

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='ghost'>Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default Profile
