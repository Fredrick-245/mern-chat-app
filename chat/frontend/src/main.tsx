import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react'
import {BrowserRouter} from "react-router-dom";
import ChatProvider from "./context/ChatProvider.jsx";
ReactDOM.createRoot(document.getElementById('root')!).render(
  <ChatProvider>
  <React.StrictMode>
    <BrowserRouter>
    <ChakraProvider>
    <App />
    </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>,
  </ChatProvider>

)
