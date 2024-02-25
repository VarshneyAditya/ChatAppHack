import React, { useContext, useEffect, useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MessageSelf from "./MessageSelf";
import MessageOthers from "./MessageOthers";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";
import { myContext } from "./MainContainer";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:8080";

var socket
function ChatArea() {
  const lightTheme = useSelector((state) => state.themeKey);
  const [messageContent, setMessageContent] = useState("");
  const messagesEndRef = useRef(null);
  const dyParams = useParams();
  const [chat_id, chat_user] = dyParams._id.split("&");
  console.log('====|||||||====== ', chat_id, chat_user);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [allMessages, setAllMessages] = useState([]);

  const { refresh, setRefresh } = useContext(myContext);
  const [loaded, setloaded] = useState(false);
  const [socketConnectionStatus, setSocketConnectionStatus] = useState(false);

  const sendMessage = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData?.data?.token}`,
      },
    };
    axios
      .post(
        "http://localhost:8080/message/",
        {
          content: messageContent,
          chatId: chat_id,
        },
        config
      )
      .then(({ data }) => {
        console.log("Message Fired", data);
          setAllMessages((prevMessages) => {
            // Check if the new message already exists in the array
            const isDuplicate = prevMessages.some(
              (message) => message._id === data._id
            );
  
            // Update the state only if it's not a duplicate
            if (!isDuplicate) {
              return [...prevMessages, data];
            }
  
            // If it's a duplicate, return the current state without modifications
            return prevMessages;
          });
        socket.emit("new message", data);
      });
  };

  // connect to socket
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", userData);
    socket.on("connection", () => {
      setSocketConnectionStatus(!socketConnectionStatus);
    });
  }, []);

  // new message recieved
  useEffect(() => {
    socket.on("message recieved", (newMessage) => {
      if (!allMessages || allMessages._id !== newMessage._id) {
        setAllMessages((prevMessages) => {
          // Check if the new message already exists in the array
          const isDuplicate = prevMessages.some(
            (message) => message._id === newMessage._id
          );

          // Update the state only if it's not a duplicate
          if (!isDuplicate) {
            return [...prevMessages, newMessage];
          }

          // If it's a duplicate, return the current state without modifications
          return prevMessages;
        });
      }
    });
  });

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData?.data?.token}`,
      },
    };
    axios
      .get("http://localhost:8080/message/" + chat_id, config)
      .then(({ data }) => {
        setAllMessages(data);
        setloaded(true);
        socket.emit("join chat", chat_id);
      });
    setAllMessages(allMessages);
  }, [refresh, chat_id, userData?.data?.token]);

  if (!loaded) {
    return (
      <div
        style={{
          border: "20px",
          padding: "10px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{ width: "100%", borderRadius: "10px" }}
          height={60}
        />
        <Skeleton
          variant="rectangular"
          sx={{
            width: "100%",
            borderRadius: "10px",
            flexGrow: "1",
          }}
        />
        <Skeleton
          variant="rectangular"
          sx={{ width: "100%", borderRadius: "10px" }}
          height={60}
        />
      </div>
    );
  } else {
    return (
      <div className={"chatArea-container" + (lightTheme ? "" : " dark")}>
        <div className={"chatArea-header" + (lightTheme ? "" : " dark")}>
          <p className={"con-icon" + (lightTheme ? "" : " dark")}>
            {chat_user[0]}
          </p>
          <div className={"header-text" + (lightTheme ? "" : " dark")}>
            <p className={"con-title" + (lightTheme ? "" : " dark")}>
              {chat_user}
            </p>
            {/* <p className={"con-timeStamp" + (lightTheme ? "" : " dark")}>
              {props.timeStamp}
            </p> */}
          </div>
          <IconButton className={"icon" + (lightTheme ? "" : " dark")}>
            <DeleteIcon />
          </IconButton>
        </div>
        <div className={"messages-container" + (lightTheme ? "" : " dark")}>
          {allMessages
            .slice(0)
            .reverse()
            .map((message, index) => {
              const sender = message.sender;
              const self_id = userData?.data?._id;
              if (sender._id === self_id) {
                // console.log("I sent it ");
                return <MessageSelf props={message} key={index} />;
              } else {
                // console.log("Someone Sent it");
                return <MessageOthers props={message} key={index} />;
              }
            })}
        </div>
        <div ref={messagesEndRef} className="BOTTOM" />
        <div className={"text-input-area" + (lightTheme ? "" : " dark")}>
          <input
            placeholder="Type a Message"
            className={"search-box" + (lightTheme ? "" : " dark")}
            value={messageContent}
            onChange={(e) => {
              setMessageContent(e.target.value);
            }}
            onKeyDown={(event) => {
              if (event.code == "Enter") {
                // console.log(event);
                sendMessage();
                setMessageContent("");
                setRefresh(!refresh);
              }
            }}
          />
          <IconButton
            className={"icon" + (lightTheme ? "" : " dark")}
            onClick={() => {
              sendMessage();
              setRefresh(!refresh);
            }}
          >
            <SendIcon />
          </IconButton>
        </div>
      </div>
    );
  }
}

export default ChatArea;
