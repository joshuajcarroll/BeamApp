// components/VideoCallPage.tsx (or your primary video call component)

"use client";

import React, { useState } from "react";
import {
  // Stream Video SDK components
  Call,
  CallContent,
  CallControls,
  SpeakerLayout,
  StreamCall,
  CallingState,
  ParticipantsList,
} from "@stream-io/video-react-sdk";
import {
  // Stream Chat SDK components
  Channel,
  MessageList,
  MessageInput,
} from "stream-chat-react";

// Custom components and context for translation
import { TranslatedMessage } from "@/components/TranslatedMessage";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/context/LanguageContext";

// --- Component to render the Video Call and Chat UI with Translation ---

interface VideoCallPageProps {
  // The Stream Call object passed from the parent component
  call: Call;
  // The Stream Chat Channel object for this specific call
  chatChannel: any;
}

export const VideoCallPage = ({ call, chatChannel }: VideoCallPageProps) => {
  // Get the current user's preferred language from the context
  const { currentLanguage } = useLanguage();
  const [showChat, setShowChat] = useState(true);

  // Display a loading state if the call hasn't fully joined
  if (call.state.callingState !== CallingState.JOINED) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white text-xl">
        Joining call...
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-gray-900">
      {/* 1. Main Video Area */}
      <div
        className={`flex-1 ${showChat ? "lg:w-3/4" : "w-full"} p-2 transition-all duration-300`}
      >
        {/* StreamCall context for all video-related components */}
        <StreamCall call={call}>
          <div className="relative h-full rounded-xl overflow-hidden shadow-2xl">
            {/* The primary video layout and stream content */}
            <CallContent
              CallControls={CallControls}
              SpeakerLayout={SpeakerLayout}
              className="h-full w-full"
            />

            {/* Floating Controls at the bottom */}
            <div className="absolute bottom-4 w-full flex justify-center z-10">
              <CallControls />
            </div>

            {/* Floating Language Selector for the user to choose their preferred display language */}
            <div className="absolute top-4 left-4 z-10">
              <LanguageSelector />
            </div>

            {/* Chat Toggle Button */}
            <button
              onClick={() => setShowChat((prev) => !prev)}
              className="absolute top-4 right-4 z-10 p-2 bg-gray-700/70 text-white rounded-full hover:bg-gray-700 transition"
              title={showChat ? "Hide Chat" : "Show Chat"}
            >
              {showChat ? "✖" : "💬"}
            </button>
          </div>
        </StreamCall>
      </div>

      {/* 2. Side Chat Panel */}
      {showChat && (
        <div className="w-full lg:w-1/4 h-screen p-4 bg-gray-800 flex flex-col transition-all duration-300">
          <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">
            Live Chat 💬
          </h2>
          <div className="text-sm text-gray-400 mb-4">
            Displaying translations in:{" "}
            <span className="font-bold text-teal-400">{currentLanguage}</span>
          </div>

          {/* Stream Chat Channel context for the message list and input */}
          <Channel channel={chatChannel}>
            {/* MessageList uses the custom TranslatedMessage component.
                  This component is responsible for checking the message.custom 
                  field for a translation matching 'currentLanguage' and displaying it.
                */}
            <MessageList
              Message={TranslatedMessage}
              className="flex-1 overflow-y-auto"
            />

            {/* The MessageInput sends the message, which your backend webhook 
                    then intercepts, translates using DeepL, and updates. 
                */}
            <MessageInput />
          </Channel>
        </div>
      )}
    </div>
  );
};
