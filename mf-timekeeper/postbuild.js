// Using ES Modules import syntax
import fs from 'fs';
import path from 'path';

const directoryPath = path.join(process.cwd(), 'dist');

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        console.error('Unable to scan directory:', err);
        return;
    }
    files.forEach((file) => {
        const filePath = path.join(directoryPath, file);
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            const result = data.replace(/from '(\.\/.*?)(?<!\.js)'/g, "from '$1.js'");
            fs.writeFile(filePath, result, 'utf8', (err) => {
                if (err) console.error(err);
            });
        });
    });
});
