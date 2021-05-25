'use strict';
const fs = require('fs'); 

/** 
* Reads a file as a buffer. 
* 
* NB: I thought 1024 as a buffer chunk is ok, if you dont feel free to change it. 
* 
``` JS    
  const binaryFile = await fileToBuffer('./cxm/app/api/lib/util/file.txt');
  console.log(binaryFile)    
  <Buffer 48 65 6c 6c 6f 20 4d 79 20 46 72 69 65 6e 64 20 68 6f 77 20 61 72 65 20 79 6f 75 3f 0a> 
``` 
* 
* @param {string} outputLocationPath - Absolute system path to the file. 
* @returns {Promise} Resolves a buffer. 
*/
function fileToBuffer(outputLocationPath) {
    let buffer = Buffer.from([]);
    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(outputLocationPath, {
            highWaterMark: 1024
        });
        stream.on('error', err => reject(err));
        stream.on('data', chunk => {
            buffer = Buffer.concat([buffer, chunk]);
        });
        stream.on('end', () => resolve(buffer));
    });
}

module.exports = fileToBuffer;
