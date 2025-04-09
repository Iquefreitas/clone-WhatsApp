ChatApp com Firebase e React

Este é um aplicativo de chat em tempo real desenvolvido com React e Firebase, com suporte a login via Facebook, troca de mensagens em tempo real e uso de emojis e reconhecimento de voz.


 Funcionalidades

-  Login com Facebook
-  Lista de contatos (excluindo o usuário logado)
-  Chat em tempo real com atualização automática (via Firestore)
-  Suporte a emojis
-  Envio de mensagens por voz (Web Speech API)
-  Armazenamento de dados no Firebase Firestore

Tecnologias Utilizadas

- React – Biblioteca principal do frontend
- Firebase – Backend (Autenticação e Banco de Dados)
- Firestore – Banco de dados NoSQL em tempo real
- Emoji Picker – Componente de emojis
- Web Speech API – Reconhecimento de voz
- Material UI Icons – Ícones da interface

 Instalação:

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio

2. Intale o Firebase
npm install

3. Configure o Firebase:
Crie um arquivo chamado firebaseConfig.js dentro da pasta src com o seguinte conteúdo:

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMINIO.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_BUCKET.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};
export default firebaseConfig;

Obs: Você encontra esses dados no console do Firebase após criar seu projeto.

4. Rode o projeto localmente:
npm start

5. Configuração do Firebase
5.1 Crie um projeto em console.firebase.google.com

5.2 Habilite o Firestore Database

5.3 Habilite o Facebook no menu Authentication > Sign-in method

5.4 Crie as collections users e chats manualmente ou deixe o app criá-las ao rodar

5.5 Adicione seu domínio local (ex: http://localhost:3000) na aba de autenticação do Facebook no Firebase

