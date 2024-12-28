import { useEffect, useRef } from "react";

interface VideoPreviewProps {
  video: File | null;
}

export const VideoPreview = ({ video }: VideoPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (video && videoRef.current) {
      const url = URL.createObjectURL(video);
      videoRef.current.src = url;
      return () => URL.revokeObjectURL(url);
    }
  }, [video]);

  if (!video) {
    return (
      <div className="h-48 flex items-center justify-center bg-muted rounded-lg">
        <p className="text-muted-foreground">No video selected</p>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      controls
      className="w-full rounded-lg"
      style={{ maxHeight: "400px" }}
    >
      Your browser does not support the video tag.
    </video>
  );
};