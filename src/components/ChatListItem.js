import React, { useState, useEffect } from "react";
import './ChatListItem.css';

export default ({ onClick, active, data }) => {
    const [time, setTime] = useState('');

    useEffect(() => {
        if (data?.lastMessageDate?.seconds) {
            const d = new Date(data.lastMessageDate.seconds * 1000);
            let hours = d.getHours();
            let minutes = d.getMinutes();
            hours = hours < 10 ? '0' + hours : hours;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            setTime(`${hours}:${minutes}`);
        } else {
            setTime('');
        }
    }, [data]);

    
    if (!data) return null;

    return (
        <div className={`chatListItem ${active ? 'active' : ''}`} onClick={onClick}>
            <img className="chatListItem--avatar" src={data.image || ''} alt="" />
            <div className="chatListItem--lines">
                <div className="chatListaItem--line">
                    <div className="chatListItem--name">{data.title || ''}</div>
                    <div className="chatListitem--date">{time}</div>
                </div>
                <div className="chatListaItem--line">
                    <div className="chatListItem--lastMsg">
                        <p>{data.lastMessage || ''}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
