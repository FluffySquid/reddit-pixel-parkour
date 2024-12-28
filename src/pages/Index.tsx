import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VideoUploader } from "@/components/VideoUploader";
import { VideoPreview } from "@/components/VideoPreview";
import { useState } from "react";

const Index = () => {
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Reddit Video Editor</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload Video</CardTitle>
          </CardHeader>
          <CardContent>
            <VideoUploader onVideoUpload={setUploadedVideo} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <VideoPreview video={uploadedVideo} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;