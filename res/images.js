import fs from "fs"
import path from "path"
import * as IPFS from 'ipfs-core'


function getAllFiles(dirPath, originalPath, arrayOfFiles){
    let files= fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    originalPath = originalPath || path.resolve(dirPath, "..");
    let folder = path.relative(originalPath, path.join(dirPath, "/"));
    arrayOfFiles.push({
        path: folder.replace(/\\/g, "/"),
        mtime: fs.statSync(folder).mtime
    });

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()){
            arrayOfFiles = getAllFiles(dirPath + "/" + file, originalPath, arrayOfFiles)
        } else {
            file = path.join(dirPath, "/", file);
            arrayOfFiles.push({
                path: path.relative(originalPath, file).replace(/\\/g, "/"),
                content: fs.readFileSync(file),
                mtime: fs.statSync(file).mtime
            });
        }
    });
    return arrayOfFiles;
}
async function run() {
    
    const ipfs = await IPFS.create()
    const {cid} = await ipfs.add('Hello world')
    console.log("cide", cid);
    const imagesDir= './nfts'
    let files = getAllFiles(imagesDir);

      
    let rootFolder= "/" + path.relative(path.resolve("./img/", ".."), "./img/");
    const result= ipfs.addAll(files, { pin: true, })
        .then(result => {
            let rootItem = "/ipfs/" + result[result.length - 1].hash;
            console.info(result);
            console.info("Copying from " + rootItem + " to " + rootFolder);
            ipfs.files.cp(rootItem, rootFolder);
        })
        .catch(error => console.error(error));
}

run()