const git = require('isomorphic-git');
const fs = require('fs');
const path = require('path');

const dir = process.cwd();

async function main() {
  console.log('--- Initializing Git Repository ---');
  await git.init({ fs, dir });

  console.log('--- Adding files to index ---');
  
  // Simple directory walker to find files
  function getAllFiles(currentDir, allFiles = []) {
    const files = fs.readdirSync(currentDir);
    for (const file of files) {
      const filePath = path.join(currentDir, file);
      if (fs.statSync(filePath).isDirectory()) {
        // Skip common ignore dirs
        if (['node_modules', '.git', '.next', '.vercel', 'out', 'build', 'dist'].includes(file)) continue;
        getAllFiles(filePath, allFiles);
      } else {
        // Skip common ignore files
        if (['.env', 'dev.db', 'migration-data.json', 'git-prepare.js'].includes(file)) continue;
        if (file.endsWith('.log')) continue;
        
        allFiles.push(path.relative(dir, filePath).replace(/\\/g, '/'));
      }
    }
    return allFiles;
  }

  const filesToAdd = getAllFiles(dir);
  
  for (const file of filesToAdd) {
    try {
      await git.add({ fs, dir, filepath: file });
    } catch (e) {
      console.error(`Failed to add ${file}: ${e.message}`);
    }
  }

  console.log(`Added ${filesToAdd.length} files.`);

  console.log('--- Creating Initial Commit ---');
  let sha = await git.commit({
    fs,
    dir,
    author: {
      name: 'Agent',
      email: 'agent@local.host',
    },
    message: 'Initial commit: Prepared for Cloud Hosting',
  });

  console.log(`Commit created with SHA: ${sha}`);
  console.log('\nSUCCESS: Project is now committed locally.');
  console.log('You can now push this to your GitHub repository.');
}

main().catch(console.error);
