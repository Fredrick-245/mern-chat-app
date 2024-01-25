import { Button } from "@chakra-ui/react"
import {Route} from "react-router-dom";
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';
import "./app.css"

function App() {

  return (
    <div className="App">
    <Route path="/" component={Home} exact/>
    <Route path="/chats" component={ChatPage}/>
    </div>
  )
}

export default App
