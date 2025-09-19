import { StreamChat } from "stream-chat";

if (!process.env.NEXT_PUBLIC_STREAM_API_KEY) {
  throw new Error("NEXT_PUBLIC_STREAM_API_KEY is not set");
}

//Initialize Server client
const serverClient = StreamChat.getInstance(
  process.env.NEXT_PUBLIC_STREAM_API_KEY,
  process.env.STREAM_API_SECRET
);

export default serverClient;
