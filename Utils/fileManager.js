'use strict'

const fs = require('fs');
const fsPromises = require('fs').promises;
const axios = require('axios');

/** 
 *  
 * await fileUtility.readFileAsyncAsBinary('./cxm/app/api/lib/util/file.txt') 
 * <Buffer 48 65 6c 6c 6f 20 4d 79 20 46 72 69 65 6e 64 20 68 6f 77 20 61 72 65 20 79 6f 75 3f 0a> 
 * 
 * await fileUtility.readFileAsync('./cxm/app/api/lib/util/file.txt', { encoding: 'utf-8' }) 
 * Hello My Friend how are you? 
 */
const fileUtility = (function () {
  const fileUtils = {
    getFilesFromDir: function (directoryPath) {
      fs.readdir(directoryPath, function (err, files) {
        if (err) {
          return console.error('Unable to scan directory: ' + err);
        } 
        return files.map(file => file);
      });
    },
    readFileAsync: function (filePath, args) {
      let file = '';
      return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(filePath, { ...args });
        stream.on('error', err => reject(err));
        stream.on('data', chunk => { file += chunk; });
        stream.on('end', () => resolve(file));
      });
    },
    readFileAsyncAsBinary: function (filePath) {
      let buffer = Buffer.from([]); return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(filePath, { highWaterMark: 16 });
        stream.on('error', err => reject(err));
        stream.on('data', chunk => {
          buffer = Buffer.concat([buffer, chunk]);
        }); 
        stream.on('end', () => resolve(buffer));
      });
    },
    downloadFile: function (fileUrl, filepath) {
      const writer = createWriteStream(filepath);
      return axios({ method: 'get', url: fileUrl, responseType: 'stream' })
        .then(response => {
          return new Promise((resolve, reject) => {
            response.data.pipe(writer); let error = null;
            writer.on('error', err => { 
              error = err; 
              writer.close(); 
              reject(err); 
            });
            writer.on('close', () => { 
              if (!error) { 
                resolve(true); 
              } 
            });
          });
        });
    },
    getFileStatsSync: function (filePath) {
      const stats = fs.statSync(filePath); if (stats.size === 0) {
        console.warn('Unexpected behaviour. File size is 0.');
      } return stats;
    },
    getFileStatsAsync: async function (filePath) {
      const stats = await fsPromises.stat(filePath);
      if (stats.size === 0) {
        console.warn('Unexpected behaviour. File size is 0.');
      } return stats;
    },
  };
  return fileUtils;
})();

exports.module = fileUtility;
