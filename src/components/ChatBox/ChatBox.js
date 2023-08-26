import axios from "axios";
import "./ChatBox.scss";
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import useAxios from "../../hooks/useAxios";

const socket = io.connect("http://localhost:5000");

const ChatBox = () => {
    const [username, setUsername] = useState("CLIENT");
    const [room, setRoom] = useState(null);
    const scrolled = useRef();
    const { sendRequest } = useAxios();

    const joinRoom = async () => {
        console.log(username, room);
        sendRequest({ url: "/message", method: "post" });
        if (username && room) {
            socket.emit("join_room", room);
        }
    };
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                session: room,
                author: username,
                message: currentMessage,
                time:
                    new Date(Date.now()).getHours() +
                    ":" +
                    new Date(Date.now()).getMinutes(),
            };

            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
            scrolled.current?.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        axios
            .get("/csrfSecret")
            .then((response) => response.data)
            .then((data) => setRoom(data.csrfSecret))
            .catch((error) => console.log(error));
    }, []);

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
            scrolled.current?.scrollIntoView({ behavior: "smooth" });
        });
    }, [socket]);

    useEffect(() => {
        const chatbotToggler = document.querySelector(".chatbot-toggler");
        const closeBtn = document.querySelector(".close-btn");
        const backdrop = document.querySelector("#backdrop");

        function onCloseChat() {
            document.body.classList.remove("show-chatbot");
            backdrop.classList.remove("backdrop");
        }
        function onShowChat() {
            document.body.classList.toggle("show-chatbot");
            backdrop.classList.toggle("backdrop");
        }

        closeBtn.addEventListener("click", onCloseChat);
        backdrop.addEventListener("click", onCloseChat);
        chatbotToggler.addEventListener("click", onShowChat);

        return () => {
            closeBtn.removeEventListener("click", onCloseChat);
            backdrop.removeEventListener("click", onCloseChat);
            chatbotToggler.removeEventListener("click", onShowChat);
        };
    }, []);

    return (
        <>
            <div id="backdrop"></div>
            <button className="chatbot-toggler" onClick={joinRoom}>
                <span>
                    <i className="bi bi-chat-fill"></i>
                </span>
                <span>
                    <i className="bi bi-x-lg"></i>
                </span>
            </button>
            <div className="chatbot">
                <header className="d-flex align-items-center justify-content-around">
                    <h5 className="fw-bolder">Customer Support</h5>
                    <button className="close-btn border-0 text-secondary px-2 fst-italic h6 mb-0">
                        Let's Chat App
                    </button>
                </header>
                <ul className="chatbox d-flex flex-column gap-2">
                    {messageList.map((messageContent, index) => {
                        return (
                            <li
                                key={index}
                                ref={scrolled}
                                className={
                                    username === messageContent.author
                                        ? "chat outcoming"
                                        : "chat incoming"
                                }>
                                {messageContent.author === "ADMIN" && (
                                    <span>
                                        <i className="bi bi-robot"></i>
                                    </span>
                                )}
                                <p>
                                    {messageContent.author === "ADMIN"
                                        ? `${messageContent.author}: `
                                        : ""}
                                    {messageContent.message}
                                </p>
                                {/* <span id="time">{messageContent.time}</span> */}
                            </li>
                        );
                    })}
                </ul>
                <div className="chat-input">
                    <span>
                        <i className="bi bi-robot"></i>
                    </span>
                    <input
                        type="text"
                        value={currentMessage}
                        placeholder="Hey..."
                        onChange={(event) => {
                            setCurrentMessage(event.target.value);
                        }}
                        onKeyPress={(event) => {
                            event.key === "Enter" && sendMessage();
                        }}
                    />
                    <span className="me-1">
                        <i className="bi bi-stickies"></i>
                    </span>
                    <span className="me-1">
                        <i className="bi bi-emoji-smile"></i>
                    </span>
                    <button
                        className="chatSubmitButton"
                        style={{ border: "none", background: "none" }}
                        onClick={sendMessage}>
                        <span id="send-btn">
                            <i className="bi bi-send-fill"></i>
                        </span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default ChatBox;
