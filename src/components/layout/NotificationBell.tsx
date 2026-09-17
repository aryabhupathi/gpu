"use client";
import React, { useState, useEffect } from "react";
import { Badge, IconButton, Menu, MenuItem, Typography, Box, Divider } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { getNotifications, markNotificationsAsRead } from "@/actions/notificationActions";
import { useRouter } from "next/navigation";
type Notification = {
  id: string;
  type: string;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: Date;
};
export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  useEffect(() => {
    getNotifications().then(data => setNotifications(data));
  }, []);
  const unreadCount = notifications.filter(n => !n.read).length;
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    if (unreadCount > 0) {
      markNotificationsAsRead().then(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      });
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleNotificationClick = (link: string | null) => {
    handleClose();
    if (link) {
      router.push(link);
    }
  };
  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 320, maxHeight: 400, mt: 1.5, borderRadius: 2 }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight={700}>Notifications</Typography>
        </Box>
        <Divider />
        {notifications.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">No notifications yet.</Typography>
          </MenuItem>
        ) : (
          notifications.map((n) => (
            <MenuItem 
              key={n.id} 
              onClick={() => handleNotificationClick(n.link)}
              sx={{ 
                py: 1.5, 
                px: 2, 
                bgcolor: n.read ? "transparent" : "rgba(124, 58, 237, 0.05)",
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                borderBottom: "1px solid #F1F5F9"
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: n.read ? 400 : 600, color: '#1E293B', whiteSpace: 'normal', lineHeight: 1.4 }}>
                {n.message}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                {new Date(n.createdAt).toLocaleDateString()}
              </Typography>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
}
