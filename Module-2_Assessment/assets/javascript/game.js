var Guess = document.getElementById("Guess"); 
var Answer = document.getElementById("Answer");
var Vict = document.getElementById("victories"); 
var Def = document.getElementById("defeats"); 
var Att = document.getElementById("attempts"); 
var directions = document.getElementById("directions");
var img = document.getElementById("pic");
var message = document.getElementById("message");
var attArea = document.getElementById("txtm");
//****************MAIN GAME CODE*************** */
let audio = new Audio('assets/sounds/started.mp3');
                    audio.play();
var gameMain = {
    VictCount: 0, 
    DefCount: 0, 
    attremain: 10,
    wordList: ['BATMAN', 'SONIC', 'RAIDEN', 'MARIO', 'RYU', 'SNAKE', 'DRAGONBORN', 'KRATOS' , 'PIKACHU', 'GERALT', 'LARA CROFT'], //List of words for game
    imgList: ['Batman.jpg', 'Sonic.jpg', 'Raiden.jpg', 'Mario.jpg', 'Ryu.jpg', 'Snake.jpg', 'Dragonborn.jpg', 'Kratos.png', 'Pikachu.png', 'Geralt.png','Lara.jpg'], //List image reference
    ans: "",
    imgsource: "", 
    show: [], incorrect: [],  correct: [], 
    Begin: false,
//****************PAGE RESET CODE*************** */
    pageReset: function() {
        this.attremain = 10; this.incorrect = [];
        this.correct = []; this.show = [];
//****************CHOOSES WORD*************** */
        var randomN = Math.floor(Math.random() * this.wordList.length)
        this.ans = this.wordList[randomN];
        this.imgsource = this.imgList[randomN];
        this.showBlank();

        message.textContent = "INPUT THE LETTERS!";
        Guess.textContent = "GUESSES: ";
        Att.textContent = this.attremain; attArea.value = "";
        let audio = new Audio('assets/sounds/started.mp3');
                    audio.play()
    },
//****************LETTER ATTEMPT CONDITION*************** */
    PriorAtt: function(letter, state) {
        if (state == 1){
            this.correct.push(letter);
        }
        else if (state == 2){
            this.incorrect.push(letter);
        }
    },

    showBlank: function() {
        for (i=0; i<this.ans.length; i++){
            if (underscore(this.ans.charCodeAt(i))){
                this.show.push('_');
            }
            else{
                this.show.push(this.ans[i]);
            }
        }
        Answer.textContent = "";
        for (j=0; j<this.show.length; j++){
            Answer.textContent += (this.show[j] + "\xa0"); 
        }
    },
};

//****************ALTERATION OF HIDDEN LETTERS*************** */
function underscore(keyCode){
    return ((keyCode >= 65 && keyCode <= 90)||(keyCode >= 97 && keyCode <= 122));
}

function validLT(letter){
    return (gameMain.ans.indexOf(letter) != -1);
}

function alterUS(letter){
    for (i=0; i<gameMain.show.length; i++){
        if (letter == gameMain.ans[i]){
            gameMain.show[i] = letter;
        }
    }
    Answer.textContent = "";
    for (j=0; j<gameMain.show.length; j++){
        Answer.textContent += (gameMain.show[j] + "\xa0"); 
    } 
}
//****************CORRECT WORD CONFIRMATION*************** */
function confirmANS(){
    var confirmWORD = "";
    for (i=0; i<gameMain.show.length; i++){
        confirmWORD += gameMain.show[i];
    }
    return (confirmWORD == gameMain.ans);
}

//*********************** KEY START *****************/
document.onkeyup = function(event){
    if (gameMain.Begin == false){
        attArea.value = ""; 
        gameMain.Begin = true;
        directions.textContent = "Your Hints: Mortal Kombat|Tomb Raider|Street Fighter|Pokemon|Metal Gear Solid|Skyrim|Hedgehog|God of War|Witcher|Luigi|Gotham ";
        gameMain.pageReset();
    }
    else if(confirmANS()){
        gameMain.pageReset();
        directions.textContent = "Your Hints: Mortal Kombat|Tomb Raider|Street Fighter|Pokemon|Metal Gear Solid|Skyrim|Hedgehog|God of War|Witcher|Luigi|Gotham ";
    }
    else if (gameMain.attremain > 0){
        var inpKEY;
        var inpCONT;
        if (attArea.value!=""){
            inpKEY = attArea.value;
            inpCONT = inpKEY.charCodeAt(0);
            attArea.value = "";
        }
        else{
            inpKEY = event.key;
            inpCONT = event.keyCode;
        }
        
        if(underscore(inpCONT)){
            var upcase = inpKEY.toUpperCase();
            if (validLT(upcase) && (gameMain.correct.indexOf(upcase)==-1)){
                gameMain.PriorAtt(upcase, 1);
                alterUS(upcase);
                attArea.value = ""; 

                if(confirmANS()){
                    gameMain.VictCount++;
                    Vict.textContent = gameMain.VictCount;
                    message.textContent = "!!!VICTORY!!!";
                    directions.textContent = "PRESS ANY KEY 2 PLAY AGAIN";
                    img.src = "assets/images/" + gameMain.imgsource;
                    let audio = new Audio('assets/sounds/victory.mp3');
                    audio.play()
                }
            }
            else if ((gameMain.incorrect.indexOf(upcase)==-1) && (gameMain.correct.indexOf(upcase)==-1)){
                gameMain.PriorAtt(upcase, 2);
                gameMain.attremain--;

                if(gameMain.attremain == 0){
                    directions.textContent = "PRESS ANY KEY 2 PLAY AGAIN";
                    message.textContent = "DEFEAT! SOLUTION: " + gameMain.ans;
                    let audio = new Audio('assets/sounds/defeat.mp3');
                    audio.play();
                }

                Guess.textContent += (upcase + "\xa0");
                Att.textContent = gameMain.attremain;
                attArea.value = "";
            }
        }

    }
    else{
        gameMain.pageReset();
        gameMain.DefCount++;
        Def.textContent = gameMain.DefCount;
    }
}
// Game end :)