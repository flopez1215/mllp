import hl7 from 'hl7';

export function createACK(data, ack_type) {
    var msg_id = data[0][10];
    var header = [data[0]];

    //switch around sender/receiver names
    header[0][3] = data[0][5];
    header[0][4] = data[0][6];
    header[0][5] = data[0][3];
    header[0][6] = data[0][4];

    var result = hl7.serializeJSON(header);
    result = result + "\r" + "MSA|" + ack_type + "|" + msg_id;

    return result;
}