const fs = require('fs')
const ioctl = require('ioctl')
const {rfm12b_ioctl} = require('./rfm12b_ioctl');

const rfm12_fd = fs.openSync('/dev/rfm12b.0.1', 'rs+')
console.error('fd', rfm12_fd)

const band_id = getInt(rfm12_fd, rfm12b_ioctl.GET_BAND_ID)
const bit_rate = getInt(rfm12_fd, rfm12b_ioctl.GET_BIT_RATE)

console.error('band_id:', band_id, 'bit_rate', bit_rate)

fs.closeSync(rfm12_fd)

function getInt(fd, code) {
  const b = new Buffer(4);
  const ret = ioctl(fd, code, b);
  if (ret) throw new Error('ioctl failed');
  return b.readInt32LE(0);
}
