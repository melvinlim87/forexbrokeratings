const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Function to recursively find all .tsx and .jsx files
async function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.next')) {
      fileList = await findFiles(filePath, fileList);
    } else if (
      stat.isFile() && 
      (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) && 
      !filePath.includes('node_modules') && 
      !filePath.includes('.next')
    ) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

// Function to update Image component props
async function updateImageProps(filePath) {
  try {
    let content = await readFile(filePath, 'utf8');
    let modified = false;
    
    // Replace layout="fill" with fill
    if (content.includes('layout="fill"')) {
      content = content.replace(/layout="fill"/g, 'fill');
      modified = true;
    }
    
    // Replace objectFit="contain" with style={{ objectFit: "contain" }}
    if (content.includes('objectFit="contain"')) {
      content = content.replace(/objectFit="contain"/g, 'style={{ objectFit: "contain" }}');
      modified = true;
    }
    
    // Replace objectFit="cover" with style={{ objectFit: "cover" }}
    if (content.includes('objectFit="cover"')) {
      content = content.replace(/objectFit="cover"/g, 'style={{ objectFit: "cover" }}');
      modified = true;
    }
    
    if (modified) {
      await writeFile(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Main function
async function main() {
  const rootDir = path.resolve(__dirname, '..');
  const files = await findFiles(rootDir);
  
  console.log(`Found ${files.length} files to process`);
  
  for (const file of files) {
    await updateImageProps(file);
  }
  
  console.log('Done!');
}

main().catch(console.error);
