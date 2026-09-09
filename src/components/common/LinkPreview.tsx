"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardMedia, CardContent, CircularProgress } from "@mui/material";
import { fetchLinkPreview } from "@/actions/scrapeActions";

export default function LinkPreview({ url }: { url: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLinkPreview(url).then((res) => {
      if (res) setData(res);
      setLoading(false);
    });
  }, [url]);

  if (loading) {
    return <CircularProgress size={24} sx={{ my: 2 }} />;
  }

  if (!data) {
    return <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>;
  }

  return (
    <Card 
      component="a" 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        my: 2, 
        textDecoration: 'none', 
        maxWidth: 600,
        borderRadius: 3,
        border: '1px solid #E2E8F0',
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: '#94A3B8',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }
      }}
    >
      {data.image && (
        <CardMedia
          component="img"
          sx={{ width: { xs: '100%', sm: 150 }, height: { xs: 150, sm: 'auto' }, objectFit: 'cover' }}
          image={data.image}
          alt={data.title}
        />
      )}
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2, mb: 1, color: '#0F172A' }}>
          {data.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {data.description}
        </Typography>
        <Typography variant="caption" sx={{ mt: 1, color: '#64748B', display: 'block' }}>
          {new URL(url).hostname}
        </Typography>
      </CardContent>
    </Card>
  );
}
