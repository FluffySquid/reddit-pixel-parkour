import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });

export const processVideo = async (redditVideo: File, parkourVideo: File) => {
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }

  const redditFileName = 'reddit.mp4';
  const parkourFileName = 'parkour.mp4';
  const outputFileName = 'output.mp4';

  ffmpeg.FS('writeFile', redditFileName, await fetchFile(redditVideo));
  ffmpeg.FS('writeFile', parkourFileName, await fetchFile(parkourVideo));

  // Combine videos side by side
  await ffmpeg.run(
    '-i', redditFileName,
    '-i', parkourFileName,
    '-filter_complex', '[0:v]scale=480:640[left];[1:v]scale=480:640[right];[left][right]hstack',
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '22',
    outputFileName
  );

  const data = ffmpeg.FS('readFile', outputFileName);
  const processedVideoBlob = new Blob([data.buffer], { type: 'video/mp4' });
  
  // Cleanup
  ffmpeg.FS('unlink', redditFileName);
  ffmpeg.FS('unlink', parkourFileName);
  ffmpeg.FS('unlink', outputFileName);

  return processedVideoBlob;
};