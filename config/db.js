const mongoose = require('mongoose');

const readConn = mongoose.createConnection(process.env.MONGO_URI_READ);
const writeConn = mongoose.createConnection(process.env.MONGO_URI_WRITE);

readConn.on('connected', () => console.log('READ connection (reader) OK'));
writeConn.on('connected', () => console.log('WRITE connection (writer) OK'));
readConn.on('error', (e) => console.error('READ error:', e.message));
writeConn.on('error', (e) => console.error('WRITE error:', e.message));

module.exports = { readConn, writeConn };