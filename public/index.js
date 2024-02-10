
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
        createAudio(fileName);
        
      } catch (error) {
        console.error('Error saving audio:', error);
      }
  } catch (error) {
    console.error('Error submitting document:', error);
  }
}
function createUser() {
  var userData = document.getElementById('userdata');

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
  localStorage.userId = 'u4321';
  try{
        
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
async function createUserAccount(event){
  event.preventDefault();
  const uName = document.getElementById('newUsername').value;
  const newpsw = document.getElementById('newPass').value;
  const reppsw = document.getElementById('newPassRepeat').value;
  
  console.log(uName);
  console.log(newpsw);
  console.log(reppsw);
  if (newpsw == reppsw){
    console.log('passwords match')
 
  try{
    console.log(uName);
    console.log(newpsw);
    console.log(reppsw);
    const response = await fetch('/api/user/newuser',  {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({newUserName: String(uName), newPassword: String(newpsw)})

    });
    
  }catch(error){
    console.error('Error creating user', error);
  }

}
else{
  console.log("passes dont match");

}
  
}

document.getElementById('uploadForm').addEventListener('submit', submitDocument);
document.getElementById('accountCreationFolder').addEventListener("submit", createAccount);
document.getElementById('accountCreation').addEventListener("submit", createUserAccount);

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