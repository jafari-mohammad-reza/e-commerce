import React, {useRef, useState} from 'react';
import {Link} from "react-router-dom";
import {BsFillEmojiSmileFill, BsFillImageFill} from "react-icons/bs";
import {AiOutlineSend} from "react-icons/ai";
import {IoLocation} from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import {ChatInput, ChatInputContainer, ChatsContainer, Container, Message} from "../../components/SupportComponents";

const OnlineSupport = () => {
    const ImagePickerRef = useRef(null)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [message, setMessage] = useState("")
    const [latitude, setLatitude] = useState(0)
    const [longitude, setLongitude] = useState(0)
    const handleEmojiClick = (event, emoji) => {
        let msg;
        msg += emoji.emoji
        setMessage(msg)
    }
    const handleSendLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                setLatitude(position.coords.latitude)
                setLongitude(position.coords.longitude)
            });

        }
    }
    return (
        <Container>
            <Link to={"/"}><img src="/images/logo.png" alt="Logo"/></Link>
            <ChatsContainer>
                <Message recived={true}>
                    <img src="/images/logo.png" alt="" className={"logo"}/>
                    <p>
                        This is E-Commerce website Supporter.
                    </p>
                </Message>
                <Message>
                    <img src="/images/img_227643-2541231163.png" alt="" className={"logo"}/>
                    <img src="/images/logo.png" alt="" className="img-content"/>
                    <p>
                        I got some problem with my order.
                    </p>
                </Message>
            </ChatsContainer>
            <ChatInputContainer>
                <ChatInput value={message} onChange={(e) => setMessage(e.target.value)}/>
                <BsFillEmojiSmileFill className={"emoji"} onClick={() => setShowEmojiPicker(!showEmojiPicker)}/>
                <div className="btnContainer">
                    <div className="chatOptions">
                        <IoLocation/>
                        <div className={"selectImage"}>
                            <BsFillImageFill onClick={() => ImagePickerRef.current.click()}/>
                            <input type="file" hidden ref={ImagePickerRef} accept={"image"}/>
                        </div>
                    </div>
                    <button className={"sendBtn"}>
                        <AiOutlineSend/>
                    </button>
                </div>
                {showEmojiPicker && <EmojiPicker onEmojiClick={handleEmojiClick} preload={true}/>}

            </ChatInputContainer>
        </Container>
    );
};


export default OnlineSupport;