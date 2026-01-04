import { Server } from "socket.io";
import User from "../models/user.model.js"; 


//Map to find user is online or not - > userId , socketId

let onlineUsers = new Map();

//Map to track typing status of users in conversation --> userId,[conversation]



export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
      methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    },
    pingTimeout: 60000, // Disconnect user automatically offline in under 60 sec
  });

  io.on("connection", (socket) => {
    console.log("User is connected to SocketId", socket.id);

    let userId = null;

    //handle user connection and show mark thrm online in db

    try {
      socket.on("user_connected", async (connectionUserId) => {
        if (!connectionUserId) {
          console.warn("❌ user_connected called without userId");
          return;
        }

        userId = connectionUserId;
        onlineUsers.set(userId, socket.id);
        socket.join(userId);

        await User.findByIdAndUpdate(userId, {
          isOnline: true,
          lastSeen: new Date(),
        });

        io.emit("user_status", {
          userId,
          isOnline: true,
          lastSeen: null,
        });
      });
    } catch (error) {
      console.error(
        "Error while establishing user connection in socket",
        error.message
      );
    }

    //Return online Status of requested User

    socket.on("get_user_status", (requestUserId, callback) => {
      let isOnline = onlineUsers.has(requestUserId);
      callback({
        userId: requestUserId,
        isOnline: isOnline,
        lastSeen: isOnline ? new Date() : null,
      });
    });

 

    const handleDisconnect = async () => {
      try {
        if (!userId) return;

        onlineUsers.delete(userId);

       

        await User.findByIdAndUpdate(userId, {
          isOnline: false,
          lastSeen: new Date(),
        });

        io.emit("user_status", {
          userId,
          isOnline: false,
          lastSeen: new Date(),
        });

        socket.leave(userId), console.log(`user ${userId} disconnected`);
      } catch (error) {
        console.error("Error handling disconnection", error.message);
      }
    };

    //disconnect event

    socket.on("disconnect", handleDisconnect);



  });

  io.socketUserMap = onlineUsers;

  return io;
};