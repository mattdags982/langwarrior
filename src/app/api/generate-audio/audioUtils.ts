import { writeFile, readFile, rm, mkdtemp } from 'fs/promises';
import { join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import os from 'os';

const execAsync = promisify(exec);

export async function stitchAudioFiles(audioBuffers: Buffer[]): Promise<Buffer> {
  const tempDir = await mkdtemp(join(os.tmpdir(), 'audio-'));
  
  try {
    // Write individual audio files
    const inputFiles: string[] = [];
    for (let i = 0; i < audioBuffers.length; i++) {
      const inputPath = join(tempDir, `input${i}.mp3`);
      await writeFile(inputPath, audioBuffers[i]);
      inputFiles.push(inputPath);
    }

    // Create concat file
    const concatFilePath = join(tempDir, 'concat.txt');
    const concatContent = inputFiles.map(file => `file '${file}'`).join('\n');
    await writeFile(concatFilePath, concatContent);

    // Output path
    const outputPath = join(tempDir, 'output.mp3');

    // Use ffmpeg command line
    const ffmpegCommand = `ffmpeg -f concat -safe 0 -i "${concatFilePath}" -c copy "${outputPath}"`;
    await execAsync(ffmpegCommand);

    // Read the final file
    return await readFile(outputPath);
  } finally {
    // Cleanup temp files
    await rm(tempDir, { recursive: true, force: true });
  }
}

export async function base64ToBuffer(base64: string): Promise<Buffer> {
  return Buffer.from(base64, 'base64');
} 