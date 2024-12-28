import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface VideoUploaderProps {
  onVideoUpload: (file: File) => void;
}

export const VideoUploader = ({ onVideoUpload }: VideoUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        onVideoUpload(file);
        toast({
          title: "Video uploaded",
          description: `File "${file.name}" has been uploaded successfully.`
        });
      } else {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a video file."
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      <Input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />
      <Button 
        onClick={() => fileInputRef.current?.click()}
        className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed"
      >
        <Upload className="h-8 w-8 mb-2" />
        <span>Click to upload video</span>
        <span className="text-sm text-muted-foreground">or drag and drop</span>
      </Button>
    </div>
  );
};