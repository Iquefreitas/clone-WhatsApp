import { initializeApp } from "firebase/app";
import { getAuth, FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import firebaseConfig from "./firebaseConfig";
import {
  getFirestore, doc, setDoc, collection, getDocs,
  addDoc, updateDoc, arrayUnion
} from "firebase/firestore";

import { onSnapshot } from "firebase/firestore";

import { getDoc } from 'firebase/firestore';


const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export default {
  fbPopup: async () => {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      return result;
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        console.warn("O usuário fechou o pop-up sem fazer login.");
        return null;
      }
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  },

  addUser: async (u) => {
    if (!u.id) {
      console.error("Usuário sem ID, não foi possível salvar:", u);
      return;
    }

    const userRef = doc(db, "users", u.id);
    await setDoc(userRef, {
      name: u.name || "Sem nome",
      avatar: u.avatar || ""
    }, { merge: true });
  },

  getContactList: async (userId) => {
    let list = [];

    const usersRef = collection(db, "users");
    const results = await getDocs(usersRef);

    results.forEach(result => {
      let data = result.data();

      if (result.id !== userId) {
        list.push({
          id: result.id,
          name: data.name,
          avatar: data.avatar
        });
      }
    });

    return list;
  },

  addNewChat: async (user, user2) => {
    const newChatRef = await addDoc(collection(db, "chats"), {
      messages: [],
      users: [user.id, user2.id]
    });

    const userRef = doc(db, "users", user.id);
    await updateDoc(userRef, {
      chats: arrayUnion({
        chatId: newChatRef.id,
        title: user2.name,
        image: user2.avatar,
        with: user2.id
      })
    });

    const user2Ref = doc(db, "users", user2.id);
    await updateDoc(user2Ref, {
      chats: arrayUnion({
        chatId: newChatRef.id,
        title: user.name,
        image: user.avatar,
        with: user.id
      })
    });
  },

  onChatContent: (chatId, setList, setChatData) => {
    const chatRef = doc(db, 'chats', chatId);
  
    return onSnapshot(chatRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setList(data.messages || []);
        if (setChatData) setChatData({ ...data, chatId }); 
      }
    });
  },
  
  onChatList: (userId, setChatList) => {
    const userRef = doc(db, "users", userId);
  
    return onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.chats) {
          setChatList(data.chats);
        }
      }
    });
  },

  sendMessage: async (chatData, userId, type, body) => {
    const now = new Date();
  
    const chatRef = doc(db, 'chats', chatData.chatId);
    await updateDoc(chatRef, {
      messages: arrayUnion({
        type,
        author: userId,
        body,
        date: now
      })
    });
  
    for (let i = 0; i < chatData.users.length; i++) {
      const userIdInChat = chatData.users[i];
      const userRef = doc(db, 'users', userIdInChat);
      const uSnap = await getDoc(userRef);
  
      if (uSnap.exists()) {
        const uData = uSnap.data();
        let chats = uData.chats || [];
  
        for (let e = 0; e < chats.length; e++) {
          if (chats[e].chatId === chatData.chatId) {
            chats[e].lastMessage = body;
            chats[e].lastMessageDate = now;
          }
        }
  
        await updateDoc(userRef, { chats });
      }
    }
  }
  };

