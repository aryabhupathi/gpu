"use client";
import React, { useTransition } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
} from "@mui/material";
import { banUser, warnUser } from "@/actions/adminActions";
import BlockIcon from "@mui/icons-material/Block";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
export interface AdminPanelUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
  warnings: number;
  banned?: boolean;
}
export default function AdminPanel({ users }: { users: AdminPanelUser[] }) {
  const [isPending, startTransition] = useTransition();
  const handleBan = (userId: string, currentBanStatus: boolean) => {
    startTransition(() => {
      banUser(userId, !currentBanStatus);
    });
  };
  const handleWarn = (userId: string) => {
    startTransition(() => {
      warnUser(userId);
    });
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        User Moderation
      </Typography>
      <Box sx={{ overflowX: "auto", mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Warnings</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      src={user.image || undefined}
                      sx={{ width: 32, height: 32 }}
                    />
                    <Typography variant="body2">{user.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role}
                    color={user.role === "ADMIN" ? "primary" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.warnings}
                    color={user.warnings > 2 ? "error" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {user.banned ? (
                    <Chip label="Banned" color="error" size="small" />
                  ) : (
                    <Chip label="Active" color="success" size="small" />
                  )}
                </TableCell>
                <TableCell align="right">
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
                  >
                    <Tooltip title="Warn User">
                      <span>
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() => handleWarn(user.id)}
                          disabled={isPending || user.role === "ADMIN"}
                        >
                          <WarningIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title={user.banned ? "Unban User" : "Ban User"}>
                      <span>
                        <IconButton
                          size="small"
                          color={user.banned ? "success" : "error"}
                          onClick={() => handleBan(user.id, !!user.banned)}
                          disabled={isPending || user.role === "ADMIN"}
                        >
                          {user.banned ? <CheckCircleIcon /> : <BlockIcon />}
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}
