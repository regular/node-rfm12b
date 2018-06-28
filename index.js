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
    const buffer = Buffer.alloc(260)
    fs.read(rfm12_fd, buffer, 0, buffer.byteLength, null, (err, bytesRead, buffer) => {
      if (err) return cb(err)
      const meta = decodeHeader(buffer[0])
      cb(null, buffer.slice(2, bytesRead), meta)
    })
  }
  radio.write = function(payload, meta, cb) {
    if (typeof meta == 'function') {
      cb = meta; meta = {}
    }
    if (typeof payload == 'string') payload = Buffer.from(payload)
    if (!Buffer.isBuffer(payload)) throw new Error('payload must be Buffer or String')
    const msg = Buffer.alloc(payload.byteLength + 2)
    msg[0] = encodeHeader(meta)
    msg[1] = payload.byteLength
    payload.copy(msg, 2)
    //console.error(msg)
    fs.write(rfm12_fd, msg, 0, msg.byteLength, null, cb)
  }
  return radio
}

function encodeHeader(opts) {
  if (opts.from && opts.to) throw new Error('Can set either "from" or "to" property.')
  if (opts.isACK && opts.wantsACK) throw new Error('Cat set either "wantsACK" or "isACK" property.')
  const nodeId = opts.to || opts.from || 0
  if (nodeId > 31) throw new Error('nodeId must not be greater than 31.')
  const dest = opts.to ? 1 : 0
  const ack = opts.wantsACK ? 1 : 0
  const ctl = opts.isACK ? 1 : 0
  return (ctl << 7) | (dest << 6) | (ack << 5) | nodeId
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
  const b =  Buffer.alloc(4);
  const ret = ioctl(fd, code, b);
  if (ret) throw new Error('ioctl failed');
  return b.readInt32LE(0);
}

function setInt(fd, code, value) {
  const b = Buffer.alloc(4);
  b.writeInt32LE(value, 0);
  const ret = ioctl(fd, code, b);
  if (ret) throw new Error('ioctl failed');
}

