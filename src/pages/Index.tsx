import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VideoUploader } from "@/components/VideoUploader";
import { VideoPreview } from "@/components/VideoPreview";
import { useState } from "react";
import { processVideo } from "@/utils/videoProcessor";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [parkourVideo, setParkourVideo] = useState<File | null>(null);
  const [processedVideo, setProcessedVideo] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleProcessVideo = async () => {
    if (!uploadedVideo || !parkourVideo) {
      toast({
        variant: "destructive",
        title: "Missing videos",
        description: "Please upload both a Reddit video and a parkour video."
      });
      return;
    }

    try {
      setIsProcessing(true);
      const processedBlob = await processVideo(uploadedVideo, parkourVideo);
      const processedFile = new File([processedBlob], 'processed.mp4', { type: 'video/mp4' });
      setProcessedVideo(processedFile);
      toast({
        title: "Video processed",
        description: "Your video has been processed successfully."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Processing failed",
        description: error instanceof Error ? error.message : "An error occurred while processing the video."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Reddit Video Editor</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Reddit Video</CardTitle>
            </CardHeader>
            <CardContent>
              <VideoUploader onVideoUpload={setUploadedVideo} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upload Parkour Video</CardTitle>
            </CardHeader>
            <CardContent>
              <VideoUploader onVideoUpload={setParkourVideo} />
            </CardContent>
          </Card>

          <Button 
            onClick={handleProcessVideo} 
            disabled={!uploadedVideo || !parkourVideo || isProcessing}
            className="w-full"
          >
            {isProcessing ? "Processing..." : "Process Videos"}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedVideo && (
                <>
                  <h3 className="font-semibold">Reddit Video</h3>
                  <VideoPreview video={uploadedVideo} />
                </>
              )}
              {parkourVideo && (
                <>
                  <h3 className="font-semibold mt-6">Parkour Video</h3>
                  <VideoPreview video={parkourVideo} />
                </>
              )}
              {processedVideo && (
                <>
                  <h3 className="font-semibold mt-6">Processed Video</h3>
                  <VideoPreview video={processedVideo} />
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;