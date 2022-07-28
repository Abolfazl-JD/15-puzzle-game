const puzzle = document.getElementById('puzzle')

function createSolvedPuzzle() {
    puzzle.innerHTML = ''
    let pieceNumber = 1

    for (let row = 0; row < 4; row++) {
        for (let column = 0; column < 4; column++) {
            const piece = document.createElement('span')
            piece.id = `piece-${row}-${column}`
            piece.style.left = (column*80+1*column+1)+'px'
            piece.style.top = (row * 80 + 1 * row + 1) + 'px'
            
            // check that if it's the last item don't make that piece
            if (pieceNumber <= 15) {
                piece.classList.add('number')
                piece.innerHTML = (pieceNumber++).toString()
            }
            else piece.classList.add('empty')
            puzzle.appendChild(piece)
        }
    }

    for (const puzzlePiece of puzzle.children) {
        puzzlePiece.addEventListener('click', () => {
            // if any of puzzle pieces is clicked, the below function executes
            movePiece(puzzlePiece)
        })
    }
}

createSolvedPuzzle()
scramble()

function movePiece(puzzlePiece) {
    const emptyPiece = getEmptyPiece(puzzlePiece)
    if (emptyPiece) {
        const emptyPieceInfo = { style: emptyPiece.style.cssText, id: emptyPiece.id }
        
        // Exchanges id and style values
        emptyPiece.style.cssText = puzzlePiece.style.cssText
        emptyPiece.id = puzzlePiece.id
        puzzlePiece.style.cssText = emptyPieceInfo.style
        puzzlePiece.id = emptyPieceInfo.id

        checkOrder()
    }
}

function getEmptyPiece(puzzlePiece) {
    const aroundPieces = getAroundPieces(puzzlePiece)

    // see if there is empty piece in aroundPieces
    for (let i = 0; i < aroundPieces.length; i++) {
        const singlePiece = aroundPieces[i];
        if (singlePiece.className === 'empty') {
            return singlePiece
        }
    }

    return null
}

function getAroundPieces(puzzlePiece) {
    const pieceIdParts = puzzlePiece.id.split('-')
    const pieceRow = Number(pieceIdParts[1])
    const pieceColumn = Number(pieceIdParts[2])

    // get the pieces around the clicked piece
    const aroundPieces = []
    if (pieceRow < 3) aroundPieces.push(getSinglePiece(pieceRow + 1, pieceColumn))
    if (pieceRow > 0) aroundPieces.push(getSinglePiece(pieceRow - 1, pieceColumn))
    if (pieceColumn < 3) aroundPieces.push(getSinglePiece(pieceRow, pieceColumn + 1))
    if (pieceColumn > 0) aroundPieces.push(getSinglePiece(pieceRow, pieceColumn - 1))

    return aroundPieces
}

function getSinglePiece(row, col) {
    return document.getElementById(`piece-${row}-${col}`)
}

function checkOrder() {
    if (getSinglePiece(3, 3).className !== 'empty') return
    
    let number = 1
    // check all the numbers
    for (let row = 0; row < 4; row++) {
        for (let column = 0; column < 4; column++) {
            if (+getSinglePiece(row, column).textContent !== number && number <= 15) {
                // order is incorrect
                return
            }
            number++
        }
    }

    // puzzle is solved , offer for scrambling
    if(confirm('Congrats, You did it! \nScramble the puzzle?')){
        scramble();
    }

}

function scramble(){
    
    var previousCell;
    var i = 1;
    var interval = setInterval(function(){
        if(i <= 100){
            var adjacent = getAroundPieces(getEmptyCell());
            if(previousCell){
                for(var j = adjacent.length-1; j >= 0; j--){
                    if(adjacent[j].innerHTML == previousCell.innerHTML){
                        adjacent.splice(j, 1);
                    }
                }
            }
            // Gets random adjacent cell and memorizes it for the next iteration
            previousCell = adjacent[rand(0, adjacent.length-1)];
            movePiece(previousCell);
            i++;
        } else {
            clearInterval(interval);
        }
    }, 5);

}

function rand(from, to){

    return Math.floor(Math.random() * (to - from + 1)) + from;

}

function getEmptyCell(){
	
    return puzzle.querySelector('.empty');
        
}