"use client";

import React, { useState, useEffect, useRef } from "react";
import { Container, Box, Typography, Paper, List, ListItem, ListItemAvatar, Avatar, ListItemText, TextField, IconButton, Divider } from "@mui/material";
import { Send } from "@mui/icons-material";
import { getConversations, getMessages, sendMessage } from "@/actions/messageActions";

export default function MessagesClient({ currentUser, mutuals }: { currentUser: any, mutuals: any[] }) {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeUser, setActiveUser] = useState<any | null>(null);
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Poll for conversations
  useEffect(() => {
    const fetchConvos = async () => {
      const convos = await getConversations();
      setConversations(convos);
    };
    fetchConvos();
    const interval = setInterval(fetchConvos, 5000);
    return () => clearInterval(interval);
  }, []);

  // Poll for messages when active conversation
  useEffect(() => {
    const fetchActiveMessages = async () => {
      if (activeConvoId) {
        const msgs = await getMessages(activeConvoId);
        setMessages(msgs);
      } else if (activeUser) {
        // Find if convo exists
        const convo = conversations.find(c => c.otherUser.id === activeUser.id);
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

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeUser) return;
    
    const text = inputText;
    setInputText("");

    // Optimistic UI
    const optimisticMsg = {
      id: "temp",
      content: text,
      senderId: currentUser.id,
      createdAt: new Date()
    };
    setMessages(prev => [...prev, optimisticMsg]);

    try {
      await sendMessage(activeConvoId, activeUser.id, text);
      // Let polling catch the actual message
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, height: '80vh' }}>
      <Paper elevation={0} sx={{ display: 'flex', height: '100%', borderRadius: 4, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        
        {/* Sidebar */}
        <Box sx={{ width: 300, borderRight: '1px solid #E2E8F0', bgcolor: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #E2E8F0', bgcolor: '#fff' }}>
            <Typography variant="h6" fontWeight={800}>Messages</Typography>
          </Box>
          <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
            <Typography variant="overline" sx={{ px: 2, color: 'text.secondary' }}>Mutuals</Typography>
            {mutuals.map(user => (
              <ListItem 
                key={`m-${user.id}`} 
                component="div"
                onClick={() => { setActiveUser(user); setActiveConvoId(null); }}
                sx={{ cursor: 'pointer', bgcolor: activeUser?.id === user.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent' }}
              >
                <ListItemAvatar>
                  <Avatar src={user.image || ""}>{user.name?.charAt(0) || "U"}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={user.name || "Anonymous"} />
              </ListItem>
            ))}
            
            <Divider sx={{ my: 1 }} />
            <Typography variant="overline" sx={{ px: 2, color: 'text.secondary' }}>Recent Chats</Typography>
            {conversations.map(convo => (
              <ListItem 
                key={convo.id} 
                component="div"
                onClick={() => { setActiveUser(convo.otherUser); setActiveConvoId(convo.id); }}
                sx={{ cursor: 'pointer', bgcolor: activeConvoId === convo.id ? 'rgba(59, 130, 246, 0.1)' : 'transparent' }}
              >
                <ListItemAvatar>
                  <Avatar src={convo.otherUser.image || ""}>{convo.otherUser.name?.charAt(0) || "U"}</Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={convo.otherUser.name || "Anonymous"} 
                  secondary={convo.lastMessage?.content || "Say hi!"} 
                  secondaryTypographyProps={{ noWrap: true }}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Chat Area */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}>
          {activeUser ? (
            <>
              <Box sx={{ p: 2, borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={activeUser.image || ""}>{activeUser.name?.charAt(0) || "U"}</Avatar>
                <Typography variant="h6" fontWeight={700}>{activeUser.name || "Anonymous"}</Typography>
              </Box>
              
              <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {messages.map((msg, i) => {
                  const isMe = msg.senderId === currentUser.id;
                  return (
                    <Box key={msg.id || i} sx={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                      <Box sx={{ 
                        maxWidth: '70%', 
                        p: 2, 
                        borderRadius: 3, 
                        bgcolor: isMe ? '#3B82F6' : '#F1F5F9',
                        color: isMe ? '#fff' : '#0F172A',
                        borderBottomRightRadius: isMe ? 4 : 12,
                        borderBottomLeftRadius: !isMe ? 4 : 12
                      }}>
                        <Typography variant="body1">{msg.content}</Typography>
                      </Box>
                    </Box>
                  );
                })}
                <div ref={messagesEndRef} />
              </Box>

              <Box component="form" onSubmit={handleSend} sx={{ p: 2, borderTop: '1px solid #E2E8F0', display: 'flex', gap: 1, bgcolor: '#F8FAFC' }}>
                <TextField
                  fullWidth
                  placeholder="Type a message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  size="small"
                  sx={{ bgcolor: '#fff', '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
                />
                <IconButton type="submit" color="primary" disabled={!inputText.trim()} sx={{ bgcolor: '#3B82F6', color: '#fff', '&:hover': { bgcolor: '#2563EB' } }}>
                  <Send />
                </IconButton>
              </Box>
            </>
          ) : (
            <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">Select a user to start chatting</Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
