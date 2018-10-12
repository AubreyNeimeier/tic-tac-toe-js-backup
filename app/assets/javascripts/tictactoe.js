// Code your JavaScript / jQuery solution here
/////////////////////////////////////////TTT FUNCTIONALITY ///////////////////////////////////////////////////////////////////////////
$(document).ready(function() {
    attachListeners();
})


var turn = 0;
let currentGame = 0;
function player(){
   return (turn % 2 ? "O" : "X")
}


function updateState(elementClicked){
        $(elementClicked).text(player());   
};

function setMessage(string){
    $("div#message").text(string);
    debugger
}

function doTurn(elementClicked){
    // elementClicked is being passed as eg <td data-x="0" data-y="2">
    turn += 1;
    
    updateState(elementClicked);
    checkWinner();
}

function checkWinner() {
    let board = {};
    let winner = false;
    const winning_combos = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
  
    $('td').text((index, square) => board[index] = square);
  
    winning_combos.some(function(combo) {
      if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
        setMessage(`Player ${board[combo[0]]} Won!`);
        return winner = true;
      }
    });

    return winner;
}
    //Returns true if the current board contains any winning combinations (three X or O tokens in a row, vertically, horizontally, or diagonally). Otherwise, returns false.
    //If there is a winning combination on the board, checkWinner() should invoke setMessage(), passing in the appropriate string based on who won: 'Player X Won!' or 'Player O Won!' 



function attachListeners(){
    $("td").on("click", function(){
       // When a user clicks on a square on the game board, the event listener should invoke doTurn() and pass it the element that was clicked.
       doTurn(this)
    })

    $("#save").on('click' , () => saveGame());
    $("#previous").on('click', () => previousGames());
    $("#clear").on("click", ()=> resetBoard())
}





////////////////////////////////////////////BUTTONS//////////////////////////////////////////////////////////////////////////////////


    function saveGame(){
            var values = $(this).serialize();

            var posting = $.post("/games",function(data){
                //debugger;
              // upon saving what needs to happen in the dom? 
              // NOTHING... I believe 
              // at this point we have triggered #create and generated a game id. 
              // we assign the Currentgame id so we can reference game later;
              currentGame = data.data["id"];
              board = {};
              data.data.attributes.state = $('td').text((index, square) => board[index] = square);    
              debugger;
            });
            
        };
    // to insert an x into the first box (top left) do
    // firstRow = $("[data-y=0]") 
    // firstRow[0].innerText = "X"



    function previousGames(){
               $.get("/games", function(data){
                // once we have all the games, what needs to happen in the dom?
                // we need to create a button for each under div(#games)
                var games = data
                //to get state of first game we have to dig to the below
                //games["data"][0]["attributes"]["state"] 
            });
        };


    
    // games.forEach(function (game){
    //     console.log('<ul><button id="element.id"> element.id </button><ul>')
    // });
