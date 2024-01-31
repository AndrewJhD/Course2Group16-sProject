  function ApiCall(fileInput) {
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
  
  document.getElementById('fileInput').addEventListener('change', function() {
    ApiCall(this);
  });

var loginModal = document.getElementById('loginButton');

var btn = decument.getElementById('login');

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