  function ApiCall(fileInput) {
    const url = 'https://converter12.p.rapidapi.com/api/converter/1/FileConverter/Convert';
    const apiKey = 'ab6b46a31fmsh1f25f693eb7e577p16be18jsnfae41224bd8d'; // Replace with your actual API key
  
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