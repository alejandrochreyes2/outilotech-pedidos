const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Frontend specific replacements
    content = content.replace(/Sistema de Gestión Toyota/g, 'Sistema de Gestión OutilTech');
    content = content.replace(/Bienvenido al sistema de gestión/g, 'Bienvenido al sistema de gestión OutilTech');
    
    // General replacements
    content = content.replace(/Toyota Colombia/g, 'OutilTech');
    content = content.replace(/Toyota/g, 'OutilTech');
    content = content.replace(/toyota/g, 'outiltech');
    content = content.replace(/TOYOTA/g, 'OUTILTECH');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

function walkSync(dir, filelist = []) {
    if (!fs.existsSync(dir)) return filelist;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.git' || file === 'bin' || file === 'obj' || file === '.angular' || file === 'dist') continue;
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            filelist = walkSync(filepath, filelist);
        } else {
            const ext = path.extname(filepath);
            if (['.ts', '.html', '.css', '.cs', '.json', '.js', '.md'].includes(ext)) {
                filelist.push(filepath);
            }
        }
    }
    return filelist;
}

const frontendFiles = walkSync(path.join(__dirname, 'frontend'));
const backendFiles = walkSync(path.join(__dirname, 'backend'));

[...frontendFiles, ...backendFiles].forEach(replaceInFile);

console.log('All replacements done.');
