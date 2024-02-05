var textFromFirstPage = localStorage.getItem('textToPass');
document.getElementById('pageText').innerHTML = textFromFirstPage;

console.log('Text from local storage:\n', textFromFirstPage)