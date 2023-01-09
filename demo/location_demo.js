// location_demo.js
// only run in `Scriptable` app
const location = await Location.current()
// {"latitude":0,"horizontalAccuracy":0,"longitude":0,"verticalAccuracy":0,"altitude":0}
console.log(location)
let latitude = location.latitude
let longitude = location.longitude
// see https://sunrise-sunset.org/api
let url = 'https://api.sunrise-sunset.org/json?lat=' + latitude + '&lng=' + longitude + '&formatted=0&date=today'
let sunDataRaw = await new Request(url).loadJSON()

console.log(sunDataRaw)