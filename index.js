import net from 'net';
import hl7 from 'hl7';
import parser from 'L7';
import util from 'util';
import * as ack from './helpers/';
var EventEmitter = require('events').EventEmitter;
//import { EventEmitter } from events;

const VT = String.fromCharCode(0x0b);
const FS = String.fromCharCode(0x1c);
const CR = String.fromCharCode(0x0d);

var message = '';

const HOST = '127.0.0.1';
const PORT = 6969;

var Server = net.createServer((sock) => {
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);

    sock.on('data', function(data) {
        data = data.toString();

        if (data.indexOf(VT) > -1) {
            message = '';
        }

        message += data.replace(VT, '');

        if (data.indexOf(FS + CR) > -1) {
            message = message.replace(FS + CR, '');

            var plainMessage = hl7.parseString(message);
            let parsedMessage = parser.parse(message);

            var ackMessage = ack.createACK(plainMessage, "AA");

            sock.write(VT + ackMessage + FS + CR);
        }

    });

    sock.on('close', function(data) {
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });

});

Server.listen(PORT, HOST);
