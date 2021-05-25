'use strict';

const fs = require('fs'); 

/** 
* Creates a file from an input stream. Is fulfilled 
* if the stream is stored as a file successfully. 
* 
* @param {*} inputStream - Data stream. 
* @param {*} outputLocationPath - File path including file name and 
* extesion. 
* @returns Promise 
*/
function streamToFile(inputStream, outputLocationPath) {
    return new Promise((resolve, reject) => {
        const fileWriteStream = fs.createWriteStream(outputLocationPath);
        inputStream.pipe(fileWriteStream).on('finish', resolve).on('error', reject);
    });
}

module.exports = streamToFile;
