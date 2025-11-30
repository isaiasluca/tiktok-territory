require("dotenv").config();
const express=require("express"),cors=require("cors"),http=require("http"),WebSocket=require("ws"),TikTokLive=require("tiktok-live-connector");
const app=express();app.use(cors());
const server=http.createServer(app);
const wss=new WebSocket.Server({server,path:"/ws"});
const tiktok=new TikTokLive(process.env.TIKTOK_USERNAME,{enableExtendedGiftInfo:true});
wss.on("connection",ws=>{ws.send(JSON.stringify({type:"connected"}));});
function sendAll(d){wss.clients.forEach(c=>c.readyState===WebSocket.OPEN&&c.send(JSON.stringify(d)));}
tiktok.on("chat",d=>sendAll({type:"comment",username:d.nickname,comment:d.comment,userId:d.userId,avatar:d.profilePictureUrl}));
tiktok.on("like",d=>sendAll({type:"like",username:d.nickname,likes:d.likeCount}));
tiktok.on("gift",d=>{if(d.giftType===1&&!d.repeatEnd)return;sendAll({type:"gift",username:d.nickname,userId:d.userId,giftName:d.giftName.toLowerCase(),avatar:d.profilePictureUrl,count:d.repeatCount});});
server.listen(process.env.PORT||10000,()=>{console.log("OK");tiktok.connect();});