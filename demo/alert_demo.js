// alert_demo.js
// only run in `Scriptable` app
let alert = new Alert()
alert.title = "Warning"
alert.message = "Confirm to delete this article?"
alert.addCancelAction("NO")
alert.addAction("YES")
alert.presentAlert().then(res => {
  if (res == 0) {
    console.log("deleted")
  } else if (res == -1) {
    console.log("cancel")
  }
});
