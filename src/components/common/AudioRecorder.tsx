"use client";

import React, { useState, useRef } from "react";
import { Box, IconButton, Typography, CircularProgress } from "@mui/material";
import { Mic, Stop, PlayArrow, Delete } from "@mui/icons-material";


interface AudioRecorderProps {
  onAudioUpload: (url: string) => void;
}

export default function AudioRecorder({ onAudioUpload }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access denied or unavailable.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleUpload = async () => {
    if (!audioBlob) return;
    setIsUploading(true);
    
    // We create a File from the Blob
    const file = new File([audioBlob], `voice-note-${Date.now()}.webm`, { type: "audio/webm" });

    try {
      // Instead of manual fetch, we can use the uploadthing helper or endpoint directly,
      // but since we only have the hook/dropzone, we'll let the user use the dropzone 
      // or we simulate the upload. UploadThing provides `uploadFiles`.
      // For simplicity in this UI, we can just export a method. 
      // Actually, standard uploadthing from client requires `useUploadThing`.
      // Let's rely on standard fetch to a custom route or standard uploadthing.
      // Wait, UploadThing provides `uploadFiles` in "@uploadthing/react".
      const { uploadFiles } = await import("@/lib/uploadthing");
      const res = await uploadFiles("imageUploader", {
        files: [file],
      });
      if (res && res[0]) {
        onAudioUpload(res[0].url);
        // Clear local state
        setAudioBlob(null);
        setAudioUrl(null);
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload audio.");
    } finally {
      setIsUploading(false);
    }
  };

  const clearAudio = () => {
    setAudioBlob(null);
    setAudioUrl(null);
  };

  return (
    <Box sx={{ p: 2, border: "1px dashed #ccc", borderRadius: 2, display: "flex", alignItems: "center", gap: 2, bgcolor: "#f8fafc", mb: 2 }}>
      {!audioUrl ? (
        <>
          <IconButton 
            color={isRecording ? "error" : "primary"} 
            onClick={isRecording ? stopRecording : startRecording}
            sx={{ bgcolor: isRecording ? "rgba(239, 68, 68, 0.1)" : "rgba(59, 130, 246, 0.1)" }}
          >
            {isRecording ? <Stop /> : <Mic />}
          </IconButton>
          <Typography variant="body2" color={isRecording ? "error" : "text.secondary"}>
            {isRecording ? "Recording... Click to stop." : "Click to record a voice note"}
          </Typography>
        </>
      ) : (
        <>
          <audio src={audioUrl} controls style={{ height: 40 }} />
          <IconButton onClick={handleUpload} color="success" disabled={isUploading}>
            {isUploading ? <CircularProgress size={24} /> : <PlayArrow />}
            {/* Using PlayArrow temporarily as an 'Upload/Submit' icon if we don't import CloudUpload */}
          </IconButton>
          <Typography variant="body2" color="success.main" sx={{ cursor: "pointer", fontWeight: "bold" }} onClick={handleUpload}>
            {isUploading ? "Uploading..." : "Attach Voice Note"}
          </Typography>
          <IconButton onClick={clearAudio} color="error" disabled={isUploading}>
            <Delete />
          </IconButton>
        </>
      )}
    </Box>
  );
}
