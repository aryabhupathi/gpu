"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createForum } from "@/actions/forumActions";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Stack,
  Paper,
  FormControlLabel,
  Switch
} from "@mui/material";
import Image from "next/image";
import RichTextEditor from "@/components/common/RichTextEditor";
import AudioRecorder from "@/components/common/AudioRecorder";
import imageCompression from 'browser-image-compression';
import { UploadDropzone } from "@/lib/uploadthing";
export default function CreateForumPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [isPending, startTransition] = useTransition();
  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) return;
    startTransition(async () => {
      try {
        await createForum({
          title,
          description,
          mediaUrl,
          isPrivate,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        });
        router.push("/");
      } catch (e) {
        console.error("Failed to create forum", e);
      }
    });
  };
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          bgcolor: "#fff",
          border: "1px solid #E5E7EB",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={800}
          gutterBottom
          sx={{ mb: 4, color: "#1F2937" }}
        >
          Start a New Discussion
        </Typography>
        <Stack spacing={4}>
          <Box>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              sx={{ mb: 1, color: "#4B5563" }}
            >
              Title
            </Typography>
            <TextField
              placeholder="What do you want to talk about?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              disabled={isPending}
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Box>
          <Box>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              sx={{ mb: 1, color: "#4B5563" }}
            >
              Body
            </Typography>
            <RichTextEditor
              value={description}
              onChange={setDescription}
              readOnly={isPending}
              placeholder="Share your thoughts, add code snippets, or drop a link..."
            />
          </Box>
          <Box>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              sx={{ mb: 1, color: "#4B5563" }}
            >
              Tags
            </Typography>
            <TextField
              placeholder="e.g. React, Next.js, Help"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              fullWidth
              disabled={isPending}
              variant="outlined"
              helperText="Separate tags with commas"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Box>
          <Box>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              sx={{ mb: 1, color: "#4B5563" }}
            >
              Voice Note (Optional)
            </Typography>
            <AudioRecorder onAudioUpload={(url) => setMediaUrl(url)} />
          </Box>
          <Box>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              sx={{ mb: 1, color: "#4B5563" }}
            >
              Attach Media (Image/Video) (Optional)
            </Typography>
            {mediaUrl ? (
              <Box sx={{ position: "relative", width: "fit-content" }}>
                {mediaUrl.endsWith(".mp4") ? (
                  <video
                    src={mediaUrl}
                    controls
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      maxWidth: "100%",
                      maxHeight: "300px",
                      borderRadius: 8,
                    }}
                  />
                ) : (
                  <Image
                    src={mediaUrl}
                    alt="Uploaded media"
                    width={500}
                    height={300}
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      maxHeight: "300px",
                      borderRadius: 8,
                      objectFit: "contain",
                    }}
                  />
                )}
                <Button
                  color="error"
                  variant="contained"
                  size="small"
                  sx={{ position: "absolute", top: 8, right: 8 }}
                  onClick={() => setMediaUrl(null)}
                >
                  Remove
                </Button>
              </Box>
            ) : (
              <Box
                sx={{
                  border: "1px dashed #D1D5DB",
                  borderRadius: 2,
                  bgcolor: "#F9FAFB",
                  p: 2,
                }}
              >
                <UploadDropzone
                  endpoint="imageUploader"
                  onBeforeUploadBegin={async (files) => {
                    const compressedFiles = await Promise.all(
                      files.map(async (file) => {
                        if (file.type.startsWith("image/")) {
                          const options = {
                            maxSizeMB: 1,
                            maxWidthOrHeight: 1920,
                            useWebWorker: true,
                          };
                          try {
                            const compressedBlob = await imageCompression(
                              file,
                              options,
                            );
                            return new File([compressedBlob], file.name, {
                              type: compressedBlob.type,
                            });
                          } catch (error) {
                            console.error("Compression error:", error);
                            return file;
                          }
                        }
                        return file;
                      }),
                    );
                    return compressedFiles;
                  }}
                  onClientUploadComplete={(res) => {
                    if (res?.[0]) setMediaUrl(res[0].url);
                  }}
                  onUploadError={(error: Error) => {
                    alert(`ERROR! ${error.message}`);
                  }}
                />
              </Box>
            )}
          </Box>
          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  color="primary"
                  disabled={isPending}
                />
              }
              label={
                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    color="#4B5563"
                  >
                    Followers-Only (Private)
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Only you and your followers will be able to see this post.
                  </Typography>
                </Box>
              }
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 2 }}>
            <Button
              onClick={() => router.back()}
              variant="text"
              sx={{ mr: 2, color: "#6B7280" }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              disabled={isPending || !title.trim() || !description.trim()}
              sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: "bold" }}
            >
              {isPending ? "Posting..." : "Post Discussion"}
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}
