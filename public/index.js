async function createUserAccount() {
  event.preventDefault();

  const uName = document.getElementById('newUsername').value;
  const newPass = document.getElementById('newPass').value;
  const repPass = document.getElementById('newPassRepeat').value;

  if (newPass !== repPass) {
    console.log("Passwords don't match");
    return;
  }

  try {
    const response = await fetch('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: uName, password: newPass }),
    });
    if (response.ok) {
      // If the request was successful
      console.log('User created successfully');
      const userData = await response.json();
      console.log(userData);
      createAccountFolder(uName);
      document.getElementById('registrationContainer').style.display = 'none';
      document.getElementById('loginContainer').style.display = 'block';
    } else {
        // Handle server errors or user creation issues
        console.error('Error creating user: Server responded with status', response.status);
        const errorData = await response.json();
        console.error(errorData);
    }
  } catch (error) {
      console.error('Error creating user', error);
  }
}

async function userLogin () {
  event.preventDefault();

  const uName = document.getElementById('username').value;
  const pass = document.getElementById('pass').value;

  if (!uName || !pass) {
    return
  }

  try {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: uName, password: pass }),
    }); 
    if (response.ok) {
      console.log(`${currentUser} is now logged in!`);
    }
  } catch (error) {
    console.error('Username or password did not match.');
  }
}

async function submitDocument(event) {
  event.preventDefault();

  let duplicatechecker;
  let audioContainer = document.getElementById('audiobook');
  const file = document.getElementById('fileInput').files[0];
  const fileName = grabNameUntilPeriod(document.getElementById('fileInput').files[0].name);
  const formData = new FormData();
  formData.append('document', file);
  try {
    const response = await fetch('/api/rapidapi', {
      method: 'POST',
      body: formData
    });
    const data = await response.text();
    if(data != "[]"){ // prevents audio saving if the document has no text in it
      try {
        const response = await fetch('/api/checkFiles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({username: currentUser, fileName: String(fileName)})
        });
        duplicatechecker = await response.text();
      } catch (error) {
        console.error('File Checking Error:', error);
      }
      // console.log(duplicatechecker);
      if(duplicatechecker == 'false'){
        console.log('Creating audio file.')
        audioContainer.innerHTML = 'Generating audio file, please wait!';
        try { 
          const response = await fetch('/api/saveAudio', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: String(data), username: currentUser, fileName: String(fileName)})
          });
          displayAudio(fileName);
        } catch (error) {
          console.error('Error saving audio:', error);
        }
      }
      else{
        audioContainer.innerHTML = 'Error a file with the same name as the submitted documents name already exists';
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

function displayAudio(fileName) {
  let audio = document.createElement('audio');
  
  audio.src = `./uploads/${currentUser}/audio/${fileName}.mp3`;
  audio.controls = true;
  
  let audioContainer = document.getElementById('audiobook');
  
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

// creates the users folder (will be combined with the main account creation method once db functions are implemented)
async function createAccountFolder(user){ 
  try{ 
    const response = await fetch('/api/createUserFolders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username: user})
    });
  } catch (error) {
    console.error('Error creating user folder', error);
  }
}

async function deleteAccountFolder(){ // deletes the users folder (will be combined with the main account creation method once db functions are implemented)
  try{
    const response = await fetch('/api/deleteUserFolder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({userId: String(currentUser)})
      
    });
    //const data = await response.text();
  } catch (error) {
    console.error('Error creating user folder', error);
  }
}

async function deleteSingleAudio(){ // most likely include a call to either get the audio name or import it in 
  try{
    const response = await fetch('/api/deleteUserFolder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({userId: String(currentUser)})
      
    });
    //const data = await response.text();
  } catch (error) {
    console.error('Error creating user folder', error);
  }
}

function closeForm(container) {
  if (container === 'loginContainer') {
    document.getElementById('loginContainer').style.display = 'none';
  } else if (container === 'registrationContainer') {
    document.getElementById('registrationContainer').style.display = 'none';
  }
}

document.getElementById('documentUploadForm').addEventListener('submit', submitDocument);
document.getElementById('accountFolderDeletion').addEventListener("click", deleteAccountFolder);
document.getElementById('registrationContainer').addEventListener('submit', createUserAccount);
document.getElementById('loginContainer').addEventListener('click', userLogin);
// document.getElementById('accountFolderCreation').addEventListener("click", createAccountFolder);