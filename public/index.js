async function submitDocument(event) {
  event.preventDefault(); 
  localStorage.userId = 'u4321'; // make this be assigned on the login of a user
  localStorage.audioNumber = 2; // make a call ahead of time to get this number
  const file = document.getElementById('fileInput').files[0];
  
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
    //console.log(data);
      try {
        
        const response = await fetch('/api/saveAudio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ text: String(data), userId: String(localStorage.userId), audioNumber: String(localStorage.audioNumber)})
        });
        const data2 = await response.text();
        wait(19000);
        createAudio();
        
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

function createAudio() {
  const audioName = localStorage.userId + localStorage.audioNumber + '.mp3';
  var audio = document.createElement('audio');
  
  audio.src = "./uploads/audio/" + audioName;
  audio.controls = true;
  
  var audioContainer = document.getElementById('audiobook');
  
  audioContainer.innerHTML = '';
    // Append the audio element to the div
  audioContainer.appendChild(audio);
}

/*  function ApiCall(fileInput) {
    const url = 'https://converter12.p.rapidapi.com/api/converter/1/FileConverter/Convert';
    const apiKey = 'placeholder';
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
  
    const options = {
      method: 'POST',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'converter12.p.rapidapi.com'
      },
      body: formData
    };
  
    fetch(url, options)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
      })
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.error('Fetch Error:', error);
      });
  }
} */ //commented off due to changing the call to backend for security
  
document.getElementById('uploadForm').addEventListener('submit', submitDocument);
//document.getElementById('createbutton').addEventListener("click", createAudio);
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