let dataEx = {
    0: {
        title: "Percy Jackson and the Lightning Theif",
        audio: "",
    },
    1: {
        title: "Percy Jackson and the sea of monsters",
        audio: "",
    },
    2: {
        title: "Percy Jackson and the titans curse",
        audio: "",
    },
    3: {
        title: "Percy Jackson and the battle of the labyrinth",
        audio: "",
    },
    4: {
        title: "Percy Jackson and the last olympian",
        audio: "",
    },
    5: {
        title: "Harry Potter and the sorcerers stone",
        audio: "",
    },
    6: {
        title: "Harry Potter and the chamber of secrets",
        audio: "",
    },
    7: {
        title: "Harry Potter and the prizoner of azkaban",
        audio: "",
    },
    8: {
        title: "Harry Potter and the goblet of fire",
        audio: "",
    },
    9: {
        title: "Harry Potter and the order of the phoenix",
        audio: "",
    },
    10: {
        title: "Harry Potter and the half blood prince",
        audio: "",
    },
    11: {
        title: "Harry Potter and the dealthy hallows",
        audio: "",
    },
};

function createAudioLibrary() {
    for (let i in dataEx){
        let title = dataEx[i].title
        let audioSource = dataEx[i].audio
        
        // Create div element
        var div = document.createElement('div');

        // Create h2 book title element
        var h2 = document.createElement('h2');
        h2.textContent = title;
        h2.classList.add('bookTitle')

        // Create audio element
        var audio = document.createElement('audio');
        audio.controls = true;
        var source = document.createElement('source');
        source.src = audioSource;
        audio.appendChild(source);
        audio.classList.add('bookAudio')

        // Append h2 and audio elements to the div
        div.appendChild(h2);
        div.appendChild(audio);
        div.classList.add('bookItem');
        document.getElementById('audioLibrary').appendChild(div);
    }
}
createAudioLibrary()
