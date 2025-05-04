import { zip } from 'zip-a-folder';
import { existsSync, mkdirSync } from 'fs';

if (!existsSync('./dist/manifest.json')) {
    console.error('manifest.json missing in dist/. Run build first!');
    process.exit(1);
}

// Create builds/ folder if it doesn't exist
if (!existsSync('./builds')) {
    mkdirSync('./builds');
}

// Zip dist/ contents into builds/timebridge-v3.zip
const outputPath = './builds/timebridge-v3.zip';
await zip('./dist', outputPath);

console.log(`✅ Extension packaged at: ${outputPath}`);
