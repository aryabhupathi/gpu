"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  TextField,
  IconButton,
  Divider,
} from "@mui/material";
import { Send } from "@mui/icons-material";
import {
  getConversations,
  getMessages,
  sendMessage,
} from "@/actions/messageActions";
export interface MessageUser {
  id: string;
  name: string | null;
  image: string | null;
}

export interface MessageData {
  id: string;
  content: string;
  senderId: string;
  createdAt: Date;
}

export interface ConversationData {
  id: string;
  otherUser: MessageUser;
  lastMessage?: { content: string };
}

export default function MessagesClient({
  currentUser,
  mutuals,
}: {
  currentUser: MessageUser;
  mutuals: MessageUser[];
}) {
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [activeUser, setActiveUser] = useState<MessageUser | null>(null);
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fetchConvos = async () => {
      const convos = await getConversations();
      setConversations(convos);
    };
    fetchConvos();
    const interval = setInterval(fetchConvos, 5000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const fetchActiveMessages = async () => {
      if (activeConvoId) {
        const msgs = await getMessages(activeConvoId);
        setMessages(msgs);
      } else if (activeUser) {
        const convo = conversations.find(
          (c) => c.otherUser.id === activeUser.id,
        );
        if (convo) {
          setActiveConvoId(convo.id);
        } else {
          setMessages([]);
        }
      }
    };
    fetchActiveMessages();
    const interval = setInterval(fetchActiveMessages, 3000);
    return () => clearInterval(interval);
  }, [activeConvoId, activeUser, conversations]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeUser) return;
    const text = inputText;
    setInputText("");
    const optimisticMsg = {
      id: "temp",
      content: text,
      senderId: currentUser.id,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    try {
      await sendMessage(activeConvoId, activeUser.id, text);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: { xs: 0, md: 4 },
        p: { xs: 0, md: 2 },
        height: { xs: "calc(100vh - 64px)", md: "80vh" },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          height: "100%",
          borderRadius: { xs: 0, md: 4 },
          border: { md: "1px solid" },
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: 300 },
            borderRight: { md: "1px solid" },
            borderBottom: { xs: "1px solid", md: "none" },
            borderColor: "divider",
            bgcolor: "background.default",
            display: { xs: activeUser ? "none" : "flex", md: "flex" },
            flexDirection: "column",
            height: { xs: "100%", md: "auto" },
          }}
        >
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="h6" fontWeight={800} color="text.primary">
              Messages
            </Typography>
          </Box>
          <List sx={{ flexGrow: 1, overflowY: "auto" }}>
            <Typography
              variant="overline"
              sx={{ px: 2, color: "text.secondary" }}
            >
              Mutuals
            </Typography>
            {mutuals.map((user) => (
              <ListItem
                key={`m-${user.id}`}
                component="div"
                onClick={() => {
                  setActiveUser(user);
                  setActiveConvoId(null);
                }}
                sx={{
                  cursor: "pointer",
                  bgcolor:
                    activeUser?.id === user.id
                      ? "action.selected"
                      : "transparent",
                }}
              >
                <ListItemAvatar>
                  <Avatar src={user.image || ""}>
                    {user.name?.charAt(0) || "U"}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user.name || "Anonymous"}
                  primaryTypographyProps={{ color: "text.primary" }}
                />
              </ListItem>
            ))}
            <Divider sx={{ my: 1 }} />
            <Typography
              variant="overline"
              sx={{ px: 2, color: "text.secondary" }}
            >
              Recent Chats
            </Typography>
            {conversations.map((convo) => (
              <ListItem
                key={convo.id}
                component="div"
                onClick={() => {
                  setActiveUser(convo.otherUser);
                  setActiveConvoId(convo.id);
                }}
                sx={{
                  cursor: "pointer",
                  bgcolor:
                    activeConvoId === convo.id
                      ? "action.selected"
                      : "transparent",
                }}
              >
                <ListItemAvatar>
                  <Avatar src={convo.otherUser.image || ""}>
                    {convo.otherUser.name?.charAt(0) || "U"}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={convo.otherUser.name || "Anonymous"}
                  secondary={convo.lastMessage?.content || "Say hi!"}
                  primaryTypographyProps={{ color: "text.primary" }}
                  secondaryTypographyProps={{
                    noWrap: true,
                    color: "text.secondary",
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            display: { xs: activeUser ? "flex" : "none", md: "flex" },
            flexDirection: "column",
            bgcolor: "background.paper",
            height: { xs: "100%", md: "auto" },
          }}
        >
          {activeUser ? (
            <>
              <Box
                sx={{
                  p: 2,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <IconButton
                  onClick={() => setActiveUser(null)}
                  sx={{ display: { md: "none" }, color: "text.primary" }}
                >
                  <span style={{ fontSize: "1.2rem" }}>←</span>
                </IconButton>
                <Avatar src={activeUser.image || ""}>
                  {activeUser.name?.charAt(0) || "U"}
                </Avatar>
                <Typography variant="h6" fontWeight={700} color="text.primary">
                  {activeUser.name || "Anonymous"}
                </Typography>
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  overflowY: "auto",
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {messages.map((msg, i) => {
                  const isMe = msg.senderId === currentUser.id;
                  return (
                    <Box
                      key={msg.id || i}
                      sx={{
                        display: "flex",
                        justifyContent: isMe ? "flex-end" : "flex-start",
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: "70%",
                          p: 2,
                          borderRadius: 3,
                          bgcolor: isMe ? "primary.main" : "action.hover",
                          color: isMe ? "#fff" : "text.primary",
                          borderBottomRightRadius: isMe ? 4 : 12,
                          borderBottomLeftRadius: !isMe ? 4 : 12,
                        }}
                      >
                        <Typography variant="body1">{msg.content}</Typography>
                      </Box>
                    </Box>
                  );
                })}
                <div ref={messagesEndRef} />
              </Box>
              <Box
                component="form"
                onSubmit={handleSend}
                sx={{
                  p: 2,
                  borderTop: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  gap: 1,
                  bgcolor: "background.default",
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Type a message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  size="small"
                  sx={{
                    bgcolor: "background.paper",
                    "& .MuiOutlinedInput-root": { borderRadius: 4 },
                  }}
                />
                <IconButton
                  type="submit"
                  disabled={!inputText.trim()}
                  sx={{
                    bgcolor: "primary.main",
                    color: "#fff",
                    "&:hover": { bgcolor: "primary.dark" },
                  }}
                >
                  <Send />
                </IconButton>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexGrow: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography color="text.secondary">
                Select a user to start chatting
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
