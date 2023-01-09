// dictation_demo.js
// only run in `Scriptable` app
Dictation.start().then(text => {
  // Automatic Speech Recognition - ASR
  console.log(text);
});
