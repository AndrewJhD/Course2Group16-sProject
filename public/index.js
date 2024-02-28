// Assuming you are using fetch in your frontend
fetch('/verify', {
  method: 'GET',
}).then(response => {
  if (response.ok) {
    document.getElementById('loginContainer').style.display = 'none'; //closes menu on valid login
    document.getElementById('interactionButtons').style.display = 'none';
    document.querySelector('.preconvertDiv').style.display = 'none';
    document.getElementById('Hiddenbrowse').style.display = 'block';
    document.querySelector('.converterDiv').style.display = 'block';
    document.querySelector('.signOut').style.display = 'block';
    document.getElementById('registerBento').style.display = 'none';
    currentUser = localStorage.getItem(username);
    createAudioLibrary();
  } else {
      return;
  }
});

async function createUserAccount() {
  event.preventDefault();

  const uName = document.getElementById('newUsername').value;
  const newPass = document.getElementById('newPass').value;
  const repPass = document.getElementById('newPassRepeat').value;
  //console.log(uName);
  //console.log(newPass);
  //console.log(repPass);
  
  if(!validateRegisterFormInput(uName, newPass, repPass)){
    return;
  }

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
      resetRegisterForm();

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

function validateRegisterFormInput(uName, newPass, repPass){
  var emptyFields = [];
  document.querySelector('.reg-warning-text').style.display = 'none';
  document.querySelector('.empty-reg-user').style.display = 'none';
  document.querySelector('.empty-reg-pass').style.display = 'none';
  document.querySelector('.empty-reg-confirmpass').style.display = 'none';
  document.querySelector('.reg-pass-warning-short-text').style.display = 'none';
  document.querySelector('.reg-pass-warning-long-text').style.display = 'none';
  if (newPass !== repPass) {
    //console.log("Passwords don't match");
    document.querySelector('.reg-warning-text').style.display = 'block';
    if(newPass.length < 8){
      document.querySelector('.reg-pass-warning-short-text').style.display = 'block';
      return false;
    }
    else if(newPass.length > 25){
      document.querySelector('.reg-pass-warning-long-text').style.display = 'block';
      return false;
    }
    return false;
  }
  else{
    if(!uName || !newPass || !repPass){

      if (uName === '') {
          emptyFields.push('Username');
          document.querySelector('.empty-reg-user').style.display = 'block';
      }
      if (newPass === '') {
          emptyFields.push('Password');
          document.querySelector('.empty-reg-pass').style.display = 'block';
      }
      if (repPass === '') {
          emptyFields.push('Email');
          document.querySelector('.empty-reg-confirmpass').style.display = 'block';
      }

      if (emptyFields.length > 0) {
        //var message = 'Please fill in the following fields:\n' + emptyFields.join(', ');
        //alert(message); 
        return false;
      }
    }
    else if(newPass.length < 8){
      document.querySelector('.reg-pass-warning-short-text').style.display = 'block';
      return false;
    }
    else if(newPass.length > 25){
      document.querySelector('.reg-pass-warning-long-text').style.display = 'block';
      return false;
    }
  }
  return true;
}

async function userLogin () {
  event.preventDefault();

  const uName = document.getElementById('username').value;
  const pass = document.getElementById('pass').value;

  if (!validateLoginFormInput(uName, pass)) {
    return;
  }

  try {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: uName, password: pass }),
    }); 
    console.log(response);
    if (response.ok) {
      localStorage.setItem(username, uName);
      currentUser = localStorage.getItem(username);
      console.log(`${currentUser} is now logged in!`);
      document.getElementById('loginContainer').style.display = 'none'; //closes menu on valid login
      document.getElementById('interactionButtons').style.display = 'none';
      document.querySelector('.login-warning-text').style.display = 'none';
      document.querySelector('.preconvertDiv').style.display = 'none';
      document.getElementById('Hiddenbrowse').style.display = 'block';
      document.querySelector('.converterDiv').style.display = 'block';
      document.querySelector('.signOut').style.display = 'block';
      document.getElementById('registerBento').style.display = 'none';
      resetLoginForm();
      createAudioLibrary();
    }
    else{
      document.querySelector('#login-warning-text').style.display = 'block';
    }
  } catch (error) {
      console.error(error);
  }
}

function validateLoginFormInput(uName, pass){
  var emptyFields = [];
  document.querySelector('.empty-login-user').style.display = 'none';
  document.querySelector('.empty-login-pass').style.display = 'none';
  if(!uName || !pass){

    if (uName === '') {
        emptyFields.push('Username');
        document.querySelector('.empty-login-user').style.display = 'block';
    }
    if (pass === '') {
        emptyFields.push('Password');
        document.querySelector('.empty-login-pass').style.display = 'block';
    }
   

    if (emptyFields.length > 0) {
      //var message = 'Please fill in the following fields:\n' + emptyFields.join(', ');
      //alert(message); 
      return false;
    }
  }
  return true;
}

async function userLogout() {
  try {
    const response = await fetch('/auth/logout', {
      method: 'GET',
    });
    console.log(response);
    if (response.ok) {
      localStorage.clear();
      if(isBrowseDisplayed){
        focusHome();
      }
    }
  } catch (error) {
    console.error('Something went wrong. Please try again.');
  }
      document.getElementById('interactionButtons').style.display = 'block';
      //document.querySelectorAll('#login-error-text').style.display = 'none';
      //document.querySelectorAll('#register-error-text').style.display = 'none';
      document.getElementById('Hiddenbrowse').style.display = 'none';
      document.querySelector('.converterDiv').style.display = 'none';
      document.querySelector('.preconvertDiv').style.display = 'block';
      document.getElementById('signOut').style.display = 'none';
      document.getElementById('registerBento').style.display = 'block';
}

async function submitDocument(event) {
  event.preventDefault();

  let duplicatechecker;
  let audioContainer = document.getElementById('audiobook');
  const file = document.getElementById('fileInput').files[0];
  const fileName = grabNameUntilPeriod(document.getElementById('fileInput').files[0].name);
  const formData = new FormData();
  formData.append('document', file);
  audioContainer.innerHTML = "Converting your document please be patient";
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
          document.getElementById('documentUploadForm').reset();
          console.log("doc finished converting");
        } catch (error) {
          console.error('Error saving audio:', error);
        }
        //add entry stuff here
        try{
          const response = await fetch('/api/newentry', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: currentUser, fileName: String(fileName)})
          });
        }catch (error) {
          console.error('Error saving audio:', error);
        }
      }
      else{
        audioContainer.innerHTML = 'Uh oh! A file with the same name as the submitted documents name already exists';
      }
 
    }
    else{
      audioContainer.innerHTML = 'Oops! The submitted document was found to be empty!';
    }
  } catch (error) {
    console.error('Error submitting document:', error);
  }

}

function displayAudio(fileName) {
  let audio = document.createElement('audio');
  
  audio.src = `./uploads/${currentUser}/audio/${fileName}.mp3`;
  audio.controls = true;
  
  let audioContainer = document.getElementById('audiobook');
  
  audioContainer.innerHTML = '';
  
  audioContainer.appendChild(audio);

  AddEntry(fileName);
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
    console.error('Error deleting user folder', error);
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
    console.error('Error deleting audio', error);
  }
}
async function getAudioNames(){ // get entries heres
  const response = await fetch('/api/allentry', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
  });
  
  const files = await response.json();
  //console.log("printing array")
  //console.log(files);
  //console.log("finished array")
  return files;
}

function AddEntry(fileName){
  var div = document.createElement('div');
  // Create title
  var h2 = document.createElement('h2');
  h2.textContent = fileName;
  h2.classList.add('bookTitle');

  // Create audio element
  var audio = document.createElement('audio');
  audio.controls = true;
  var source = document.createElement('source');
  source.src = `./uploads/${currentUser}/audio/${fileName}.mp3`;
  audio.appendChild(source);
  audio.classList.add('bookAudio');

  // Append h2 and audio elements to the div
  div.appendChild(h2);
  div.appendChild(audio);
  div.classList.add('bookItem');
  document.getElementById('audioLibrary').appendChild(div);
}

async function createAudioLibrary() {
  const data = await getAudioNames();
  //console.log("printing data:");
  //console.log(data[0].fileName);
  for (let i in data){
    //here is where you can get the filename and ownername
      let fileName = data[i].fileName;
      AddEntry(fileName);      
  }
}


function closeLoginForm() {
    document.getElementById('loginContainer').style.display = 'none';
    document.querySelector('#login-error-text').style.display = 'none';
}

function closeRegisterForm(){
    document.querySelector('.register-error-text').style.display = 'none';
    document.getElementById('registrationContainer').style.display = 'none';
}

function submitRForm(e) {
  if (e.keyCode === 13 && registrationContainer.style.display != 'none') {
    createUserAccount();
  }
}

function submitLForm(e) {
  if (e.keyCode === 13 && loginContainer.style.display != 'none') {
    userLogin();
  }
}

function registrationOpen()
{
  document.getElementById('registrationContainer').style.display='block';
}
function loginOpen()
{
  document.getElementById('loginContainer').style.display='block';
}

function focusHome(){
    //console.log("focusing home");
    document.querySelector('.home').style.display = 'block';
    document.querySelector('.aboutUs').style.display = 'none';
    document.querySelector('.browse').style.display = 'none';
    
  // focus the current page's button
    document.getElementById('homeFocusBtn').classList.add('special');
    document.getElementById('aboutUsFocusBtn').classList.remove('special');
    document.getElementById('browseFocusBtn').classList.remove('special');
    document.getElementById('register').style.display = 'none';
}

function focusAbout(){
  //console.log("focusing aboutUs");
  document.querySelector('.home').style.display = 'none';
  document.querySelector('.aboutUs').style.display = 'block';
  document.querySelector('.browse').style.display = 'none';

  document.getElementById('register').style.display = 'block';
  document.getElementById('homeFocusBtn').classList.remove('special');
  document.getElementById('aboutUsFocusBtn').classList.add('special');
  document.getElementById('browseFocusBtn').classList.remove('special');
}
function focusBrowse(){
  //console.log("focusing browse");
  document.querySelector('.home').style.display = 'none';
  document.querySelector('.aboutUs').style.display = 'none';
  document.querySelector('.browse').style.display = 'block';

  document.getElementById('homeFocusBtn').classList.remove('special');
  document.getElementById('aboutUsFocusBtn').classList.remove('special');
  document.getElementById('browseFocusBtn').classList.add('special');
}

function isBrowseDisplayed() {
  var browseElement = document.querySelector('.browse');
  var computedStyle = window.getComputedStyle(browseElement);
  return computedStyle.display === "block";
}

function resetLoginForm() {
  document.getElementById('username').value = "";
  document.getElementById('pass').value = "";
}

function resetRegisterForm() {
  document.getElementById('newUsername').value = "";
  document.getElementById('newPass').value = "";
  document.getElementById('newPassRepeat').value = "";
}

//sign out button
document.getElementById('signOut').addEventListener('click', userLogout);
//form focus buttons
document.getElementById('homeFocusBtn').addEventListener('click', focusHome);
document.getElementById('aboutUsFocusBtn').addEventListener('click', focusAbout);
document.getElementById('browseFocusBtn').addEventListener('click', focusBrowse);
//close form buttons
document.getElementById("closeLogin").addEventListener("click", function() {
  resetLoginForm();
  closeLoginForm();
});
document.getElementById("closeRegister").addEventListener("click", function() {
  resetRegisterForm();
  closeRegisterForm();
});
//open form buttons
document.getElementById('logIn').addEventListener('click', loginOpen);
document.getElementById('register').addEventListener('click', registrationOpen);
//form submit buttons
document.getElementById('documentUploadForm').addEventListener('submit', submitDocument);
document.getElementById('signUpBtn').addEventListener('click', createUserAccount);
document.getElementById('loginBtn').addEventListener('click', userLogin);
//submit forms using return 
document.addEventListener('keypress', function() {submitRForm(event)}, false);
document.addEventListener('keypress', function() {submitLForm(event)}, false);
