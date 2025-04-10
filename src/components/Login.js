import React from "react";
import './Login.css';
import Api from '../Api';

export default function Login({ onReceive }) {

    const handleFacebookLogin = async () => {
        try {
            const result = await Api.fbPopup();

            // ✅ Log para entender o que está vindo da API
            console.log("Resultado da autenticação:", result);

            // ✅ Espera a autenticação terminar corretamente
            if (result && result.user) {
                const { uid, displayName, photoURL } = result.user;

                // Verificação extra para evitar dados vazios
                if (!uid || !displayName || !photoURL) {
                    alert("Informações incompletas recebidas do Facebook.");
                    return;
                }

                const user = {
                    id: uid,
                    name: displayName,
                    avatar: photoURL
                };

                await Api.addUser(user); // Salva no banco
                onReceive(user); // Envia pro App
            } else {
                alert('Login cancelado ou sem dados.'); // ✅ Aqui ocorre o alerta da imagem
            }
        } catch (error) {
            alert(`Erro ao logar com Facebook: ${error.message}`);
            console.error("Erro detalhado:", error);
        }
    };

    return (
        <div className="login">
            <button onClick={handleFacebookLogin}>
                Logar com Facebook
            </button>
        </div>
    );
}
