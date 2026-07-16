const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const COLS = 10;
const ROWS = 20;
const SIZE = 30;

canvas.width = COLS * SIZE;
canvas.height = ROWS * SIZE;

const scoreText = document.getElementById("score");

let score = 0;

const COLORS = [
    null,
    "#00FFFF",
    "#FFFF00",
    "#AA00FF",
    "#00FF00",
    "#FF0000",
    "#0000FF",
    "#FF8800"
];

const SHAPES = [
    [],
    [[1,1,1,1]],
    [[2,2],[2,2]],
    [[0,3,0],[3,3,3]],
    [[0,4,4],[4,4,0]],
    [[5,5,0],[0,5,5]],
    [[6,0,0],[6,6,6]],
    [[0,0,7],[7,7,7]]
];

function createBoard(){
    return Array.from({length:ROWS},()=>Array(COLS).fill(0));
}

let board = createBoard();

function randomPiece(){

    const id = Math.floor(Math.random()*7)+1;

    return{

        x:3,

        y:0,

        shape:SHAPES[id],

        color:id

    };

}

let piece = randomPiece();

function drawCell(x,y,color){

    ctx.fillStyle = color;

    ctx.fillRect(x*SIZE,y*SIZE,SIZE,SIZE);

    ctx.strokeStyle="#111";

    ctx.strokeRect(x*SIZE,y*SIZE,SIZE,SIZE);

}

function drawBoard(){

    ctx.fillStyle="#000";

    ctx.fillRect(0,0,canvas.width,canvas.height);

    for(let y=0;y<ROWS;y++){

        for(let x=0;x<COLS;x++){

            if(board[y][x]){

                drawCell(x,y,COLORS[board[y][x]]);

            }

        }

    }

}

function drawPiece(){

    piece.shape.forEach((row,y)=>{

        row.forEach((value,x)=>{

            if(value){

                drawCell(piece.x+x,piece.y+y,COLORS[piece.color]);

            }

        });

    });

}

function draw(){

    drawBoard();

    drawPiece();

}

function collide(){

    for(let y=0;y<piece.shape.length;y++){

        for(let x=0;x<piece.shape[y].length;x++){

            if(piece.shape[y][x]){

                let newX=piece.x+x;

                let newY=piece.y+y;

                if(

                    newX<0||

                    newX>=COLS||

                    newY>=ROWS||

                    (newY>=0&&board[newY][newX])

                ){

                    return true;

                }

            }

        }

    }

    return false;

}

function merge(){

    piece.shape.forEach((row,y)=>{

        row.forEach((value,x)=>{

            if(value){

                board[piece.y+y][piece.x+x]=piece.color;

            }

        });

    });

}

function rotate(){

    const old=piece.shape;

    piece.shape=piece.shape[0].map((_,i)=>

        piece.shape.map(r=>r[i]).reverse()

    );

    if(collide()){

        piece.shape=old;

    }

}

document.addEventListener("keydown",e=>{

    if(e.key==="ArrowLeft"){

        piece.x--;

        if(collide()) piece.x++;

    }

    if(e.key==="ArrowRight"){

        piece.x++;

        if(collide()) piece.x--;

    }

    if(e.key==="ArrowDown"){

        drop();

    }

    if(e.key==="ArrowUp"){

        rotate();

    }

    draw();

});

let timer=0;
let speed=500;

function update(time=0){

    if(time-timer>speed){

        drop();

        timer=time;

    }

    draw();

    requestAnimationFrame(update);

}

function clearLines(){

    let lines = 0;

    outer:
    for(let y = ROWS - 1; y >= 0; y--){

        for(let x = 0; x < COLS; x++){

            if(board[y][x] === 0){
                continue outer;
            }

        }

        board.splice(y,1);
        board.unshift(Array(COLS).fill(0));

        lines++;
        y++;

    }

    if(lines){

        score += lines * 100;
        scoreText.textContent = score;

    }

}

function gameOver(){

    alert("Game Over!\nScore: " + score);

    board = createBoard();

    score = 0;
    scoreText.textContent = score;

    piece = randomPiece();

}

function drop(){

    piece.y++;

    if(collide()){

        piece.y--;

        merge();

        clearLines();

        piece = randomPiece();

        if(collide()){

            gameOver();

        }

    }

}

const restartBtn = document.getElementById("restart");

restartBtn.addEventListener("click",()=>{

    board = createBoard();

    score = 0;

    scoreText.textContent = score;

    piece = randomPiece();

});

["left","right","down","rotate"].forEach(id=>{

    const btn = document.getElementById(id);

    if(!btn) return;

    btn.addEventListener("click",()=>{

        switch(id){

            case "left":

                piece.x--;

                if(collide()) piece.x++;

                break;

            case "right":

                piece.x++;

                if(collide()) piece.x--;

                break;

            case "down":

                drop();

                break;

            case "rotate":

                rotate();

                break;

        }

        draw();

    });

});

const dropBtn = document.getElementById("drop");

if(dropBtn){

    dropBtn.addEventListener("click",()=>{

        while(!collide()){

            piece.y++;

        }

        piece.y--;

        drop();

    });

}

draw();

update();
