
/////////////////////////////////////////TTT FUNCTIONALITY ///////////////////////////////////////////////////////////////////////////
$(document).ready(function() {
    attachListeners()
})


var turn = 0;
let currentGame = 0;
function player(){
   return (turn % 2 ? "O" : "X")
}


function updateState(elementClicked){
    let play = player();
    $(elementClicked).text(play)
}

function setMessage(string){
    $("div#message").text(string)
}

function doTurn(elementClicked){
    //debugger;
    // elementClicked is being passed as eg <td data-x="0" data-y="2">
    
    updateState(elementClicked);
  
    turn += 1;


    if (checkWinner()){
        saveGame();
        resetBoard();
    } else if (turn === 9){
        setMessage("Tie game.")
        saveGame();
        resetBoard();
    }
}
    
function resetBoard(){
    //debugger;
    $("td").empty()
    turn = 0
    currentGame = 0
    
}

function checkWinner() {
    let board = {}
    let winner = false;
    const winning_combos = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
  
    $('td').text((index, square) => board[index] = square)
  
    winning_combos.some(function(combo) {
      if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
        setMessage(`Player ${board[combo[0]]} Won!`)
        return winner = true
      }
    })

   
    return winner;
}
    //Returns true if the current board contains any winning combinations (three X or O tokens in a row, vertically, horizontally, or diagonally). Otherwise, returns false.
    //If there is a winning combination on the board, checkWinner() should invoke setMessage(), passing in the appropriate string based on who won: 'Player X Won!' or 'Player O Won!' 



function attachListeners(){
    $("td").on("click", function(){
        
       // When a user clicks on a square on the game board, the event listener should invoke doTurn() and pass it the element that was clicked.
       if (!$.text(this) && !checkWinner()) {
        doTurn(this)
       }
       
    })

    $("#save").on('click' , () => saveGame())
    $("#previous").on('click', () => previousGames())
    $("#clear").on("click", ()=> resetBoard())
}





////////////////////////////////////////////BUTTONS//////////////////////////////////////////////////////////////////////////////////


    function saveGame() {
        var state = $("td").toArray().map(x => x.innerText);
        // if the current game exists, request to patch(update) that specific game
        if (currentGame) {
        $.ajax({
            type: 'PATCH',
            url: `/games/${currentGame}`,
            data: { state: state }
        });
        } else {
        // if no currentgame exists, create a brand new request with post req to /games
        $.post('/games', { state: state }).done(function (resp) {
            currentGame = resp.data.id
        })
        }
  }
  

    // to insert an x into the first box (top left) do
    // firstRow = $("[data-y=0]") 
    // firstRow[0].innerText = "X"



    function previousGames(){
               $.get("/games", function(data){
                let games = data.data;
                debugger;
                let buttons = games.map(function(game){
                    
                    return `<button onClick='loadGame(${game.id})' data-id="${game.id}"> ${game.id} </button><br><br>`
                })
                $("#games").empty();
                //data.data[0].attributes.state returns the state of the first game
                if(buttons){
                    $("#games").append(buttons)
                }
                
            }
        )}

    function loadGame(gamePassed){
        //clear any messages that may have generated from previous games
        $("#message").empty();
        var game = $.get(`/games/${gamePassed}`, function(gameRequested){
            // we do the opposite of what we did in save game. 
            // we assign the td values from the gameRequested(response game)'s state.
            let state = gameRequested.data.attributes.state
            $('td').text((index, square) => state[index]);
            currentGame = gamePassed;
            turn = state.join('').length;
            checkWinner();
        })
    }




//     function saveGame(){
//         let posting = $.post("/games",function(data){
//         currentGame = data.data["id"];
//         var board = {}
//         data.data.attributes.state = $('td').text((index, square) => board[index] = square)  
//         //debugger;
//       });
      
//   };