async function submitDocument(event) {
  event.preventDefault(); 
  localStorage.userId = 'u4321'; // make this be assigned on the login of a user
  const file = document.getElementById('fileInput').files[0];
  const fileName = grabUntilPeriod(document.getElementById('fileInput').files[0].name);
  //console.log(localStorage.fileName)
  const formData = new FormData();
  formData.append('document', file);
  var audioContainer = document.getElementById('audiobook');
  audioContainer.innerHTML = 'Audio in creation please wait!';
  try {
    const response = await fetch('/api/rapidapi', {
      method: 'POST',
      body: formData
    });
    const data = await response.text();
    console.log(data);
      try {
        
        const response = await fetch('/api/saveAudio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ text: String(data), userId: String(localStorage.userId), fileName: String(fileName)})
        });
        //const data2 = await response.text();
        //wait(19000);
        createAudio(fileName);
        
      } catch (error) {
        console.error('Error saving audio:', error);
      }
  } catch (error) {
    console.error('Error submitting document:', error);
  }
}

function wait(ms){
  var start = new Date().getTime();
  var end = start;
  while(end < start + ms) {
    end = new Date().getTime();
 }
}

function createAudio(fileName) { // this function can also have the name imported
  var audio = document.createElement('audio');
  
  audio.src = `./uploads/${localStorage.userId}/audio/${fileName}.mp3`;
  audio.controls = true;
  
  var audioContainer = document.getElementById('audiobook');
  
  audioContainer.innerHTML = '';
    // Append the audio element to the div
  audioContainer.appendChild(audio);
}

function grabUntilPeriod(input) {
  let result = '';
  for (let i = 0; i < input.length; i++) {
      if (input[i] === '.') {
          break;
      }
      result += input[i];
  }
  return result;
}

async function createAccount(){
  try {
        
    const response = await fetch('/api/createUserFolders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({userId: String(localStorage.userId)})
    });
    //const data = await response.text();

  } catch (error) {
    console.error('Error creating user folder', error);
  }
}

document.getElementById('uploadForm').addEventListener('submit', submitDocument);
//document.getElementById('createbutton').addEventListener("click", createAudio);
document.getElementById('accountCreationTest').addEventListener("click", createAccount);
var loginModal = document.getElementById('loginButton');

var btn = document.getElementById('login');

var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
  loginModal.style.display = "block";
}
        
window.onclick = function(event) {
    if (event.target == loginModal) {
        loginModal.style.display = "none";
    }
}

var modal = document.getElementById('registerBtn');

window.onclick = function(event) {
  if(event.target == modal) {
    modal.style.display = "none";
  }
}