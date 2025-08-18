import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

// Stream Video SDK imports
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css"; // Stream SDK default styles
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader"

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  // Extract "id" from route params → e.g., /call/123 → callId = 123
  const { id: callId } = useParams();

  // State variables
  const [client, setClient] = useState(null); // will store StreamVideoClient instance
  const [call, setCall] = useState(null); // will store the current call instance
  const [isConnecting, setIsConnecting] = useState(true); // loader state while connecting

  const { authUser, isLoading } = useAuthUser(); // fetch login user details using custom hook

  // Fetch Stream token for authenticated user
  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"], // cache key
    queryFn: getStreamToken,
    enabled: !!authUser, // run only if user is logged in
  });

  useEffect(() => {
    /**
     * Main function to initialize and join a video call.
     * Steps:
     * 1. Make sure we have everything required → user, token, and callId from URL.
     * 2. Create a Stream video client instance with API key + user + token.
     * 3. Create a "call instance" (like a meeting room) using callId.
     * 4. Join the call. If it doesn’t exist, "create: true" makes a new one.
     * 5. Save client and call to state, so React can render the call UI.
     * 6. Handle errors (if token invalid, call failed, etc.) gracefully.
     */
    const initCall = async () => {
      // Guard: if no token, no user, or no callId → don’t proceed
      if (!tokenData?.token || !authUser || !client) return;

      try {
        console.log("Initializing Stream video client...");

        // Prepare user details for Stream service
        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        };

        // Create a Stream video client → represents the logged-in user session
        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        });

        // Create/initialize a "call room" using the callId
        // "default" is call type → Stream supports different layouts/types
        const callInstance = videoClient.call("default", callId);

        // Join the call (if room doesn’t exist → it gets created automatically)
        await callInstance.join({ create: true });

        console.log("Joined call successfully");

        // Save instances to state → this triggers UI rendering
        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        // If something breaks (invalid token, connection issue, etc.)
        console.error("Error joining call:", error);
        toast.error("Could not join the call. Please try again.");
      } finally {
        // Hide loading spinner no matter success or fail
        setIsConnecting(false);
      }
    };
    initCall();
  }, [tokenData, authUser, callId]);

  // Show loader until either user is loading or connection is being established
    if (isLoading || isConnecting) return <PageLoader />;

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="relative">
        {client && call ? ( // Stream requires wrapping UI with client + call providers
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          // Fallback if call couldn’t initialize
          <div className="flex items-center justify-center h-full">
            <p>Could not initialize call. Please refresh or try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState(); // Track if user joined/left the call

  const navigate = useNavigate();

  // If user leaves the call, redirect them back to home
  if (callingState === CallingState.LEFT) return navigate("/");

  return (
    // This is like a wrapper that applies Stream’s default UI theme (colors, layout, buttons).
    <StreamTheme>
      {/* Speaker layout shows active speaker video + grid */}
      <SpeakerLayout />
      {/* Call controls → mute, camera on/off, leave button, etc. */}
      <CallControls />
    </StreamTheme>
  );
};

export default CallPage;
