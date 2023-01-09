// request_demo.js
// only run in `Scriptable` app
const defaultHeaders = {
    "Accept": "*/*",
    "Content-Type": "application/json"
}
function req(method, url, params, headers) {
  let request = new Request("")
  request.allowInsecureRequest = true
  method = method.toLowerCase()
  request.method = method
  request.headers = {
    ...defaultHeaders,
    ...headers,
  }
  request.url = url
  if (method === 'get') {
    let qStr = qs(params)
    request.url = url.endsWith('?') ? url + qStr : url + '?' + qStr
  } else if (['post', 'put', 'patch'].includes(method) && typeof params === 'object') {
    request.body = JSON.stringify(params)
  }
  return request
}

function qs(params) {
  let qs = ''
  if (Object.prototype.toString.call(params) === '[Object Object]') {
     qs = Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&')
  }
  return qs
}

// get 
req('get', 'https://httpbin.org/get', {"page": 1, "pageSize": 10}).loadJSON().then(resp => {
  console.log(resp);
});

// post
req('post', 'https://httpbin.org/post', {"name": "Tom", "age": 20}).loadJSON().then(resp => {
  console.log(resp);
});

// put
req('put', 'https://httpbin.org/put', {"_id": 1, "name": "Tom", "age": 18}).loadJSON().then(resp => {
  console.log(resp);
});

// patch
req('patch', 'https://httpbin.org/patch', {"_id": 1, "age": 18}).loadJSON().then(resp => {
  console.log(resp);
});

// get but return string/text response
req('get', 'https://httpbin.org/robots.txt').loadString().then(resp => {
  console.log(resp);
});

// get but return image response
req('get', 'https://httpbin.org/image/jpeg', null, {
    "Accept": "image/jpeg",
  }).loadImage().then(img => {
    // in `Scriptable` is true
    console.log(img instanceof Image)
    console.log(img);
});

