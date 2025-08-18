import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser"; // custom hook to get current logged in user
import { useQuery } from "@tanstack/react-query"; // helps with fetching & caching API data
import { getStreamToken } from "../lib/api"; // API call to get Stream token from backend

// Stream chat UI components
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat"; // main Stream client
import toast from "react-hot-toast"; // for showing success/error notifications

import ChatLoader from "../components/ChatLoader"; // custom loading spinner
import CallButton from "../components/CallButton"; // custom button to start call

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY; // Stream API key from .env file

const ChatPage = () => {
  // get target userId from URL (ex: /chat/:id)
  const { id: targetUserId } = useParams();

  // states for chat
  const [chatClient, setChatClient] = useState(null); // holds Stream client instance
  const [channel, setChannel] = useState(null); // holds current chat channel
  const [loading, setLoading] = useState(true); // shows loader while chat is setting up

  // get currently logged in user
  const { authUser } = useAuthUser();

  // fetch Stream token from backend
  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, // only run query when user is logged in
  });

  // main funciton to inicialize chat
  useEffect(() => {
    // function to initialize chat
    const initChat = async () => {
      // if no token or no user → stop here
      if (!tokenData?.token || !authUser) return;

      try {
        console.log("Initializing stream chat client...");

        // create/get Stream client instance
        const client = StreamChat.getInstance(STREAM_API_KEY);

        // connect current user to Stream
        await client.connectUser(
          {
            id: authUser._id, // user id
            name: authUser.fullName, // user name
            image: authUser.profilePic, // user profile picture
          },
          tokenData.token // pass token we got from backend
        );

        // create unique channel id → sort ensures same order for both users
        const channelId = [authUser._id, targetUserId].sort().join("-");

        // create/get chat channel between 2 users
        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId], // members inside this chat
        });

        // start watching channel (listens for messages, updates, etc.)
        await currChannel.watch();

        // save client & channel in state
        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Could not connect to chat. Please try again."); // show error notification
      } finally {
        setLoading(false); // stop loading in any case
      }
    };

    initChat();
  }, [tokenData, authUser, targetUserId]); // re-run effect when these values change

  // handle video call → sends call link as a chat message
  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      // send message in channel with video call link
      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  // show loader while chat client/channel is not ready
  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[93vh]">
      {/* Chat wrapper → provides client instance */}
      <Chat client={chatClient}>
        {/* Channel wrapper → provides channel instance */}
        <Channel channel={channel}>
          <div className="w-full relative">
            {/* button for starting video call */}
            <CallButton handleVideoCall={handleVideoCall} />

            {/* main chat window */}
            <Window>
              <ChannelHeader />{" "}
              {/* shows chat header (user info), profile pic and fullName and also total members login state */}
              <MessageList /> {/* shows all chat messages */}
              <MessageInput focus /> {/* input box to send new message */}
            </Window>
          </div>
          {/* Thread → shows replies for a specific message */}
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
