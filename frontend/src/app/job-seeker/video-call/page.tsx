import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import io, { Socket } from "socket.io-client";

interface VideoCallProps {
  conversationId: string;
  userId: string;
}

const VideoCall: React.FC<VideoCallProps> = ({ conversationId, userId }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [peer, setPeer] = useState<Peer | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5012", { auth: { userId } });
    setSocket(newSocket);

    const newPeer = new Peer(userId, { host: "localhost", port: 5012, path: "/peerjs" });
    setPeer(newPeer);

    newSocket.on("videoCallStarted", () => {
      startVideoCall(newPeer, newSocket);
    });

    newPeer.on("open", () => {
      newSocket.emit("joinRoom", conversationId);
      newSocket.emit("startVideoCall", conversationId);
    });

    newPeer.on("call", (call) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (localVideoRef.current) localVideoRef.current.srcObject = stream;
          call.answer(stream);
          call.on("stream", (remoteStream) => {
            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
          });
        })
        .catch((err) => console.error("Failed to get local stream", err));
    });

    return () => {
      newSocket.disconnect();
      newPeer.destroy();
    };
  }, [conversationId, userId]);

  const startVideoCall = (peerInstance: Peer, socketInstance: Socket) => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        const otherUser = socketInstance.id === userId ? "other-user-id" : userId; // Replace with logic to get other participant
        const call = peerInstance.call(otherUser, stream);
        call.on("stream", (remoteStream) => {
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
        });
      })
      .catch((err) => console.error("Failed to get local stream", err));
  };

  return (
    <div>
      <h2>Video Call</h2>
      <video ref={localVideoRef} autoPlay muted style={{ width: "300px" }} />
      <video ref={remoteVideoRef} autoPlay style={{ width: "300px" }} />
    </div>
  );
};

export default VideoCall;