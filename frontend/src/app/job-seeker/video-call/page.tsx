"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, Users, Plus } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const [meetingId, setMeetingId] = useState("")

  const createMeeting = () => {
    const newMeetingId = Math.random().toString(36).substring(2, 12)
    router.push(`/job-seeker/video-call/meeting/${newMeetingId}`)
  }

  const joinMeeting = (e: React.FormEvent) => {
    e.preventDefault()
    if (meetingId.trim()) {
      router.push(`/job-seeker/video-call/meeting/${meetingId}`)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Video Meet</h1>
          <p className="text-gray-500 mt-2">Simple video conferencing for everyone</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Video className="mr-2 h-5 w-5" />
                New Meeting
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-500 pb-2">Create a new meeting and invite others</CardContent>
            <CardFooter>
              <Button onClick={createMeeting} className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Create Meeting
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Join Meeting
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <form onSubmit={joinMeeting} className="space-y-2">
                <Input
                  placeholder="Enter meeting code"
                  value={meetingId}
                  onChange={(e) => setMeetingId(e.target.value)}
                  className="w-full"
                />
              </form>
            </CardContent>
            <CardFooter>
              <Button onClick={joinMeeting} variant="outline" className="w-full" disabled={!meetingId.trim()}>
                Join
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Need help? Check out our{" "}
            <a href="#" className="text-blue-500 hover:underline">
              documentation
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}














// Old code to delete -----------------------------------

// "use client";

// import React, {
//   CSSProperties,
//   FC,
//   RefObject,
//   useCallback,
//   useEffect,
//   useRef,
//   useState,
//   forwardRef 
// } from "react";
// import Peer, { MediaConnection } from "peerjs";
// import { DndProvider, useDrag, useDrop, XYCoord } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";


// const App: React.FC = () => {
//   const [peerId, setPeerId] = useState<string>("");
//   const [remotePeerIds, setRemotePeerIds] = useState<string[]>([]);
//   const [remoteStreams, setRemoteStreams] = useState<
//     { id: string; stream: MediaStream }[]
//   >([]);
//   // const localVideoRef = useRef<HTMLVideoElement>(null);
//   const localVideoRef: React.RefObject<HTMLVideoElement | null> =
//     useRef<HTMLVideoElement | null>(null);
//   const peerInstance = useRef<Peer | null>(null);
//   const calls = useRef<Map<string, MediaConnection>>(new Map());
//   const [hideSourceOnDrag, setHideSourceOnDrag] = useState(true);
//   const toggle = useCallback(
//     () => setHideSourceOnDrag(!hideSourceOnDrag),
//     [hideSourceOnDrag]
//   );

//   useEffect(() => {
//     const peer = new Peer();

//     peer.on("open", (id) => {
//       setPeerId(id);
//     });

//     peer.on("error", (err) => {
//       console.error("PeerJS error:", err);
//     });

//     peer.on("call", (call) => {
//       navigator.mediaDevices
//         .getUserMedia({ video: true, audio: true })
//         .then((stream) => {
//           if (localVideoRef.current) {
//             localVideoRef.current.srcObject = stream;
//           }
//           call.answer(stream);
//           handleCall(call);
//         })
//         .catch((err) =>
//           console.error("Failed to get local stream for incoming call", err)
//         );
//     });

//     peerInstance.current = peer;

//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((stream) => {
//         if (localVideoRef.current) {
//           localVideoRef.current.srcObject = stream;
//         }
//       })
//       .catch((err) => console.error("Failed to get local stream", err));

//     return () => {
//       peer.destroy();
//       calls.current.forEach((call) => call.close());
//     };
//   }, []);

//   const handleCall = (call: MediaConnection) => {
//     call.on("stream", (remoteStream) => {
//       const peerId = call.peer;
//       setRemoteStreams((prev) => {
//         if (prev.some((s) => s.id === peerId)) return prev;
//         return [...prev, { id: peerId, stream: remoteStream }];
//       });
//       calls.current.set(peerId, call);
//     });

//     call.on("close", () => {
//       setRemoteStreams((prev) => prev.filter((s) => s.id !== call.peer));
//       calls.current.delete(call.peer);
//     });

//     call.on("error", (err) => {
//       console.error(`Call error with ${call.peer}:`, err);
//     });
//   };

//   const callPeers = () => {
//     if (!peerInstance.current || remotePeerIds.length === 0) return;

//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((stream) => {
//         remotePeerIds.forEach((remoteId) => {
//           if (remoteId && !calls.current.has(remoteId)) {
//             const call = peerInstance.current!.call(remoteId.trim(), stream);
//             handleCall(call);
//           }
//         });
//       })
//       .catch((err) =>
//         console.error("Failed to get local stream for call", err)
//       );
//   };

//   const handlePeerIdInput = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const ids = e.target.value
//       .split(",")
//       .map((id) => id.trim())
//       .filter((id) => id);
//     setRemotePeerIds(ids);
//   };

//   return (
//     <div className="h-full p-4">
//       <h1 className="text-3xl font-bold text-center mb-6">
//         Real-Time Video Chat
//       </h1>

//       <DndProvider backend={HTML5Backend}>
//         <VideoElements localVideoRef={localVideoRef} />
//         {/* <DraggableBoxWithContainer /> */}
//       </DndProvider>

//       {/* <div className="grid md:grid-cols-2 gap-6 mb-8">
//         <div className="p-4 rounded-xl shadow-md bg-amber-400">
//           <h2 className="text-xl font-semibold mb-2">Your Video</h2>
//           <video
//             ref={localVideoRef}
//             autoPlay
//             muted
//             playsInline
//             className="w-full rounded-lg"
//           />
//         </div>

//         <div className="p-4 rounded-xl shadow-md" key={"remote.id"}>
//             <h2 className="text-xl font-semibold mb-2">{"remote.id"}</h2>
//             <video
//               // ref={(video) => {
//               //   if (video && video.srcObject !== remote.stream) {
//               //     video.srcObject = remote.stream;
//               //   }
//               // }}
//               autoPlay
//               playsInline
//               className="w-full rounded-lg"
//             />
//           </div>

//       </div>
//        */}
//       {/* {remoteStreams.map((remote) => (
//           <div className="p-4 rounded-xl shadow-md" key={remote.id}>
//             <h2 className="text-xl font-semibold mb-2">{remote.id}</h2>
//             <video
//               ref={(video) => {
//                 if (video && video.srcObject !== remote.stream) {
//                   video.srcObject = remote.stream;
//                 }
//               }}
//               autoPlay
//               playsInline
//               className="w-full rounded-lg"
//             />
//           </div>
//         ))} */}

//       <div className="p-6 rounded-xl shadow-lg">
//         <p className="mb-2">
//           Your Peer ID:{" "}
//           <span className="text-green-400 font-mono">{peerId}</span>
//         </p>
//         <input
//           type="text"
//           value={remotePeerIds.join(",")}
//           onChange={handlePeerIdInput}
//           placeholder="Enter comma-separated peer IDs"
//           className="w-full p-2 mb-4 rounded border-gray-600 placeholder-gray-400"
//         />
//         <button
//           onClick={callPeers}
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
//         >
//           Start Call
//         </button>
//       </div>
//     </div>
//   );
// };

// export default App;


// interface VideoElementsProps {
//   localVideoRef: RefObject<HTMLVideoElement | null>;
// }

// const VideoElements: React.FC<VideoElementsProps> = ({ localVideoRef }) => {
//   return (
//     <div className="relative p-4 rounded-xl shadow-md bg-amber-400 mb-8">
//       <h2 className="text-xl font-semibold mb-2">Your Video</h2>
//       <video
//         ref={localVideoRef}
//         autoPlay
//         muted
//         playsInline
//         className="w-full rounded-lg"
//       />

//       <div className="absolute bottom-4 right-4 w-1/4 max-w-[300px] shadow-lg rounded-lg overflow-hidden border border-white bg-black">
//         <video autoPlay playsInline className="w-full h-auto" />
//       </div>
//     </div>
//   );
// };





























// import React, { useEffect, useRef, useState } from "react";
// import Peer, { MediaConnection } from 'peerjs';

// const page = () => {
//   return (
//     <div className="h-full">
//       <VideoCall />
//     </div>
//   );
// };

// const VideoCall: React.FC = () => {
//   const [peerId, setPeerId] = useState<string>('');
//   const [remotePeerId, setRemotePeerId] = useState<string>('');
//   const [stream, setStream] = useState<MediaStream | undefined>();
//   const userVideo = useRef<HTMLVideoElement>(null);
//   const remoteVideo = useRef<HTMLVideoElement>(null);
//   const peerInstance = useRef<Peer | null>(null);

//   useEffect(() => {
//     // Initialize PeerJS with default public server
//     const peer = new Peer();

//     peer.on('open', (id: string) => {
//       setPeerId(id);
//       console.log('My peer ID is: ' + id);
//     });

//     // Get user media
//     navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//       .then((mediaStream: MediaStream) => {
//         setStream(mediaStream);
//         if (userVideo.current) {
//           userVideo.current.srcObject = mediaStream;
//         }
//       })
//       .catch((err: Error) => console.error('Media error:', err));

//     // Handle incoming calls
//     peer.on('call', (call: MediaConnection) => {
//       navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//         .then((mediaStream: MediaStream) => {
//           call.answer(mediaStream);
//           call.on('stream', (remoteStream: MediaStream) => {
//             if (remoteVideo.current) {
//               remoteVideo.current.srcObject = remoteStream;
//             }
//           });
//         });
//     });

//     peerInstance.current = peer;

//     // Cleanup
//     return () => {
//       if (stream) {
//         stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
//       }
//       peer.destroy();
//     };
//   }, []);

//   const callPeer = (): void => {
//     if (!stream || !remotePeerId || !peerInstance.current) return;

//     const call: MediaConnection = peerInstance.current.call(remotePeerId, stream);
//     call.on('stream', (remoteStream: MediaStream) => {
//       if (remoteVideo.current) {
//         remoteVideo.current.srcObject = remoteStream;
//       }
//     });
//     call.on('error', (err: Error) => console.error('Call error:', err));
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4 text-center">Simple Video Call</h1>
//       <div className="flex flex-wrap justify-center gap-4">
//         <div>
//           <video
//             muted
//             ref={userVideo}
//             autoPlay
//             playsInline
//             className="w-80 h-60 border border-gray-300 rounded-lg shadow-md"
//           />
//           <p className="text-center mt-2">Your ID: {peerId}</p>
//         </div>
//         <div>
//           <video
//             ref={remoteVideo}
//             autoPlay
//             playsInline
//             className="w-80 h-60 border border-gray-300 rounded-lg shadow-md"
//           />
//           <p className="text-center mt-2">Remote Video</p>
//         </div>
//       </div>
//       <div className="mt-4 flex justify-center gap-2">
//         <input
//           type="text"
//           value={remotePeerId}
//           onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRemotePeerId(e.target.value)}
//           placeholder="Enter Peer ID to call"
//           className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <button
//           onClick={callPeer}
//           className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//         >
//           Call
//         </button>
//       </div>
//     </div>
//   );
// };

// export default page;

//

// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import Peer from "peerjs";
// import io, { Socket } from "socket.io-client";
// import { getUserId } from "@/app/api/profile";

// interface VideoCallProps {
//   conversationId: string;
// }

// const page = () => {
//   return (
//     <div className="h-full">
//       <VideoCall conversationId="1" />
//     </div>
//   );
// };

// export default page;

// const VideoCall: React.FC<VideoCallProps> = ({ conversationId }) => {
//   const localVideoRef = useRef<HTMLVideoElement>(null);
//   const remoteVideoRef = useRef<HTMLVideoElement>(null);
//   const [peer, setPeer] = useState<Peer | null>(null);
//   const [socket, setSocket] = useState<Socket | null>(null);

//   useEffect(() => {
//     const initializeSocketAndPeer = async () => {
//       const userId = await fetchUserId();

//       console.log("@@ userId: ", userId);

//       const newSocket = io("http://localhost:5013", { auth: { userId } });
//       setSocket(newSocket);

//       const newPeer = new Peer(userId, {
//         host: "0.peerjs.com",
//         port: 443,
//         secure: true,
//       });
//       console.log(newPeer);
//       setPeer(newPeer);

//       newPeer.on("open", () => {
//         console.log("PeerJS connected, ID:", newPeer.id);
//         console.log("@@ peerjs");

//         newSocket.emit("joinCall", conversationId);
//       });

//       newPeer.on("error", (err) => {
//         console.error("PeerJS error:", err);
//       });

//       newSocket.on("connect", () => {
//         console.log("Socket.IO connected to localhost:5013");
//       });

//       newSocket.on("connect_error", (err) => {
//         console.error("Socket.IO connection error:", err);
//       });

//       newSocket.on("videoCallStarted", ({ participants }) => {
//         console.log("Video call started with participants:", participants);
//         console.log("@@ videocall starting: ", userId, participants);

//         const otherUserId = participants.filter((p: string) => p !== userId)[0];
//         if (otherUserId) {
//           startVideoCall(newPeer, otherUserId);
//         } else {
//           console.error("No other participant found");
//         }
//       });

//       newPeer.on("call", (call) => {
//         console.log("Received a call");
//         navigator.mediaDevices
//           .getUserMedia({ video: true, audio: true })
//           .then((stream) => {
//             if (localVideoRef.current) {
//               localVideoRef.current.srcObject = stream;
//               console.log("Local stream set");
//             }
//             call.answer(stream);
//             call.on("stream", (remoteStream) => {
//               if (remoteVideoRef.current) {
//                 remoteVideoRef.current.srcObject = remoteStream;
//                 console.log("Remote stream set");
//               }
//             });
//           })
//           .catch((err) =>
//             console.log("Failed to get local stream:", err.message)
//           );
//       });

//       return () => {
//         newSocket.disconnect();
//         newPeer.destroy();
//       };
//     };

//     initializeSocketAndPeer();
//   }, [conversationId]);

//   const fetchUserId = async (): Promise<string> => {
//     return await getUserId();
//   };

//   const startDummy = () => {
//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((stream) => {
//         console.log(stream);
//         if (localVideoRef.current) {
//           localVideoRef.current.srcObject = stream;
//           console.log("Local stream set for outgoing call");
//         }
//       })
//       .catch((err) => console.log("Failed to get local stream:", err.message));
//   };

//   const startVideoCall = (peerInstance: Peer, otherUserId: string) => {
//     console.log("Starting call to:", otherUserId);
//     // navigator.mediaDevices
//     //   .getUserMedia({ video: true, audio: true })
//     //   .then((stream) => {
//     //     console.log("@@ stream: ", stream);

//     //     if (localVideoRef.current) {
//     //       localVideoRef.current.srcObject = stream;
//     //       console.log("Local stream set for outgoing call");
//     //     }
//     //     const call = peerInstance.call(otherUserId, stream);
//     //     call.on("stream", (remoteStream) => {
//     //       if (remoteVideoRef.current) {
//     //         remoteVideoRef.current.srcObject = remoteStream;
//     //         console.log("Remote stream received");
//     //       }
//     //     });
//     //   })
//     //   .catch((err) => console.log("Failed to get local stream:", err.message));
//   };

//   return (
//     <div className="w-full">
//       <h2>Video Call</h2>
//       <div className="w-full relative p-10">
//         <video
//           ref={remoteVideoRef}
//           autoPlay
//           className="bg-green-700 h-3/4 w-full rounded-xl"
//         />
//         <video
//           ref={localVideoRef}
//           autoPlay
//           muted
//           className="absolute bottom-20 right-20 bg-amber-700 rounded-xl"
//         />
//       </div>
//       <button
//         onClick={() =>
//           // socket?.emit("startVideoCall", {
//           //   conversationId,
//           // })
//           startDummy()
//         }
//       >
//         Start Call
//       </button>
//     </div>
//   );
// };
