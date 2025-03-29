"use client";
import Image from "next/image";
import { useState } from "react";
import styles from "./Chatbot.module.css";

const Chatbot = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const [isOpen, setIsOpen] = useState(false);  //  Added toggle state

    const sendMessage = async () => {
        if (!input.trim()) return;
  
        setMessages((prev) => [...prev, `You: ${input}`]);
    
        try {
            const response = await fetch("/api/chatbot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });
    
            const data = await response.json();
            
       
            setMessages((prev) => [...prev, `Bot: ${data.response}`]);
        } catch (error) {
            setMessages((prev) => [...prev, `Bot: Error connecting to chatbot`]);
        }
    
        setInput('');
    };
    

    return (
        <div className={styles.chatbox}>
            <button className={styles.chatbox__button} onClick={() => setIsOpen(!isOpen)}>
            <Image src="/chatbot-icon.svg" alt="Chat icon" width={50} height={50} />            </button>

            {isOpen && ( 
                <div className={styles.chatbox__support}>
                    <div className="chatbox__header">
                        <div className="chatbox__image--header">
                            <img
                                src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-5--v1.png"
                                alt="Chat Support"
                            />
                        </div>
                        <div className="chatbox__content--header">
                            <h4 className="chatbox__heading--header">Chat Support</h4>
                            <p className="chatbox__description--header">Hi. I am KnowledgeHub assistant. How can I help you?</p>
                        </div>
                    </div>
                    <div className={styles.chatbox__messages}>
                        {messages.map((msg, index) => (
                            <p key={index}>{msg}</p>
                        ))}
                    </div>
                    <div className={styles.chatbox__footer}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className={"dark:text-white text-black"}
                            placeholder="Ask something..."
                        />
                        <button className={styles.send__button} onClick={sendMessage}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;