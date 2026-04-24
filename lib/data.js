const fs = require('fs');
const path = require('path');

const lib = {};

// Base directory of the data folder
lib.basedir = path.join(__dirname, './../.data/');

// Write data to file
lib.create = (dir, file, data, callback) => {
    // Open file for writing
    fs.open(`${lib.basedir + dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // Convert data to string
            const stringData = JSON.stringify(data);

            // write data to file and then close it
            fs.writeFile(fileDescriptor, stringData, (err2) => {
                if (!err2) {
                    fs.close(fileDescriptor, (err3) => {
                        if (!err3) {
                            callback();
                        } else {
                            callback('Error while closing the file!');
                        }
                    });
                } else {
                    callback('Error writing to new file!');
                }
            });
        } else {
            callback('Could not create new file, it may already exists!');
        }
    });
};

lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf8', (err, data) => {
        if (!err) {
            callback(err, data);
        } else {
            callback("Error while reading data or the file doesn't exists!");
        }
    });
};

lib.update = (dir, file, data, callback) => {
    fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            const stringData = JSON.stringify(data);

            fs.ftruncate(fileDescriptor, (err2) => {
                if (!err2) {
                    fs.writeFile(fileDescriptor, stringData, (err3) => {
                        if (!err3) {
                            fs.close(fileDescriptor, (err4) => {
                                if (!err4) {
                                    callback();
                                } else {
                                    callback('Error while closing the file!');
                                }
                            });
                        } else {
                            callback('Error while updating the file!');
                        }
                    });
                } else {
                    callback('Error while truncating file!');
                }
            });
        } else {
            callback('Error while updating the file, it may not exists!');
        }
    });
};

lib.delete = (dir, file, callback) => {
    fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
        if (!err) {
            callback();
        } else {
            callback('Error while deleting the file.');
        }
    });
};

lib.list = (dir, callback) => {
    fs.readdir(`${lib.basedir + dir}`, (err, fileNames) => {
        if (!err && fileNames) {
            const checkData = fileNames.map((fileName) => fileName.replace('.json', ''));
            callback(false, checkData);
        } else {
            callback('Error reading checks directory!');
        }
    });
};

module.exports = lib;
