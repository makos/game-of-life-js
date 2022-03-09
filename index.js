class Cell {
    constructor(x, y, alive) {
        this.x = x;
        this.y = y;
        this.alive = alive;
    }

    draw(ctx) {
        if (this.alive) {
            ctx.fillStyle = "black"; 
            ctx.fillRect(this.x, this.y, CELLSIZE, CELLSIZE);
        } else {
            ctx.strokeRect(this.x, this.y, CELLSIZE, CELLSIZE);
        }
    }
}

class Board {
    constructor(maxX, maxY, cellSize) {
        this.board = [];
        this.maxX = maxX;
        this.maxY = maxY;
        this.cellSize = cellSize;
        this.numCellsX = this.maxX / this.cellsize;
        this.numCellsY = this.maxY / this.cellsize;

        for (let i = 0; i < this.numCellsX; i++) {
            let tempX = [];
            for (let j = 0; j < this.numCellsY; j++) {
                tempX.push(new Cell(i * this.cellSize, j * this.cellSize, false));
            }
            this.board.push(tempX);
        }
    }

    isCellAlive(x, y) {
        return this.board[x][y].alive;
    }

    setCellState(x, y, isAlive) {
        this.board[x][y].alive = isAlive;
    }

    getCell(x, y) {
        return this.board[x][y];
    }

    drawBoard(ctx) {
        for (let i = 0; i < this.numCellsX; i++) {
            for (let j = 0; j < this.numCellsY; j++) {
                this.board[i][j].draw(ctx);
            }
        }
    }
}

function draw() {
    const canvas = document.getElementById("tutorial");
    const ctx = canvas.getContext('2d');

    const board = new Board(300, 300, 10);

    board.setCellState(15, 15, true);
    board.drawBoard(ctx);
}