const synth = window.speechSynthesis;

const inputForm = document.querySelector("form");
const inputTxt = document.querySelector(".txt");
let text2Speak = "";
const voiceSelect = document.querySelector("select");

const pitch = document.querySelector("#pitch");
const pitchValue = document.querySelector(".pitch-value");
const rate = document.querySelector("#rate");
const rateValue = document.querySelector(".rate-value");

let voices = [];

function populateVoiceList() {
    voices = synth.getVoices().sort(function(a, b) {
        const aname = a.name.toUpperCase();
        const bname = b.name.toUpperCase();

        if (aname < bname) {
            return -1;
        } else if (aname == bname) {
            return 0;
        } else {
            return +1;
        }
    });
    const selectedIndex =
        voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
    voiceSelect.innerHTML = "";

    for (let i = 0; i < voices.length; i++) {
        const option = document.createElement("option");
        option.textContent = `${voices[i].name} | (${voices[i].lang})`;

        if (voices[i].default) {
            option.textContent += " -- DEFAULT";
        }

        option.setAttribute("data-lang", voices[i].lang);
        option.setAttribute("data-name", voices[i].name);
        voiceSelect.appendChild(option);
    }
    voiceSelect.selectedIndex = 9;
}

populateVoiceList();

if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
}

function speak() {
    if (synth.speaking) {
        console.error("speechSynthesis.speaking");
        return;
    }

    if (inputTxt.value !== "") {
        const utterThis = new SpeechSynthesisUtterance(text2Speak);
        console.log(text2Speak)

        utterThis.onend = function(event) {
            continueSpeaking()
        };

        utterThis.onerror = function(event) {
            console.error("SpeechSynthesisUtterance.onerror");
        };

        const selectedOption =
            voiceSelect.selectedOptions[0].getAttribute("data-name");

        for (let i = 0; i < voices.length; i++) {
            if (voices[i].name === selectedOption) {
                utterThis.voice = voices[i];
                break;
            }
        }
        utterThis.pitch = pitch.value;
        utterThis.rate = rate.value;
        synth.speak(utterThis);
    }
}

inputForm.onsubmit = function(event) {
    event.preventDefault();

    speak();

    inputTxt.blur();
};

pitch.onchange = function() {
    pitchValue.textContent = pitch.value;
};

rate.onchange = function() {
    rateValue.textContent = rate.value;
};

voiceSelect.onchange = function() {
    speak();
};

function resetSliders(pitchOrRate) {
    if (pitchOrRate == 'pitch') {
        pitchValue.textContent = 1;
        pitch.value = 1;
    } else {
        rateValue.textContent = 1;
        rate.value = 1;
    }
}

// utterThis.addEventListener("error", (event) => {
//     console.log(
//         `An error has occurred with the speech synthesis: ${event.error}`,
//     );
// });
let playText = true;

function pauseAudio() {
    speechSynthesis.pause()
    console.log("paused")
    playText = false;
}

function resumeAudio() {
    speechSynthesis.resume()
    playText = true;
    console.log("resumed")
}

function cancelAudio() {
    speechSynthesis.cancel()
    console.log("canceled")
}

function printtest() {
    console.log(inputTxt.value)
    console.log(inputTxt.value.replace(/(\r\n|\n|\r)/gm, "").split("."))
}
let counter = 0;
let textArray = [];
let txtLength = 0;

function continueSpeaking() {
    if (counter == 0) {
        speechSynthesis.cancel()
        textArray = inputTxt.value.replace(/(\r\n|\n|\r)/gm, " ").replace(/(\?|!|,)/gm, ".").split(".")
        txtLength = textArray.length;
    } else if (counter >= txtLength) {
        console.log("SpeechSynthesisUtterance.onend");
        return
    }
    text2Speak = textArray[0 + counter];
    counter += 1;
    speak()
}