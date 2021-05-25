'use strict';

const {
    streamToFile,
    createSafeFileName,
    fileToBuffer,
    fileToString,
} = require('../../lib/util/fileUtil');
const fs = require('fs');
const { PassThrough, Readable } = require('stream');
const uuidv4 = require('uuid/v4');

jest.mock('fs');
jest.mock('uuid/v4');

describe('streamToFile', () => {
    it('rejects/errors if a stream error occurs', async () => {
        const mockReadable = new PassThrough();
        const mockWriteable = new PassThrough();
        const mockFilePath = '/oh/what/a/file.txt';
        const mockError = new Error('You crossed the streams!');
        fs.createWriteStream.mockReturnValueOnce(mockWriteable);
        const actualPromise = streamToFile(mockReadable, mockFilePath);
        setTimeout(() => {
            mockReadable.emit('error', mockError);
        }, 100);
        await expect(actualPromise).rejects.toEqual(mockError);
    });
    it('rejects/errors if a READ stream error occurs', async () => {
        const mockReadable = new PassThrough();
        const mockWriteable = new PassThrough();
        const mockFilePath = '/oh/what/a/file.txt';
        const mockError = new Error('You crossed the streams!');
        fs.createWriteStream.mockReturnValueOnce(mockWriteable);
        const actualPromise = streamToFile(mockReadable, mockFilePath);
        setTimeout(() => {
            mockReadable.emit('error', mockError);
        }, 100);
        await expect(actualPromise).rejects.toEqual(mockError);
    });
    it('resolves if the data writes successfully', async () => {
        const mockReadable = new PassThrough();
        const mockWriteable = new PassThrough();
        const mockFilePath = '/oh/what/a/file.txt';
        fs.createWriteStream.mockReturnValueOnce(mockWriteable);
        const actualPromise = streamToFile(mockReadable, mockFilePath);
        setTimeout(() => {
            mockReadable.emit('data', 'beep!');
            mockReadable.emit('data', 'boop!');
            mockReadable.emit('end');
        }, 100);
        await expect(actualPromise).resolves.toEqual(undefined);
    });
});

describe('createSafeFileName', () => {
    it('Creates a unique name for a file.', async () => {
        uuidv4.mockReturnValueOnce('5296b11b-1bc3-403a-979c-3f9df7fa319b');
        const mockDate = new Date(1466424490000);
        jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
        expect(createSafeFileName('image/jpeg')).toBe('2016-06-20-12-08-10-5296b11b-1bc3-403a-979c-3f9df7fa319b.jpeg');
    });
});

describe('fileToBuffer', () => {
    it('Returns the binary data of an existing file.', async () => {
        fs.createReadStream.mockImplementation(() => {
            const readable = new Readable();
            readable.push('hello');
            readable.push('world');
            readable.push(null);
            return readable;
        });
        expect(await fileToBuffer('/path/to/funland')).toStrictEqual(Buffer.from([104, 101, 108, 108, 111, 119, 111, 114, 108, 100]));
    });
});

describe('fileToString', () => {
    it('Returns the binary data of an existing file.', async () => {
        fs.createReadStream.mockImplementation(() => {
            const readable = new Readable();
            readable.push('hello');
            readable.push('world');
            readable.push(null);
            return readable;
        });
        expect(await fileToString('/path/to/funland')).toStrictEqual('helloworld');
    });
});
