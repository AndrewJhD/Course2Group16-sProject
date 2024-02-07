let currentPage = 0;
const book = createBook()
const bookLength = book.length

let pageText = document.getElementById('pageText')
let prevButton = document.getElementById('prevArrow')
prevButton.style.visibility = 'hidden'
let nextButton = document.getElementById('nextArrow')

const pageSelecter = document.getElementById('pageSelector')
populatePageSelector();

pageText.innerHTML = book[currentPage];



function createBook(){
    let text = localStorage.getItem('textToPass');
    let textArray = text.replace("undefined", "unspecified").split(" ")
    
    let charAmount = 0;
    let page = "";
    let i = 0;
    let maxCharOnPage = 2000;
    let book = [];

    while (i < textArray.length + textArray.length/2) {
        let word = textArray[i] + " ";
        if (word == "undefined "){
            book.push(page);
            console.log(textArray.length)
            return book
        }

        page += word;
        charAmount += word.length;
        i += 1;

        if (charAmount > maxCharOnPage) {
            book.push(page);
            page = "";
            charAmount = 0;
        }
        
    }
    return book
}
// console.log(createBook())


function changePage(nextOrPrev) {
    currentPage += nextOrPrev
    pageText.innerHTML = book[currentPage];

    pageSelecter.value = currentPage

    checkPageNum()
}


function populatePageSelector() {
    let range = Array.from(new Array(bookLength), (x, i) => i);
    for (i in range) {
        const option = document.createElement("option");
        option.textContent = "Page: " + (parseInt(i)+1).toString()
        option.value = parseInt(i)

        pageSelecter.appendChild(option)
    }
}

function selectPage(){
    currentPage = parseInt(pageSelecter.value)
    pageText.innerHTML = book[currentPage];

    checkPageNum()
}

function checkPageNum(){
    if (currentPage <= 0) {
        prevButton.style.visibility = 'hidden'
    }else {prevButton.style.visibility = 'visible'}

    if (currentPage >= bookLength-1) {
        nextButton.style.visibility = 'hidden'
    }else {nextButton.style.visibility = 'visible'}
}