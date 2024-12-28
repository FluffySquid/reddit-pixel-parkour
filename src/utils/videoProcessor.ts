import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import type { VideoLayout } from '@/components/VideoLayoutControls';

// Configure FFmpeg with more compatible settings
const ffmpeg = createFFmpeg({ 
  log: true,
  corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js',
  workerPath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.worker.js',
});

interface ProcessVideoOptions {
  layout: VideoLayout;
  ratio: number;
  pipPosition: { x: number; y: number };
}

export const processVideo = async (
  redditVideo: File,
  parkourVideo: File,
  options: ProcessVideoOptions
) => {
  try {
    if (!ffmpeg.isLoaded()) {
      console.log('Loading FFmpeg...');
      await ffmpeg.load();
      console.log('FFmpeg loaded successfully');
    }

    console.log('Starting video processing...');
    const redditFileName = 'reddit.mp4';
    const parkourFileName = 'parkour.mp4';
    const outputFileName = 'output.mp4';

    // Write input files
    console.log('Writing input files...');
    ffmpeg.FS('writeFile', redditFileName, await fetchFile(redditVideo));
    ffmpeg.FS('writeFile', parkourFileName, await fetchFile(parkourVideo));

    // Prepare filter complex based on layout
    let filterComplex = '';
    switch (options.layout) {
      case 'side-by-side':
        filterComplex = '[0:v]scale=480:640[left];[1:v]scale=480:640[right];[left][right]hstack';
        break;
      case 'top-bottom':
        filterComplex = '[0:v]scale=960:360[top];[1:v]scale=960:360[bottom];[top][bottom]vstack';
        break;
      case 'picture-in-picture':
        const pipWidth = Math.round(960 * options.ratio);
        const pipHeight = Math.round(640 * options.ratio);
        const pipX = Math.round((960 - pipWidth) * options.pipPosition.x);
        const pipY = Math.round((640 - pipHeight) * options.pipPosition.y);
        filterComplex = `[0:v]scale=960:640[main];[1:v]scale=${pipWidth}:${pipHeight}[pip];[main][pip]overlay=${pipX}:${pipY}`;
        break;
    }

    console.log('Processing with filter:', filterComplex);

    // Process video with FFmpeg
    await ffmpeg.run(
      '-i', redditFileName,
      '-i', parkourFileName,
      '-filter_complex', filterComplex,
      '-c:v', 'libx264',
      '-preset', 'ultrafast', // Using ultrafast preset for better compatibility
      '-crf', '28', // Slightly lower quality for better performance
      outputFileName
    );

    console.log('Video processing completed');

    // Read and return the processed video
    const data = ffmpeg.FS('readFile', outputFileName);
    const processedVideoBlob = new Blob([data.buffer], { type: 'video/mp4' });
    
    // Cleanup
    ffmpeg.FS('unlink', redditFileName);
    ffmpeg.FS('unlink', parkourFileName);
    ffmpeg.FS('unlink', outputFileName);

    return processedVideoBlob;
  } catch (error) {
    console.error('FFmpeg processing error:', error);
    throw new Error(`Video processing failed: ${error.message}`);
  }
};