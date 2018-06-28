const fs = require('fs')
const ioctl = require('ioctl')
const camelCase = require('camel-case')
const {rfm12b_ioctl} = require('./rfm12b_ioctl');

const _accessors = {
  GROUP_ID: [getInt, setInt],
  BAND_ID: [getInt, setInt],
  BIT_RATE: [getInt, setInt],
  JEE_ID: [getInt, setInt],
  JEEMODE_AUTOACK: [getInt, setInt]
}

module.exports = function(opts) {
  opts = opts || {}
  const rfm12_fd = fs.openSync(opts.device_path || '/dev/rfm12b.0.1', 'rs+')

  const radio = Object.keys(_accessors).reduce( ((acc, name) =>
    Object.assign(acc, makeGetterSetter(name, rfm12_fd))
  ), {})
  radio.close = function() {
    fs.closeSync(rfm12_fd)
  }
  radio.read = function(cb) {
    const buffer = new Buffer(260)
    fs.read(rfm12_fd, buffer, 0, buffer.byteLength, null, (err, bytesRead, buffer) => {
      if (err) return cb(err)
      const meta = decodeHeader(buffer[0])
      cb(null, buffer.slice(2, bytesRead), meta)
    })
  }
  return radio
}

function decodeHeader(h) {
  const nodeId = h & 0x1f
  const ack = (h >> 5) & 1
  const dest = (h >> 6) & 1
  const ctl = (h >> 7) & 1

  return {
    wantsACK: !ctl && ack,
    isACK: ctl && !ack,
    to: dest ? nodeId : null,
    from: dest ? null : nodeId
  }

}

function makeGetterSetter(name, fd) {
  const [get, set] = _accessors[name]
  const getter_ioctl_name = 'GET_' + name
  const setter_ioctl_name = 'SET_' + name
  const getter_ioctl = rfm12b_ioctl[getter_ioctl_name]
  const setter_ioctl = rfm12b_ioctl[setter_ioctl_name]
  const getterName = camelCase(getter_ioctl_name)
  const setterName = camelCase(setter_ioctl_name)

  return {
    [getterName]: function() {
      return get(fd, getter_ioctl)
    },
    [setterName]: function(value) {
      return set(fd, setter_ioctl, value)
    }
  }
}

function getInt(fd, code) {
  const b = new Buffer(4);
  const ret = ioctl(fd, code, b);
  if (ret) throw new Error('ioctl failed');
  return b.readInt32LE(0);
}

function setInt(fd, code, value) {
  const b = new Buffer(4);
  b.writeInt32LE(value, 0);
  const ret = ioctl(fd, code, b);
  if (ret) throw new Error('ioctl failed');
}

