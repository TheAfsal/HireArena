"use client";

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import Peer, { MediaConnection } from "peerjs";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Share,
} from "lucide-react";

type StreamData = {
  id: string;
  stream: MediaStream;
};

export default function VideoCall() {
  const { id: meetingId } = useParams<{ id: string }>();
  const [peerId, setPeerId] = useState<string>("");
  const [remoteStreams, setRemoteStreams] = useState<StreamData[]>([]);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
  const [isAudioOn, setIsAudioOn] = useState<boolean>(true);
  const [isSharingScreen, setIsSharingScreen] = useState<boolean>(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const peerInstance = useRef<Peer | null>(null);
  const socketInstance = useRef<Socket | null>(null);
  const calls = useRef<Map<string, MediaConnection>>(new Map());
  const remoteVideoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const localStream = useRef<MediaStream | null>(null);
  const screenStream = useRef<MediaStream | null>(null);

  const getAuthToken = () => localStorage.getItem("authToken");

  const toggleVideo = () => {
    if (localStream.current) {
      const videoTrack = localStream.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    if (isSharingScreen) {
      // Stop screen sharing
      if (screenStream.current) {
        screenStream.current.getTracks().forEach((track) => track.stop());
        screenStream.current = null;
      }
      // Resume camera stream
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localStream.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        setIsVideoOn(true);
        setIsAudioOn(true);
        // Replace stream in existing calls
        calls.current.forEach((call, peerId) => {
          const sender = call.peerConnection
            .getSenders()
            .find((s) => s.track?.kind === "video");
          if (sender && stream.getVideoTracks()[0]) {
            sender.replaceTrack(stream.getVideoTracks()[0]);
          }
        });
        setIsSharingScreen(false);
      } catch (err) {
        console.error("Failed to resume camera stream:", err);
      }
    } else {
      // Start screen sharing
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        screenStream.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        // Replace video track in existing calls
        calls.current.forEach((call, peerId) => {
          const sender = call.peerConnection
            .getSenders()
            .find((s) => s.track?.kind === "video");
          if (sender && stream.getVideoTracks()[0]) {
            sender.replaceTrack(stream.getVideoTracks()[0]);
          }
        });
        // Stop camera stream
        if (localStream.current) {
          localStream.current.getTracks().forEach((track) => track.stop());
          localStream.current = null;
        }
        setIsSharingScreen(true);
        // Handle stream end (e.g., user stops sharing)
        stream.getVideoTracks()[0].onended = () => toggleScreenShare();
      } catch (err) {
        console.error("Failed to start screen sharing:", err);
      }
    }
  };

  const endCall = () => {
    if (peerInstance.current) peerInstance.current.destroy();
    if (socketInstance.current) socketInstance.current.disconnect();
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
    }
    if (screenStream.current) {
      screenStream.current.getTracks().forEach((track) => track.stop());
    }
    calls.current.forEach((call) => call.close());
    window.location.href = "/job-seeker";
  };

  useEffect(() => {
    const peer = new Peer();
    const socket = io(`${process.env.NEXT_PUBLIC_GATEWAY_URL}`, {
      transports: ["websocket"],
      auth: { token: getAuthToken() },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });


    peerInstance.current = peer;
    socketInstance.current = socket;

    peer.on("open", (id) => {
      console.log(`My Peer ID: ${id}`);
      setPeerId(id);
      socket.emit("register-peer", { peerId: id, meetingId });
    });

    peer.on("call", (call) => {
      console.log(`Incoming call from ${call.peer}`);
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          localStream.current = stream;
          if (localVideoRef.current) localVideoRef.current.srcObject = stream;
          call.answer(stream);
          handleCall(call);
        })
        .catch((err) => console.error("Failed to get local stream for call:", err));
    });

    peer.on("error", (err) => console.error("PeerJS error:", err));

    socket.on("available-peers", (peerIds: string[]) => {
      console.log(`Available peers: ${peerIds}`);
      const filteredPeerIds = peerIds.filter((id) => id !== peerId);
      if (filteredPeerIds.length > 0) {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            localStream.current = stream;
            filteredPeerIds.forEach((remoteId) => {
              if (!calls.current.has(remoteId) && peerInstance.current) {
                console.log(`Calling ${remoteId}`);
                const call = peerInstance.current.call(remoteId, stream);
                handleCall(call);
              }
            });
          })
          .catch((err) => console.error("Failed to get local stream:", err));
      }
    });

    socket.on("new-peer", (newPeerId: string) => {
      console.log(`New peer joined: ${newPeerId}`);
      if (newPeerId !== peerId) {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            localStream.current = stream;
            if (!calls.current.has(newPeerId) && peerInstance.current) {
              const call = peerInstance.current.call(newPeerId, stream);
              handleCall(call);
            }
          })
          .catch((err) => console.error("Failed to get local stream:", err));
      }
    });

    socket.on("peer-disconnected", (disconnectedPeerId: string) => {
      console.log(`Peer disconnected: ${disconnectedPeerId}`);
      setRemoteStreams((prev) => prev.filter((s) => s.id !== disconnectedPeerId));
      calls.current.get(disconnectedPeerId)?.close();
      calls.current.delete(disconnectedPeerId);
      remoteVideoRefs.current.delete(disconnectedPeerId);
    });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStream.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      })
      .catch((err) => console.error("Failed to get local stream:", err));

    return () => {
      console.log("Cleaning up...");
      peer.destroy();
      socket.disconnect();
      calls.current.forEach((call) => call.close());
      remoteVideoRefs.current.clear();
      if (localStream.current) {
        localStream.current.getTracks().forEach((track) => track.stop());
      }
      if (screenStream.current) {
        screenStream.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [meetingId]);

  const handleCall = (call: MediaConnection) => {
    call.on("stream", (remoteStream) => {
      console.log(`Received stream from ${call.peer}`);
      const peerId = call.peer;
      setRemoteStreams((prev) => {
        if (prev.some((s) => s.id === peerId)) return prev;
        return [...prev, { id: peerId, stream: remoteStream }];
      });
      calls.current.set(peerId, call);
      const videoEl = remoteVideoRefs.current.get(peerId);
      if (videoEl) videoEl.srcObject = remoteStream;
    });

    call.on("close", () => {
      console.log(`Call closed with ${call.peer}`);
      setRemoteStreams((prev) => prev.filter((s) => s.id !== call.peer));
      calls.current.delete(call.peer);
      remoteVideoRefs.current.delete(call.peer);
    });

    call.on("error", (err) => console.error(`Call error with ${call.peer}:`, err));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-semibold text-gray-800">
            Meeting Room: {meetingId}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Participants: {remoteStreams.length + 1}
          </span>
        </div>
      </header>

      {/* Main Video Area */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
          {/* Local Video */}
          <div className="relative bg-black rounded-lg overflow-hidden shadow-lg">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              You {isSharingScreen ? "(Screen Sharing)" : ""}
            </div>
            {!isVideoOn && !isSharingScreen && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                <Avatar className="w-16 h-16">
                  <AvatarFallback>You</AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>

          {/* Remote Videos */}
          {remoteStreams.map((remote) => (
            <div
              key={remote.id}
              className="relative bg-black rounded-lg overflow-hidden shadow-lg"
            >
              <video
                ref={(video) => {
                  if (video) {
                    remoteVideoRefs.current.set(remote.id, video);
                    if (video.srcObject !== remote.stream) {
                      video.srcObject = remote.stream;
                    }
                  }
                }}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                {remote.id}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Control Bar */}
      <footer className="bg-white shadow-t p-4 flex justify-center items-center space-x-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isAudioOn ? "default" : "destructive"}
                size="icon"
                onClick={toggleAudio}
                className={isAudioOn ? "bg-gray-800 hover:bg-gray-700" : ""}
              >
                {isAudioOn ? (
                  <Mic className="h-5 w-5" />
                ) : (
                  <MicOff className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isAudioOn ? "Mute microphone" : "Unmute microphone"}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isVideoOn ? "default" : "destructive"}
                size="icon"
                onClick={toggleVideo}
                className={isVideoOn ? "bg-gray-800 hover:bg-gray-700" : ""}
                disabled={isSharingScreen}
              >
                {isVideoOn ? (
                  <Video className="h-5 w-5" />
                ) : (
                  <VideoOff className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isVideoOn ? "Turn off video" : "Turn on video"}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isSharingScreen ? "destructive" : "default"}
                size="icon"
                onClick={toggleScreenShare}
                className={isSharingScreen ? "" : "bg-gray-800 hover:bg-gray-700"}
              >
                <Share className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isSharingScreen ? "Stop sharing screen" : "Share screen"}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                onClick={endCall}
                className="bg-red-600 hover:bg-red-700"
              >
                <PhoneOff className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>End call</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </footer>
    </div>
  );
}


// "use client";

// import { useEffect, useState, useRef } from "react";
// import { io, Socket } from "socket.io-client";
// import Peer, { MediaConnection } from "peerjs";

// import { useParams } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Input } from "@/components/ui/input";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Mic,
//   MicOff,
//   Video,
//   VideoOff,
//   PhoneOff,
//   MessageSquare,
//   Users,
//   Share,
//   MoreVertical,
//   Send,
//   Copy,
// } from "lucide-react";
// import { useMobile } from "@/hooks/use-mobile";

// type Participant = {
//   id: string;
//   name: string;
//   stream?: MediaStream;
//   audio: boolean;
//   video: boolean;
// };

// type StreamData = {
//   id: string;
//   stream: MediaStream;
// };

// export default function VideoCall() {
//   const { id: meetingId } = useParams<{ id: string }>(); // Get meetingId from URL
//   const [peerId, setPeerId] = useState<string>("");
//   const [remoteStreams, setRemoteStreams] = useState<StreamData[]>([]);
//   const localVideoRef = useRef<HTMLVideoElement>(null);
//   const peerInstance = useRef<Peer | null>(null);
//   const socketInstance = useRef<Socket | null>(null);
//   const calls = useRef<Map<string, MediaConnection>>(new Map());
//   const remoteVideoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

//   const getAuthToken = () => localStorage.getItem("authToken");

//   useEffect(() => {
//     const peer = new Peer();
//     const socket = io(`${process.env.NEXT_PUBLIC_VIDEO_SERVER_URL}`, {
//       auth: { token: getAuthToken() },
//     });

//     peerInstance.current = peer;
//     socketInstance.current = socket;

//     // PeerJS setup
//     peer.on("open", (id) => {
//       console.log(`My Peer ID: ${id}`);
//       setPeerId(id);
//       socket.emit("register-peer", { peerId: id, meetingId });
//     });

//     peer.on("call", (call) => {
//       console.log(`Incoming call from ${call.peer}`);
//       navigator.mediaDevices
//         .getUserMedia({ video: true, audio: true })
//         .then((stream) => {
//           if (localVideoRef.current) localVideoRef.current.srcObject = stream;
//           call.answer(stream);
//           handleCall(call);
//         })
//         .catch((err) =>
//           console.error("Failed to get local stream for call:", err)
//         );
//     });

//     peer.on("error", (err) => console.error("PeerJS error:", err));

//     // Socket.IO events
//     socket.on("available-peers", (peerIds: string[]) => {
//       console.log(`Available peers: ${peerIds}`);
//       const filteredPeerIds = peerIds.filter((id) => id !== peerId);
//       if (filteredPeerIds.length > 0) {
//         navigator.mediaDevices
//           .getUserMedia({ video: true, audio: true })
//           .then((stream) => {
//             filteredPeerIds.forEach((remoteId) => {
//               if (!calls.current.has(remoteId) && peerInstance.current) {
//                 console.log(`Calling ${remoteId}`);
//                 const call = peerInstance.current.call(remoteId, stream);
//                 handleCall(call);
//               }
//             });
//           })
//           .catch((err) => console.error("Failed to get local stream:", err));
//       }
//     });

//     socket.on("new-peer", (newPeerId: string) => {
//       console.log(`New peer joined: ${newPeerId}`);
//       if (newPeerId !== peerId) {
//         navigator.mediaDevices
//           .getUserMedia({ video: true, audio: true })
//           .then((stream) => {
//             if (!calls.current.has(newPeerId) && peerInstance.current) {
//               const call = peerInstance.current.call(newPeerId, stream);
//               handleCall(call);
//             }
//           })
//           .catch((err) => console.error("Failed to get local stream:", err));
//       }
//     });

//     socket.on("peer-disconnected", (disconnectedPeerId: string) => {
//       console.log(`Peer disconnected: ${disconnectedPeerId}`);
//       setRemoteStreams((prev) =>
//         prev.filter((s) => s.id !== disconnectedPeerId)
//       );
//       calls.current.get(disconnectedPeerId)?.close();
//       calls.current.delete(disconnectedPeerId);
//       remoteVideoRefs.current.delete(disconnectedPeerId);
//     });

//     // Get local media on mount
//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((stream) => {
//         if (localVideoRef.current) localVideoRef.current.srcObject = stream;
//       })
//       .catch((err) => console.error("Failed to get local stream:", err));

//     // Cleanup
//     return () => {
//       console.log("Cleaning up...");
//       peer.destroy();
//       socket.disconnect();
//       calls.current.forEach((call) => call.close());
//       remoteVideoRefs.current.clear();
//     };
//   }, [meetingId]);

//   const handleCall = (call: MediaConnection) => {
//     call.on("stream", (remoteStream) => {
//       console.log(`Received stream from ${call.peer}`);
//       const peerId = call.peer;
//       setRemoteStreams((prev) => {
//         if (prev.some((s) => s.id === peerId)) return prev;
//         return [...prev, { id: peerId, stream: remoteStream }];
//       });
//       calls.current.set(peerId, call);
//       const videoEl = remoteVideoRefs.current.get(peerId);
//       if (videoEl) videoEl.srcObject = remoteStream;
//     });

//     call.on("close", () => {
//       console.log(`Call closed with ${call.peer}`);
//       setRemoteStreams((prev) => prev.filter((s) => s.id !== call.peer));
//       calls.current.delete(call.peer);
//       remoteVideoRefs.current.delete(call.peer);
//     });

//     call.on("error", (err) =>
//       console.error(`Call error with ${call.peer}:`, err)
//     );
//   };

//   return (
//     <div className="App" style={{ padding: "20px" }}>
//       <h1>Video Call App (Meeting Room: {meetingId})</h1>
//       <div
//         className="video-container"
//         style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}
//       >
//         <div className="video-box" style={{ width: "300px" }}>
//           <h3>Your Video</h3>
//           <video
//             ref={localVideoRef}
//             autoPlay
//             muted
//             playsInline
//             style={{ width: "100%", borderRadius: "8px" }}
//           />
//         </div>
//         {remoteStreams.map((remote) => (
//           <div className="video-box" key={remote.id} style={{ width: "300px" }}>
//             <h3>{remote.id}</h3>
//             <video
//               ref={(video) => {
//                 if (video) {
//                   remoteVideoRefs.current.set(remote.id, video);
//                   if (video.srcObject !== remote.stream) {
//                     video.srcObject = remote.stream;
//                   }
//                 }
//               }}
//               autoPlay
//               playsInline
//               style={{ width: "100%", borderRadius: "8px" }}
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }























































// <div className="flex flex-col h-full bg-gray-50">
//   <header className="bg-white border-b p-4 flex justify-between items-center">
//     <h1 className="text-xl font-semibold">Video Meet</h1>
//     <div className="flex items-center space-x-2">
//       <span className="text-sm text-gray-500">Meeting ID: {meetingId}</span>
//       <TooltipProvider>
//         <Tooltip>
//           <TooltipTrigger asChild>
//             {/* <Button variant="ghost" size="icon" onClick={copyMeetingLink}> */}
//             <Button variant="ghost" size="icon">
//               <Copy className="h-4 w-4" />
//             </Button>
//           </TooltipTrigger>
//           <TooltipContent>
//             <p>Copy meeting link</p>
//           </TooltipContent>
//         </Tooltip>
//       </TooltipProvider>
//     </div>
//   </header>

//   {/* Main content */}
//   <div className="flex flex-1 overflow-hidden">
//     {/* Video grid */}
//     <div className="flex-1 p-4 overflow-auto">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
//         {/* Your video */}
//         <div className="relative bg-black rounded-lg overflow-hidden">
//           <video
//             ref={videoRef}
//             autoPlay
//             muted
//             playsInline
//             className={`w-full h-full object-cover ${
//               !videoEnabled ? "hidden" : ""
//             }`}
//           />
//           {!videoEnabled && (
//             <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
//               <Avatar className="h-24 w-24">
//                 <AvatarFallback>You</AvatarFallback>
//               </Avatar>
//             </div>
//           )}
//           <div className="absolute bottom-2 left-2 bg-gray-800 bg-opacity-60 px-2 py-1 rounded text-white text-sm flex items-center">
//             <span>You</span>
//             {!audioEnabled && (
//               <MicOff className="h-4 w-4 ml-2 text-red-500" />
//             )}
//           </div>
//         </div>

//         {remoteStreams.map((remote) => (
//           <div className="video-box" key={remote.id}>
//             <h3>{remote.id}</h3>
//             <video
//               ref={(video) => {
//                 if (video && video.srcObject !== remote.stream) {
//                   video.srcObject = remote.stream;
//                 }
//               }}
//               autoPlay
//               playsInline
//             />
//           </div>
//         ))}

//         {/* Other participants */}
//         {participants
//           .filter((p) => p.id !== "local-user")
//           .map((participant) => (
//             <div
//               key={participant.id}
//               className="relative bg-black rounded-lg overflow-hidden"
//             >
//               {participant.video ? (
//                 <img
//                   src={`/placeholder.svg?height=480&width=640&text=${participant.name}`}
//                   alt={participant.name}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
//                   <Avatar className="h-24 w-24">
//                     <AvatarFallback>
//                       {participant.name.charAt(0)}
//                     </AvatarFallback>
//                   </Avatar>
//                 </div>
//               )}
//               <div className="absolute bottom-2 left-2 bg-gray-800 bg-opacity-60 px-2 py-1 rounded text-white text-sm flex items-center">
//                 <span>{participant.name}</span>
//                 {!participant.audio && (
//                   <MicOff className="h-4 w-4 ml-2 text-red-500" />
//                 )}
//               </div>
//             </div>
//           ))}
//         {/* Screen sharing */}
//         {isScreenSharing && screenStream && (
//           <div className="relative bg-black rounded-lg overflow-hidden col-span-1 md:col-span-2 lg:col-span-3 row-span-2">
//             <video
//               autoPlay
//               playsInline
//               className="w-full h-full object-contain"
//               ref={(video) => {
//                 if (video && screenStream) {
//                   video.srcObject = screenStream;
//                 }
//               }}
//             />
//             <div className="absolute top-2 right-2 bg-gray-800 bg-opacity-60 px-2 py-1 rounded text-white text-sm flex items-center">
//               <Share className="h-4 w-4 mr-2" />
//               <span>You are sharing your screen</span>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>

//     {/* Side panel (only visible on desktop or when active on mobile) */}
//     {(!isMobile || activeTab !== "none") && (
//       <div className="w-full md:w-80 bg-white border-l flex flex-col">
//         <Tabs
//           value={activeTab}
//           onValueChange={setActiveTab}
//           className="flex flex-col h-full"
//         >
//           <TabsList className="grid grid-cols-2 mx-4 my-2">
//             <TabsTrigger value="participants" className="flex items-center">
//               <Users className="h-4 w-4 mr-2" />
//               Participants ({participants.length})
//             </TabsTrigger>
//             <TabsTrigger value="chat" className="flex items-center">
//               <MessageSquare className="h-4 w-4 mr-2" />
//               Chat
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent
//             value="participants"
//             className="flex-1 overflow-hidden flex flex-col p-4"
//           >
//             <ScrollArea className="flex-1">
//               {participants.map((participant) => (
//                 <div
//                   key={participant.id}
//                   className="flex items-center justify-between py-2"
//                 >
//                   <div className="flex items-center">
//                     <Avatar className="h-8 w-8 mr-2">
//                       <AvatarFallback>
//                         {participant.name.charAt(0)}
//                       </AvatarFallback>
//                     </Avatar>
//                     <span>{participant.name}</span>
//                   </div>
//                   <div className="flex space-x-1">
//                     {participant.audio ? (
//                       <Mic className="h-4 w-4 text-gray-500" />
//                     ) : (
//                       <MicOff className="h-4 w-4 text-red-500" />
//                     )}
//                     {participant.video ? (
//                       <Video className="h-4 w-4 text-gray-500" />
//                     ) : (
//                       <VideoOff className="h-4 w-4 text-red-500" />
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </ScrollArea>
//           </TabsContent>

//           <TabsContent
//             value="chat"
//             className="flex-1 overflow-hidden flex flex-col p-0"
//           >
//             <ScrollArea className="flex-1 p-4">
//               {chatMessages.length === 0 ? (
//                 <div className="text-center text-gray-500 mt-8">
//                   <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
//                   <p>No messages yet</p>
//                   <p className="text-sm">Be the first to send a message!</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {chatMessages.map((msg, index) => (
//                     <div key={index} className="flex flex-col">
//                       <div className="flex items-center">
//                         <span className="font-medium">{msg.sender}</span>
//                         <span className="text-xs text-gray-500 ml-2">
//                           {msg.time}
//                         </span>
//                       </div>
//                       <p className="text-sm mt-1">{msg.text}</p>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </ScrollArea>

//             <div className="p-4 border-t">
//               {/* <form onSubmit={sendMessage} className="flex space-x-2"> */}
//               <form className="flex space-x-2">
//                 <Input
//                   value={newMessage}
//                   onChange={(e) => setNewMessage(e.target.value)}
//                   placeholder="Type a message..."
//                   className="flex-1"
//                 />
//                 <Button
//                   type="submit"
//                   size="icon"
//                   disabled={!newMessage.trim()}
//                 >
//                   <Send className="h-4 w-4" />
//                 </Button>
//               </form>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>
//     )}
//   </div>

//   {/* Controls */}
//   <footer className="bg-white border-t p-4 flex justify-center">
//     <div className="flex items-center space-x-2 md:space-x-4">
//       <TooltipProvider>
//         <Tooltip>
//           <TooltipTrigger asChild>
//             <Button
//               //   onClick={toggleAudio}
//               variant={audioEnabled ? "outline" : "destructive"}
//               size="icon"
//               className="rounded-full h-12 w-12"
//             >
//               {audioEnabled ? (
//                 <Mic className="h-5 w-5" />
//               ) : (
//                 <MicOff className="h-5 w-5" />
//               )}
//             </Button>
//           </TooltipTrigger>
//           <TooltipContent>
//             <p>{audioEnabled ? "Mute microphone" : "Unmute microphone"}</p>
//           </TooltipContent>
//         </Tooltip>
//       </TooltipProvider>

//       <TooltipProvider>
//         <Tooltip>
//           <TooltipTrigger asChild>
//             <Button
//               //   onClick={toggleVideo}
//               variant={videoEnabled ? "outline" : "destructive"}
//               size="icon"
//               className="rounded-full h-12 w-12"
//             >
//               {videoEnabled ? (
//                 <Video className="h-5 w-5" />
//               ) : (
//                 <VideoOff className="h-5 w-5" />
//               )}
//             </Button>
//           </TooltipTrigger>
//           <TooltipContent>
//             <p>{videoEnabled ? "Turn off camera" : "Turn on camera"}</p>
//           </TooltipContent>
//         </Tooltip>
//       </TooltipProvider>

//       {isMobile && (
//         <TooltipProvider>
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Button
//                 onClick={() =>
//                   setActiveTab(
//                     activeTab === "none" ? "participants" : "none"
//                   )
//                 }
//                 variant="outline"
//                 size="icon"
//                 className="rounded-full h-12 w-12"
//               >
//                 {activeTab === "participants" || activeTab === "chat" ? (
//                   <Users className="h-5 w-5" />
//                 ) : (
//                   <MessageSquare className="h-5 w-5" />
//                 )}
//               </Button>
//             </TooltipTrigger>
//             <TooltipContent>
//               <p>Toggle side panel</p>
//             </TooltipContent>
//           </Tooltip>
//         </TooltipProvider>
//       )}

//       <TooltipProvider>
//         <Tooltip>
//           <TooltipTrigger asChild>
//             <Button
//               //   onClick={toggleScreenShare}
//               variant={isScreenSharing ? "destructive" : "outline"}
//               size="icon"
//               className="rounded-full h-12 w-12"
//             >
//               <Share className="h-5 w-5" />
//             </Button>
//           </TooltipTrigger>
//           <TooltipContent>
//             <p>{isScreenSharing ? "Stop sharing" : "Share screen"}</p>
//           </TooltipContent>
//         </Tooltip>
//       </TooltipProvider>

//       <TooltipProvider>
//         <Tooltip>
//           <TooltipTrigger asChild>
//             <Button
//               variant="outline"
//               size="icon"
//               className="rounded-full h-12 w-12"
//             >
//               <MoreVertical className="h-5 w-5" />
//             </Button>
//           </TooltipTrigger>
//           <TooltipContent>
//             <p>More options</p>
//           </TooltipContent>
//         </Tooltip>
//       </TooltipProvider>

//       <TooltipProvider>
//         <Tooltip>
//           <TooltipTrigger asChild>
//             {/* <Button onClick={endCall} variant="destructive" size="icon" className="rounded-full h-12 w-12"> */}
//             <Button
//               variant="destructive"
//               size="icon"
//               className="rounded-full h-12 w-12"
//             >
//               <PhoneOff className="h-5 w-5" />
//             </Button>
//           </TooltipTrigger>
//           <TooltipContent>
//             <p>End call</p>
//           </TooltipContent>
//         </Tooltip>
//       </TooltipProvider>
//     </div>
//   </footer>
// </div>
//   );
// }
