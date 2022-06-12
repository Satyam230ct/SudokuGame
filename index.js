// Load boards from the file or manually
const easy = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------", 
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
  ];
const medium = [
"--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
"619472583243985617587316924158247369926531478734698152891754236365829741472163895"
];
const hard = [
"-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
"712583694639714258845269173521436987367928415498175326184697532253841769976352841"
];

// Create variables
var timer;
var timeRemaining;
var lives;
var selectedNum;
var selectedTile;
var disableSelect;


//----------------Helper Functions----------------
const id= (id) => document.getElementById(id);

const qs= (selector) => document.querySelector(selector);

const qsa = (selector) => document.querySelectorAll(selector);
//----------------------------------------------------


window.onload = function (){
    // Run startgame function when button is clicked
    id("start-btn").addEventListener("click",startGame);
    disableSelect=false;
    // Add event listner to each number in number conatiner
    for(let i=0;i<id('number-container')?.children.length;i++)
    {
        id('number-container').children[i].addEventListener('click',function(){
            // If selecting is not disabled
            if(!disableSelect){
                // If number is already selected
                if(this.classList.contains('selected')){
                    // Then remove selection
                    this.classList.remove('selected');
                    selectedNum=null;
                }
                else{
                    // Deselect all other numbers
                    for(let j=0;j<9;j++){
                        console.log(i);
                        id('number-container').children[j].classList.remove('selected');
                    }
                    // Select it and update selectedNum Variable
                    this.classList.add('selected');
                    selectedNum=this;
                    updateMove();
                }
            }

        });
    }
}


function startGame(){
    // Chose board difficulty
    let board;

    if(id("diff-1").checked)board=easy[0];
    else if(id("diff-2").checked)board=medium[0];
    else board=hard[0];

    // Set Lives to 3 and enable selecting number and tiles
    lives=3;
    disableSelect=false; // Used in implementing pause in game

    id("lives").textContent="Lives Remaining: 3";

    // Time to Generate board based on difficulty
    generateBoard(board);

    // Starts the timer
    startTimer();

    // Set Theme based on iputs
    if(id('theme-1').checked){
        qs('body').classList.remove('dark');
    }
    else{
        qs('body').classList.add('dark');    
    }

    // Show number container
    id('number-container').classList.remove('hidden');

}

function startTimer(){
    // Sets Time remaining based on input
    if(id('time-1').checked)timeRemaining=180;
    else if(id('time-2').checked)timeRemaining=300;
    else timeRemaining = 600;

    // Sets timer for first second
    id('timer').textContent = timeConversion(timeRemaining);
    
    // Sets timer to update every second
    timer = setInterval(function (){
        timeRemaining--;
        // If no time remaininf end the game
        if(timeRemaining==0)endGame();
        id('timer').textContent = timeConversion(timeRemaining);
    },1000);
}

//-----------Convers seconds into string MM:SS format
function timeConversion(time){
    let minutes = Math.floor(time/60);
    if(minutes<10)minutes='0'+minutes;
    let sec = time%60;
    if(sec<10)sec='0'+sec;
    return (minutes+':'+sec);
}


//----------------------------Board-----------------------------

function updateMove(){
    // If a tile and a number is selected
    if(selectedTile && selectedNum)
    {
        // Set the tile to the correct number
        selectedTile.textContent = selectedNum.textContent;
        
    // If the number matches the corresponding number in the solution key
        if(checkCorrect(selectedTile)){
            // Deselects the tiles
            selectedTile.classList.remove('selected');
            selectedNum.classList.remove('selected');

            // Clear the selected variable
            selectedNum=null;
            selectedTile=null;

            // Check if board is completed
            if(checkDone())endGame();
        }
        else // If the number does not match the solution key
        {
            // Disable selecting new numbers for one second
            disableSelect=true;
            // Make the tile turn red
            selectedTile.classList.add('incorrect');
            // Run in one second
            setTimeout(function(){
                // Subtract lives by one
                lives--;
                // If no lives left end the game
                if(lives==0){
                    endGame();
                }
                else{
                    // If lives is not equal to zero
                    // Update lives text
                    id('lives').textContent="Lives Remaining: "+ lives;
                    // Renable Selecting numbers and tiles
                    disableSelect = false;
                }
                // Restore tile color and remove selcted from both 
                selectedTile.classList.remove('incorrect');
                selectedTile.classList.remove('selected');
                selectedNum.classList.remove('selected'); 

                // Clear the tiles text and clear selected variables
                selectedTile.textContent = "";
                selectedTile = null;
                selectedNum=null;
            },1000);
        }
    }
}

function endGame(){
    // Disable moves and stop the timer
    disableSelect=true;
    clearTimeout(timer);

    // Display Win or loss message
    if(lives===0 || timeRemaining===0){
        id('lives').textContent="You Lost!";
    }
    else{
        id('lives').textContent="You Won :)";    
    }
}

function checkDone(){
    let tiles=qsa('.tile');

    for(let i=0;i<tiles.length;i++)
    if(tiles[i].textContent==="")return false;

    return true;
}

function checkCorrect(tile){
    // Set solution on difficulty selection
    let solution;
    if(id("diff-1").checked)solution=easy[1];
    else if(id("diff-2").checked)solution=medium[1];
    else solution=hard[1];
    
    // If tile's number is equal to solution's number
    if(solution.charAt(tile.id) === tile.textContent)return true;
    else return false;
}   

function clearPrevious(){
    // Access all of the tiles
    let tiles = qsa('.tile');
    
    // Remove each tile
    for(let i=0;i<tiles.length;i++){
        tiles[i].remove();
    }

    // If There is a times clear it
    if(timer)clearTimeout(timer);

    // Deselect any number
    for(let i=0;i<id('numer-container')?.children.length;i++){
        id('numer-container').children[i].classList.remove('selected');
    }

    // Clear selected variables
    selectedTile = null;
    selectedNum = null;
}

function generateBoard(board){
    // Cleasr our previous board if present
    clearPrevious();
    // Let used to increment tile ids
    let idCount=0;
    for(let i=0;i<81;i++){
        // Create a new Paragraph element 
        let tile = document.createElement('p');
        // IF the tile is not supposed to be blank
        if(board.charAt(i)!='-'){
            // Set tile to correct number
            tile.textContent = board.charAt(i);
        }
        else{
            // We will add click eventListner to tile
            tile.addEventListener('click',function(){
                // If selecting is not disabled
                if(!disableSelect){
                    // If the tile is already selected
                    if(tile.classList.contains('selected')){
                        // Then remove selection
                        tile.classList.remove('selected');
                        selectedTile=null;
                    }
                    else{
                        // Then we deselect all other tiles
                        for(let j=0;j<81;j++){
                            qsa('.tile')[j].classList.remove('selected');
                        }
                        // Add selection and update variable
                        tile.classList.add('selected');
                        selectedTile=tile;
                        updateMove();
                    }
                }
            });
        }
        // Assign tile id
        tile.id = idCount;
        // Increment id for the next tile
        idCount++;

        // Add classes to all tiles
        tile.classList.add('tile');

        if((tile.id>=18 && tile.id<27) || (tile.id>44 && tile.id<54)){
            tile.classList.add('bottomBorder');
        }
        if(tile.id%9==2 || tile.id%9==5){
            tile.classList.add('rightBorder');
        }

        // Add tile to board
        id('board').appendChild(tile);
    }
}