const radio = require('./')()

const JEE_ID = 13
const GROUP_ID =19

radio.setJeeId(JEE_ID)
radio.setGroupId(GROUP_ID)
radio.setJeemodeAutoack(1)

Object.keys(radio).forEach(k => {
  if (k.slice(0,3) == 'get') {
    console.log(k, radio[k]())
  }
})

radio.write(Buffer.from([Number(process.argv[2])]), {to:0}, err => {
  if (err) console.error(err,message)
})
