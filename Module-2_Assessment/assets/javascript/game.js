var Guess = document.getElementById("Guess"); //TODO link to show past wrong guess
var Answer = document.getElementById("Answer"); //TODO link to show users right guesses
var userVict = document.getElementById("victories"); 
var userDef = document.getElementById("defeats"); 
var userAtt = document.getElementById("attempts"); 
var directions = document.getElementById("directions");
var img = document.getElementById("pic");
var message = document.getElementById("message");
var inputField = document.getElementById("textInput");

var gameMain = {
    
    VictCount: 0,
    DefCount: 0,
    attLeft: 10,
    wordList: ['BATMAN', 'SONIC', 'RAIDEN', 'MARIO', 'RYU', 'SNAKE', 'DRAGONBORN', 'KRATOS' , 'PIKACHU', 'GERALT', 'LARA CROFT'], //List of words for game
    imgList: ['Batman.jpg', 'Sonic.jpg', 'Raiden.jpg', 'Mario.jpg', 'Ryu.jpg', 'Snake.jpg', 'Dragonborn.jpg', 'Kratos.png', 'Pikachu.png', 'Geralt.png','Lara.jpg'], //List image reference
    answers: "",
    imageSrc: "",
    displayWord: [],
    wrongGuess: [], 
    rightGuess: [], 

    gameStart: false,

    gameReset: function() {
        //Resets the guess list and number of tries
        this.attLeft = 10;
        this.wrongGuess = [];
        this.rightGuess = [];
        this.displayWord = [];

        //randomly choose new word from list of game words
        var ranNum = Math.floor(Math.random() * this.wordList.length)
        this.answers = this.wordList[ranNum];
        this.imageSrc = this.imgList[ranNum];
        //console.log(this.answers); //DEBUG CODE/ GAME CHEAT REMOVE WHEN DONE
        this.displayWordBlank();

        message.textContent = "INPUT THE LETTERS!";
        Guess.textContent = "GUESSES: ";
        userAtt.textContent = this.attLeft;
        inputField.value = ""; //make sure field is blank upon reset
    },

    pastGuess: function(letter, state) {
        //Populate wrongGuess or rightGuess lists with the user's past guesses
        if (state == 1){
            //correct guess
            this.rightGuess.push(letter);
        }
        else if (state == 2){
            //incorrect guess
            this.wrongGuess.push(letter);
        }
    },

    displayWordBlank: function() {
        //Display answer word as '_ '
        for (i=0; i<this.answers.length; i++){
            if (isAlpha(this.answers.charCodeAt(i))){
                this.displayWord.push('_');
            }
            else{
                //if the element is not AlphaNumeric leave as is
                this.displayWord.push(this.answers[i]);
            }
        }
        Answer.textContent = "";
        for (j=0; j<this.displayWord.length; j++){
            Answer.textContent += (this.displayWord[j] + "\xa0"); 
        }
    },
};

//Functions
function isAlpha(keyCode){
    /*Function checks if input (event.keyCode) is AlphaNumeric, returns true or false
    keyCode 48-57 (0-9), 65-90 (A-Z)
    Note: Keyboard input 65-90 (A-Z == a-Z)*/
    return ((keyCode >= 65 && keyCode <= 90)||(keyCode >= 97 && keyCode <= 122));
}

function isInWord(letter){
    //Takes a 'string' and returns true if it is part of the answer, false otherwise
    return (gameMain.answers.indexOf(letter) != -1);
}

function replaceBlank(letter){
    //replace '_ ' with the correct letter according to answers and display them
    for (i=0; i<gameMain.displayWord.length; i++){
        if (letter == gameMain.answers[i]){
            gameMain.displayWord[i] = letter;
        }
    }
    Answer.textContent = "";
    for (j=0; j<gameMain.displayWord.length; j++){
        Answer.textContent += (gameMain.displayWord[j] + "\xa0"); 
    } 
}

function checkAnswer(){
    //Checks if the user got the whole word
    //returns true if match, false otherwise
    var inputWord = "";
    for (i=0; i<gameMain.displayWord.length; i++){
        inputWord += gameMain.displayWord[i];
    }
    return (inputWord == gameMain.answers);
}

//Main
//Detects a key up event to start or run game
document.onkeyup = function(event){
    if (gameMain.gameStart == false){
        //Game hasn't started, 'press anykey event' flag
        inputField.value = ""; //Redundant code to ensure field is blank
        gameMain.gameStart = true;
        directions.textContent = "Your Hints: Mortal Kombat|Tomb Raider|Street Fighter|Pokemon|Metal Gear Solid|Skyrim|Hedgehog|God of War|Witcher|Luigi|Gotham ";
        gameMain.gameReset();
    }
    else if(checkAnswer()){
        //User Wins
        gameMain.gameReset();
        directions.textContent = "Your Hints: Mortal Kombat|Tomb Raider|Street Fighter|Pokemon|Metal Gear Solid|Skyrim|Hedgehog|God of War|Witcher|Luigi|Gotham ";
    }
    else if (gameMain.attLeft > 0){
        //Round is not over
        var userInput;
        var inputCode;
        if (inputField.value!=""){
            userInput = inputField.value;
            inputCode = userInput.charCodeAt(0);
            inputField.value = ""; //reset input box
        }
        else{
            userInput = event.key;
            inputCode = event.keyCode;
        }
        //var userInput = event.key;
        //Check for valid input
        if(isAlpha(inputCode)){
            var inputUpper = userInput.toUpperCase();
            //Valid Input, Start Comparing, ignore cases of repeted letter guess
            if (isInWord(inputUpper) && (gameMain.rightGuess.indexOf(inputUpper)==-1)){
                gameMain.pastGuess(inputUpper, 1);
                replaceBlank(inputUpper);
                inputField.value = ""; //Redundant code to ensure field is blank

                if(checkAnswer()){
                    //User Win Condition, 
                    //this is here so user can see the final word
                    gameMain.VictCount++;
                    userVict.textContent = gameMain.VictCount;
                    message.textContent = "!!!VICTORY!!!";
                    directions.textContent = "PRESS ANY KEY 2 PLAY AGAIN";
                    img.src = "assets/images/" + gameMain.imageSrc;
                }
            }
            else if ((gameMain.wrongGuess.indexOf(inputUpper)==-1) && (gameMain.rightGuess.indexOf(inputUpper)==-1)){
                gameMain.pastGuess(inputUpper, 2);
                gameMain.attLeft--;

                if(gameMain.triesLeft == 0){
                    directions.textContent = "PRESS ANY KEY 2 PLAY AGAIN";
                    message.textContent = "DEFEAT! SOLUTION: " + gameMain.answers;
                }

                //Link values to HTML
                Guess.textContent += (inputUpper + "\xa0");
                userAtt.textContent = gameMain.attLeft;
                inputField.value = "";
            }
        }
        else{
            alert("WARNING!! LETTERS MUST BE TYPED");
            inputField.value = "";
        }

    }
    else{
        gameMain.gameReset();
        gameMain.DefCount++;
        userDef.textContent = gameMain.DefCount;
    }
}