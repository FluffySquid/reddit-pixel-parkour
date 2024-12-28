import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });

export const processVideo = async (inputVideo: File) => {
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }

  const inputFileName = 'input.mp4';
  const outputFileName = 'output.mp4';

  ffmpeg.FS('writeFile', inputFileName, await fetchFile(inputVideo));

  await ffmpeg.run(
    '-i', inputFileName,
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '22',
    outputFileName
  );

  const data = ffmpeg.FS('readFile', outputFileName);
  const processedVideoBlob = new Blob([data.buffer], { type: 'video/mp4' });
  
  ffmpeg.FS('unlink', inputFileName);
  ffmpeg.FS('unlink', outputFileName);

  return processedVideoBlob;
};