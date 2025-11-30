const express = require("express");
const { WebcastPushConnection } = require("tiktok-live-connector");

const app = express();
const PORT = process.env.PORT || 3000;

// Nome de usuário do TikTok (sem @)
const tiktokUsername = process.env.TIKTOK_USERNAME;

app.get("/", (req, res) => {
    res.send("Servidor do TikTok Territory ativo! 🚀");
});

// Conexão com o TikTok
const connection = new WebcastPushConnection(tiktokUsername, {
    enableExtendedGiftInfo: true
});

// Quando conectar
connection.connect().then(state => {
    console.log(`🎉 Conectado ao TikTok Live de @${state.roomInfo.owner.nickname}`);
}).catch(err => {
    console.error("❌ Erro ao conectar:", err);
});

// Evento: comentário
connection.on('chat', data => {
    console.log(`💬 ${data.uniqueId}: ${data.comment}`);
});

// Evento: like
connection.on('like', data => {
    console.log(`❤️ ${data.uniqueId} deu ${data.likeCount} likes`);
});

// Evento: gift
connection.on('gift', data => {
    console.log(`🎁 ${data.uniqueId} enviou ${data.giftName}`);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
