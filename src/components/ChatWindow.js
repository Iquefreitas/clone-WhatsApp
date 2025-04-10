import React, { useState, useEffect, useRef } from "react";
import './ChatWindow.css';
import EmojiPicker from 'emoji-picker-react';

import MessageItem from "./MessageItem";
import Api from "../Api";

import SearchIcon from '@mui/icons-material/Search';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';

export default ({ user, data }) => {
    const body = useRef();
    const recognitionRef = useRef(null);

    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition && !recognitionRef.current) {
        recognitionRef.current = new SpeechRecognition();
    }

    const [emojiOpen, setEmojiOpen] = useState(false);
    const [text, setText] = useState('');
    const [listening, setListening] = useState(false);
    const [list, setList] = useState([]);
    const [users, setUsers] = useState([]);
    const [chatData, setChatData] = useState(data); // novo estado

useEffect(() => {
  let unsub = Api.onChatContent(data.chatId, setList, setChatData);
  return unsub;
}, [data.chatId]);


useEffect(() => {
    let unsub = Api.onChatContent(data.chatId, setList, setChatData);
    return unsub;
  }, [data.chatId]);

    useEffect(() => {
        if (body.current.scrollHeight > body.current.offsetHeight) {
            body.current.scrollTop = body.current.scrollHeight - body.current.offsetHeight;
        }
    }, [list]);

    const handleEmojiClick = (emojiData) => {
        setText(text + emojiData.emoji);
    };

    const handleOpenEmoji = () => setEmojiOpen(true);
    const handleCloseEmoji = () => setEmojiOpen(false);

    const handleSendClick = () => {
        if (text !== '') {
            Api.sendMessage(chatData, user.id, 'text', text, users);
            setText('');
            setEmojiOpen(false);
        }
    };

    const handleInputKeyUp = (e) => {
        if (e.keyCode === 13) {
            handleSendClick();
        }
    };

    const handleMicClick = () => {
        if (recognitionRef.current && !listening) {
            recognitionRef.current.lang = 'pt-BR';
            recognitionRef.current.continuous = false;

            recognitionRef.current.onstart = () => {
                console.log("Reconhecimento de voz iniciado...");
                setListening(true);
            };

            recognitionRef.current.onend = () => {
                console.log("Reconhecimento de voz encerrado.");
                setListening(false);
            };

            recognitionRef.current.onresult = (event) => {
                if (event.results.length > 0) {
                    const transcript = event.results[0][0].transcript;
                    setText(prevText => prevText + " " + transcript);
                }
            };

            recognitionRef.current.start();
        }
    };

    return (
        <div className="chatWindow">
            <div className="chatWindow--header">
                <div className="chatWindow--headerinfo">
                    <img className="chatWindow--avatar" src={data.image} alt="" />
                    <div className="chatWindow--name">{data.title}</div>
                </div>

                <div className="chatWindow--headerbuttons">
                    <div className="chatWindow--btn"><SearchIcon style={{ color: '#919191' }} /></div>
                    <div className="chatWindow--btn"><AttachFileIcon style={{ color: '#919191' }} /></div>
                    <div className="chatWindow--btn"><MoreVertIcon style={{ color: '#919191' }} /></div>
                </div>
            </div>

            <div ref={body} className="chatWindow--body">
                {list.map((item, key) => (
                    <MessageItem key={key} data={item} user={user} />
                ))}
            </div>

            <div className="chatWindow--emojiarea" style={{ height: emojiOpen ? '200px' : '0px' }}>
                <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>

            <div className="chatWindow--footer">
                <div className="chatWindow--pre">
                    <div className="chatWindow--btn"
                        onClick={handleCloseEmoji}
                        style={{ width: emojiOpen ? 40 : 0 }}>
                        <CloseIcon style={{ color: '#919191' }} />
                    </div>
                    <div className="chatWindow--btn" onClick={handleOpenEmoji}>
                        <SentimentVerySatisfiedIcon style={{ color: emojiOpen ? '#009688' : '#919191' }} />
                    </div>
                </div>

                <div className="chatWindow--inputarea">
                    <input
                        className="chatWindow--input"
                        type="text"
                        placeholder="Digite uma mensagem"
                        value={text}
                        onChange={e => setText(e.target.value)}
                        onKeyUp={handleInputKeyUp}
                    />
                </div>

                <div className="chatWindow--pos">
                    {text === '' ? (
                        <div onClick={handleMicClick} className="chatWindow--btn">
                            <MicIcon style={{ color: listening ? '#126ECE' : '#919191' }} />
                        </div>
                    ) : (
                        <div onClick={handleSendClick} className="chatWindow--btn">
                            <SendIcon style={{ color: '#919191' }} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
