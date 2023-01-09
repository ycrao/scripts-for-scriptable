// message_demo.js
// only run in `Scriptable` app
let message = new Message()
message.body = "just for test"
// replace real phone number
message.recipients = ["+8618600000000"]
let res = await message.send()
console.log(res)