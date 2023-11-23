// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: hands;

/*
name: http.module.js
author: raoyc
description: a module for http request
version: v1.1 - add `postForm` function 
note: only run in `Scriptable` app
repo_file_url: https://github.com/ycrao/scripts-for-scriptable/blob/main/app/http.module.js
raw_file_url: https://raw.githubusercontent.com/ycrao/scripts-for-scriptable/main/app/http.module.js
*/
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
  if (Object.prototype.toString.call(params) === '[object Object]') {
     qs = Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&')
  }
  return qs
}

function postForm(url, formParam) {
  const request = new Request("")
  request.allowInsecureRequest = true
  request.method = "post"
  request.headers = {  
    "Accept": "*/*",
    "Content-Type": "application/x-www-form-urlencoded"
  }
  request.url = url
  request.body = qs(formParam)
  return request 
}
module.exports = {
  req,
  qs,
  postForm,
}
