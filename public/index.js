async function submitDocument(event) {
    event.preventDefault();
    var duplicatechecker;
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
          const response = await fetch('/api/checkFiles', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({userId: String(localStorage.userId), fileName: String(fileName)})
          });

          duplicatechecker = await response.text();
        } catch (error) {
          console.error('File Checking Error:', error);
        }
        console.log(duplicatechecker);
        if(duplicatechecker == 'false'){
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
async function createAccountFolder(){ // creates the users folder (will be combined with the main account creation method once db functions are implemented)
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

async function deleteAccountFolder(){ // deletes the users folder (will be combined with the main account creation method once db functions are implemented)
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

async function deleteSingleAudio(){ // most likely include a call to either get the audio name or import it in 
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
  
  try {
    const validNameResponse = await fetch('/api/user/checkUsername', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username: uName}) // Ensure the key matches what the server expects
    });

    const validName = await validNameResponse.json(); // Parse the JSON response

    // Check if the username is taken based on the response. Assuming the API returns { exists: true/false }
    if (!validName.exists) {
      if (newpsw === reppsw) { // Confirms inputted passwords match
        console.log('Passwords match');

        try {
          const response = await fetch('/api/user/newuser', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({newUserName: uName, newPassword: newpsw})
          });

          if (response.ok) {
            // If the request was successful
            console.log('User created successfully');
            const userData = await response.json();
            console.log(userData);
            // You might want to redirect the user or clear the form here
          } else {
            // Handle server errors or user creation issues
            console.error('Error creating user: Server responded with status', response.status);
          }
        } catch (error) {
          console.error('Error creating user', error);
        }
      } else {
        console.log("Passwords don't match");
      }
    } else {
      console.log("Username taken!");
    }
  } catch (error) {
    console.error('Error checking username availability', error);
  }

}

document.getElementById('documentUploadForm').addEventListener('submit', submitDocument);
document.getElementById('accountFolderCreation').addEventListener("click", createAccountFolder);
document.getElementById('accountFolderDeletion').addEventListener("click", deleteAccountFolder);
document.getElementById('registrationForm').addEventListener('submit', createUserAccount);

function closeForm(container) {
  if (container === 'loginContainer') {
    document.getElementById('loginContainer').style.display = 'none';
  } else if (container === 'registrationContainer') {
    document.getElementById('registrationContainer').style.display = 'none';
  }
}

// var loginModal = document.getElementById('loginButton');
// var btn = document.getElementById('login');
// var span = document.getElementsByClassName("close")[0];

// btn.onclick = function() {
//   loginModal.style.display = "block";
// }
        
// window.onclick = function(event) {
//     if (event.target == loginModal) {
//         loginModal.style.display = "none";
//     }
// }


// document.addEventListener('click', handleOutsideClick);



// var modal = document.getElementById('registerBtn');

// window.onclick = function(event) {
//   if(event.target == modal) {
//     modal.style.display = "none";
//   }
// }