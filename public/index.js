async function submitDocument(event) {
    event.preventDefault();
    var audioContainer = document.getElementById('audiobook');
    audioContainer.innerHTML = 'Audio in creation please wait!';
    const file = document.getElementById('fileInput').files[0];
    //console.log(file);
    const fileName = grabNameUntilPeriod(document.getElementById('fileInput').files[0].name);
    //console.log(localStorage.fileName)
    const formData = new FormData();
    formData.append('document', file);
    try {
      const response = await fetch('/api/rapidapi', {
        method: 'POST',
        body: formData
      });
      const data = await response.text();
      //console.log(data);
      if(data != "[]"){ // prevents audio saving if the document has no text in it
        try {
          
          const response = await fetch('/api/saveAudio', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: String(data), userId: String(localStorage.userId), fileName: String(fileName)})
          });
          //const data2 = await response.text();

          displayAudio(fileName);
          
        } catch (error) {
          console.error('Error saving audio:', error);
        }
      }
      else{
          audioContainer.innerHTML = 'Error the submitted document is empty';
      }
    } catch (error) {
      console.error('Error submitting document:', error);
    }
    document.getElementById('documentUploadForm').reset();
}
function createUser() {
  var userData = document.getElementById('userdata');

}

function displayAudio(fileName) {
  var audio = document.createElement('audio');
  
  audio.src = `./uploads/${localStorage.userId}/audio/${fileName}.mp3`;
  audio.controls = true;
  
  var audioContainer = document.getElementById('audiobook');
  
  audioContainer.innerHTML = '';

  audioContainer.appendChild(audio);
}

function grabNameUntilPeriod(input) {
  let result = '';
  for (let i = 0; i < input.length; i++) {
      if (input[i] === '.') {
          break;
      }
      result += input[i];
  }
  return result;
}
async function createAccount(){ // creates the users folder (will be combined with the main account creation method once db functions are implemented)
  localStorage.userId = 'u4321'; // this will also be removed when db gets implemented as this variable will be grabbed when the user signs in
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

async function deleteAccount(){ // deletes the users folder (will be combined with the main account creation method once db functions are implemented)
  localStorage.userId = 'u4321'; // this will also be removed when db gets implemented as this variable will be grabbed when the user signs in
  try{
    const response = await fetch('/api/deleteUserFolder', {
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
  if (newpsw == reppsw){ //confirms inputted passed match
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
    console.log("passwords dont match");
  }
  
}

document.getElementById('documentUploadForm').addEventListener('submit', submitDocument);
document.getElementById('accountFolderCreation').addEventListener("click", createAccount);
document.getElementById('accountFolderDeletion').addEventListener("click", deleteAccount);
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