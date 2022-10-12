
var audio = document.getElementById("music"); /*設id*/
var btnPlay = document.getElementById("btnPlay");
var volValue = document.getElementById("volValue");
var volInfo = document.getElementById("volInfo");
var info = document.getElementById("info");
var song = document.getElementById("song");
var progress = document.getElementById("progress");
var book = document.getElementById("book");
console.log(audio.children[0].title);
//book.parentNode

song.addEventListener('change', function () {
    changeMusic(song.selectedIndex);
});

var option;
var tBook = book.children[1];
function UpdateMusic() {

    //移除目前下拉選單中的所有歌曲
    for (var j = song.children.length - 1; j >= 0; j--) { //陣列=>長度
        song.removeChild(song.children[j]);
    }

    //再抓歌本中的歌曲給下拉選單
    for (var i = 0; i < tBook.children.length; i++) {
        option = document.createElement("option"); //<option></option>
        option.innerText = tBook.children[i].innerText;
        option.value = tBook.children[i].title;
        song.appendChild(option);
    }

    if (!book.children[1].children.length) {
        for (var j = song.children.length - 1; j >= 0; j--) { //陣列=>長度
            song.removeChild(song.children[j]);
        }
        for (var i = 0; i < book.children[0].children.length; i++) {
            option = document.createElement("option"); //<option></option>
            option.innerText = book.children[0].children[i].innerText;
            option.value = book.children[0].children[i].title;
            song.appendChild(option);
            
        }

    }
    
    changeMusic(0);
}

function allowDrop(ev) { //event
    ev.preventDefault(); //停止物件預設行為
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault(); //停止物件預設行為
    var data = ev.dataTransfer.getData("text");
    console.log(ev.target)
    if (ev.target.id == "")
        ev.target.appendChild(document.getElementById(data));
    else
        ev.target.parentNode.appendChild(document.getElementById(data));
}

var sBook = book.children[0];
var option;
for (var i = 0; i < sBook.children.length; i++) {
    sBook.children[i].draggable = "true";
    sBook.children[i].id = "song" + (i + 1);
    sBook.children[i].addEventListener('dragstart', function () {
        drag(event);
    });
    option = document.createElement("option"); //<option></option>
    option.innerText = sBook.children[i].innerText;
    option.value = sBook.children[i].title;
    song.appendChild(option);
}
changeMusic(0);

function songBook() {
    book.className = book.className == "" ? "hide" : "";
}

//全部循環
function setAllLoop() {
    info.children[2].innerText = info.children[2].innerText == "全部循環" ? "" : "全部循環";
}

//隨機撥放
function setRandom() {
    info.children[2].innerText = info.children[2].innerText == "隨機撥放" ? "" : "隨機撥放";
}

//單曲循環
function setLoop() {
    info.children[2].innerText = info.children[2].innerText == "單曲循環" ? "" : "單曲循環";
}

//設定靜音
function setMuted() {
    audio.muted = !audio.muted; //toggle情形可用
}

//時間軸
function setTimeBar() {
    audio.currentTime = progress.value;
}

//上一首下一首
function changeSong(i) {
    var index = song.selectedIndex + i;

    if (i == 1 && song.selectedIndex == song.options.length - 1)
        changeMusic(0);
    else if (i == -1 && song.selectedIndex == 0)
        changeMusic(song.options.length - 1);
    else
    changeMusic(index);
}

//歌曲切換
var musicObj, musicIndex = 0;
function changeMusic(i) { //原先evt為參數取的名，將事件視為物件

    song.options[i].selected = true;
    audio.children[0].src = song.options[i].value;
    audio.children[0].title = song.options[i].innerText;
    audio.load();

    if (btnPlay.innerText == ";")
        Play();
}

//時間格式轉換
var min = 0, sec = 0, min2 = 0, sec2 = 0;
function getTimeFormat(timeSec) { //取得當下時間(抓引數轉為參數)
    min = parseInt(timeSec / 60);
    sec = parseInt(timeSec % 60); //取餘數
    min = min < 10 ? "0" + min : min; //3元運算子
    sec = sec < 10 ? "0" + sec : sec;

    return min + ":" + sec;
}

//取得歌曲撥放時間
function getDuration() {

    progress.max = parseInt(audio.duration);
    progress.value = parseInt(audio.currentTime);

    var w = (audio.currentTime / audio.duration * 100) + "%";
    progress.style.backgroundImage = "-webkit-linear-gradient(left,#b60000,#b60000 " + w + ", #c8c8c8 " + w + ",#c8c8c8)";

    info.children[1].innerText = getTimeFormat(audio.currentTime) + " / " + getTimeFormat(audio.duration); // 當下時間/固定時間
    setTimeout(getDuration, 10); /*時間到後想要執行的函式內容(毫秒)*/

    if (audio.currentTime == audio.duration) {
        if (info.children[2].innerText == "隨機撥放") {
            var n = Math.floor(Math.random() * song.options.length);
            changeMusic(n);
        }
        else if (info.children[2].innerText == "全部循環" && song.selectedIndex == song.options.length - 1) {
            changeMusic(0);
        }
        else if (info.children[2].innerText == "單曲循環") {
            //chagneMusic(song.selectedIndex);
            changeSong(0);
        }
        else if (song.selectedIndex == song.options.length - 1) {
            Stop();
        }
        else
            changeSong(1);
    }
}

//撥放&暫停
function Play() {
    if (audio.paused) {
        audio.play();
        btnPlay.innerText = ";";
        info.children[0].innerText = "現在播放:" + audio.children[0].title;
        getDuration();
    }
    else {
        audio.pause();
        btnPlay.innerText = "4";
        info.children[0].innerText = "音樂暫停中";
    }

}

//function Pause() {
//    audio.pause();
//}

//停止撥放
function Stop() {
    audio.pause();
    audio.currentTime = 0; //指定至第0秒
    btnPlay.innerText = "4";
    info.children[0].innerText = "已停止撥放";
}

//快轉&倒轉
function changeTime(t) {
    audio.currentTime += t;
}

//音量微調
function changeVolume(v) {
    //audio.volume += v;
    volValue.value = parseInt(volValue.value) + v;
    setVolume();
}

//音量調整
setVolume()
function setVolume() {
    volInfo.value = volValue.value;
    audio.volume = volValue.value / 100;

    var z = volValue.value + "%";
    volValue.style.backgroundImage = "-webkit-linear-gradient(left,#009d72,#009d72 " + z + ", #c8c8c8 " + z + ",#c8c8c8)";
}