//Test file for gtts node js library.
//Run 'node gttsTest.js' in public folder to test for yourself.
// https://www.npmjs.com/package/gtts

const gTTS = require('gtts');
     
let speech = 'Hello Peter, Welcome to Fortnite. Your mama. I wonder what the limit is?';
const  gtts = new gTTS(speech, 'en');
 
gtts.save('Voice.mp3', function (err, result){
    if(err) { throw new Error(err); }
    console.log("Text to speech converted!");
});