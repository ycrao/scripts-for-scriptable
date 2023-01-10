// keychain_demo.js
// only run in `Scriptable` app

Keychain.set("hello", "world")
if (Keychain.contains("hello")) {
  let value = Keychain.get("hello")
  console.log(value)
  Keychain.remove("hello")
}