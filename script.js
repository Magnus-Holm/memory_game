/*jslint browser, for, this*/


var tileImgs = ['breath', 'space', 'time', 'light', 'void', 'heart', 'blood', 'mind', 'hope', 'life', 'doom', 'rage'];
var board = document.getElementById('board');
var tilesFlipped = [];
var tilesMatch = [];
var i;


//---------- Music Related ----------
// Song and song name arrys
var songs = ['Skies_of_Skaia.mp3', 'Unite_Synchronization.mp3', 'Savior_of_the_Dreaming_Dead.mp3', 'Homefree.mp3'];
var songName = ['Skies of Skaia - Homestuck', 'Unite Synchronization - Homestuck', 'Savior of the Dreaming Dead - Homestuck', 'Homefree - Homestuck'];

// Connects the JavaScript with the HTML objects
var fanfare = document.getElementById('victory_music');
var currentSong = document.getElementById('bg_music');
var currentSongName = document.getElementById('currentSongName');

// Keeps track of what song is playing and the name displayed
var song_index = 0;

// Sets the default song and song name

function drawBoard(event) {
    'use strict';
    event.preventDefault();
    document.getElementById('welcome').style.display = 'none';
    board.style.display = 'flex';

    var gameTiles = document.getElementById('playGame').level.value;
    var gameTileImgs = tileImgs.slice(0, gameTiles / 2);
    gameTileImgs = gameTileImgs.doubleShuffle();
    var content;
    for (i = 0; i < gameTileImgs.length; i += 1) {
        content = "";
        content += '<section>';
        content += '<div class="front"></div>';
        content += '<div class="back"><img src="img/' + gameTileImgs[i] + '.png"></div>';
        content += '</section>';

        board.insertAdjacentHTML('beforeend', content);
    }
}

Array.prototype.doubleShuffle = function () {
    'use strict';

    var d;
    for (d = 0; d < this.length; d += 2) {
        this.splice(d + 1, 0, this[d]);
    }
    i = this.length;
    var j;
    var temp;
    while (--i > 0) {
        j = Math.floor(Math.random() * (i + 1));
        temp = this[j];
        this[j] = this[i];
        this[i] = temp;
    }
    return this;
};

function newGame() {
    'use strict';

    board.innerHTML = "";
    board.style.display = 'none';
    document.getElementById('welcome').style.display = 'flex';
    fanfare.pause();
    fanfare.currentTime = 0;
    currentSong.play();
    document.getElementById('message').classList.remove('show');
}

function endOfGame() {
    'use strict';

    if (board.getElementsByTagName('section').length === board.getElementsByClassName('reward').length) {
        currentSong.pause();
        fanfare.play();
        document.getElementById('message').classList.add('show');
    }
}

function flipBack() {
    'use strict';

    var tiles = board.querySelectorAll('section');
    tiles[tilesFlipped[0]].classList.remove('flipped');
    tiles[tilesFlipped[1]].classList.remove('flipped');
    tilesFlipped = [];
    tilesMatch = [];
    board.style.pointerEvents = 'auto';
}


function twoTiles(tiles) {
    'use strict';

    if (tilesFlipped.length >= 2) {
        board.style.pointerEvents = 'none';
        if (tilesMatch[0] === tilesMatch[1]) {
            tiles[tilesFlipped[0]].classList.add('reward');
            tiles[tilesFlipped[1]].classList.add('reward');
            tilesFlipped = [];
            tilesMatch = [];
            setTimeout(endOfGame, 500);
            board.style.pointerEvents = 'auto';

        } else {
            setTimeout(flipBack, 700);
        }
    }
}


function flipTile(event) {
    'use strict';

    var tiles = Array.from(board.querySelectorAll('section'));
    if (event.target !== event.currentTarget && event.touches.length === 1) {
        if (event.target.nodeName !== 'IMG') {
            event.target.parentNode.classList.add('flipped');
            tilesFlipped.push(tiles.indexOf(event.target.parentNode));
            tilesMatch.push(event.target.nextElementSibling.innerHTML);
            twoTiles(tiles);
        }
    }
}

function prev_song() {
    'use strict';
    currentSong.pause();
    currentSong.currentTime = 0;
    if (song_index === 0) {
        song_index = songs.length - 1;
    } else {
        song_index -= 1;
    }
    currentSongName.innerHTML = "Current Song : " + songName[song_index];
    currentSong.src = songs[song_index];
    currentSong.play();
}

function next_song() {
    'use strict';
    currentSong.pause();
    currentSong.currentTime = 0;
    if (song_index === songs.length - 1) {
        song_index = 0;
    } else {
        song_index += 1;
    }
    currentSongName.innerHTML = "Current Song : " + songName[song_index];
    currentSong.src = songs[song_index];
    currentSong.play();
}

board.addEventListener('touchstart', flipTile);
document.getElementById('message').getElementsByTagName('button')[0].addEventListener('click', newGame);
document.getElementById('playGame').addEventListener('submit', drawBoard);
document.getElementsByTagName('body').addEventListener('onload', currentSong.play());