"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { useCreateNewChat } from "@/hooks/useCreateNewChat";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useChatContext } from "stream-chat-react";

export function NewChatDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Doc<"users">[]>([]);
  const [groupName, setGroupName] = useState("");
  const createNewChat = useCreateNewChat();
  const { user } = useUser();
  const setActiveChannel = useChatContext;

  const handleSelectUser = (user: Doc<"users">) => {
    //Avoid adding the same user twice
    if (!selectedUsers.find((u) => u._id === user._id)) {
      setSelectedUsers((prev) => [...prev, user]);
    }
  };

  const removeUser = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((user) => user._id !== userId));
  };

  return <>{children}</>;
}
