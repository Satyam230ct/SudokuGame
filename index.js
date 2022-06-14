// Create variables
var timer;
var timeRemaining;
var lives;
var selectedNum;
var selectedTile;
var disableSelect;
var solution;
var boardP;

window.onload = function (){
    // Run startgame function when button is clicked
    id("start-btn").addEventListener("click",startGame);

    // Show Solution
    id('solve').addEventListener('click',showSolution);

    disableSelect=false;
    // Add event listner to each number in number conatiner
    for(let i=1;i<id('number-container')?.children.length;i++)
    {
        id('number-container').children[i].addEventListener('click',function()
        {
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
                    for(let j=1;j<10;j++){
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


async function  startGame() {

    var url="https://sugoku.herokuapp.com/board?difficulty=";

    // Chose board difficulty

    if(id("diff-1").checked)url+="easy";
    else if(id("diff-2").checked)url+="medium";
    else url+="hard";

    // Time for xhrRequest https://github.com/bertoort/sugoku
    let response = await makeRequest('get',url);
    
    boardP = JSON.parse(response).board;

    console.log(boardP);

    // Set Lives to 3 and enable selecting number and tiles
    lives=3;
    disableSelect=false; // Used in implementing pause in game

    id("lives").textContent="Lives Remaining: 3";

    // Time to Generate board based on difficulty
    generateBoard(boardP);

    solution= JSON.parse(response).board;
    solveSudokuHelper(solution,0,0);

    console.log(solution);

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
    id('solve').classList.remove('hidden');
}
// --------------------Request----------------------------

function makeRequest(method, url) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
}

//--------------------showSolution----------------------

function showSolution(){
    lives=0;    
    let tiles = qsa('.tile');
    
    console.log(boardP);

    // Fill each tile by sulurion now
    for(let i=0;i<tiles.length;i++)
    if(boardP[parseInt(i/9)][i%9]==0)
    {
        tiles[i].textContent = solution[parseInt(i/9)][i%9];
        tiles[i].style.color = "blue";
    }
    endGame();
}

//---------------------Backtracking-----------------------

function isSafe(solution,r,c,num){

    //not repeating in the same row or column 
    for(var i=0;i<9;i++){
        if(solution[i][c]==num || solution[r][i]==num){
            return false;
        }
    }
    //subgrid
    var sx = r - r%3;
    var sy = c - c%3;

    for(var x=sx;x<sx+3;x++){
        for(var y=sy;y<sy+3;y++){
            if(solution[x][y]==num){
                return false;
            }
        }
    }

    return true;
}

function solveSudokuHelper(solution,r,c){
    //base case 
    if(r==9){
        return true;
    }
    //other cases 
    if(c==9){
        return solveSudokuHelper(solution,r+1,0);
    }

    //pre-filled cell, skip it
    if(solution[r][c]!=0){
        return solveSudokuHelper(solution,r,c+1);
    }

    //there is 0 in the current location
    for(var i=1;i<=9;i++){

        if(isSafe(solution,r,c,i)){
            solution[r][c] = i;
            var success = solveSudokuHelper(solution,r,c+1);
            if(success==true){
                return true;
            }
            //backtracking step
            solution[r][c] = 0;
        }
    }
    return false;
}

//----------------------------Board-----------------------------

function generateBoard(boardP){
    // Cleasr our previous board if present
    clearPrevious();
    // Let used to increment tile ids
    let idCount=0;

    for(let i=0;i<81;i++){
        // Create a new Paragraph element 
        let tile = document.createElement('div');
        // IF the tile is not supposed to be blank
        if(boardP[parseInt(i/9)][i%9]!='0')
        {
            // Set tile to correct number
            tile.textContent=boardP[parseInt(i/9)][i%9];
        }
        else
        {
            // We will add click eventListner to tile
            tile.addEventListener('click',function(){
                // If selecting is not disabled
                if(!disableSelect)
                {
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

    //----Adding Border Class---
        if(idCount%3==0)
        tile.classList.add('lsb'); // Left Side Border
        else
        tile.classList.add('ldb'); // Left Dot border
        
        if(idCount<=8)
        tile.classList.add('tsb');  // Top side Border
        
        if(idCount%9==8)
        tile.classList.add('rsb'); // Right side Border

        if((idCount>=18 && idCount<=26) || (idCount>=45 && idCount<=53) || idCount>=72)
        tile.classList.add('bsb');  // Bottom Side Border
        
        if((idCount>=9 && idCount<=26) || (idCount>=36 && idCount<=53) || idCount>=63)
        tile.classList.add('tdb');  // Top down border
    //------------------------------

        // Add classes to all tiles
        tile.classList.add('tile');
        // Add tile to board
        id('board').appendChild(tile);
        idCount++;
    }
}


function updateMove(){
    // If a tile and a number is selected
    if(selectedTile && selectedNum)
    {
        // Set the tile to the correct number
        selectedTile.textContent = selectedNum.textContent;
 
    // If the number matches the corresponding number in the solution key
        if(checkCorrect(selectedTile)){
            
            let index=selectedTile.id;
            boardP[parseInt(index/9)][index%9]=selectedTile.textContent;

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
    // If tile's number is equal to solution's number
    if(solution[parseInt((tile.id)/9)][(tile.id)%9] == tile.textContent)
    return true;
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