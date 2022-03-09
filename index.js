/* eslint-disable no-unused-vars */
'use strict';

class Cell {
    constructor(x, y, alive) {
        this.x = x;
        this.y = y;
        this.alive = alive;
    }

    draw(ctx, cellSize) {
        if (this.alive) {
            ctx.fillStyle = 'black'; 
            ctx.fillRect(this.x, this.y, cellSize, cellSize);
        } else {
            ctx.strokeRect(this.x, this.y, cellSize, cellSize);
        }
    }
}

class Board {
    constructor(maxX, maxY, cellSize) {
        this.board = [];
        this.maxX = maxX;
        this.maxY = maxY;
        this.cellSize = cellSize;
        this.numCellsX = this.maxX / this.cellSize;
        this.numCellsY = this.maxY / this.cellSize;

        for (let i = 0; i < this.numCellsX; i++) {
            let tempX = [];
            for (let j = 0; j < this.numCellsY; j++) {
                tempX.push(new Cell(i * this.cellSize, j * this.cellSize, false));
            }
            this.board.push(tempX);
        }

        this.onClick = this.onClick.bind(this);
    }

    isCellAlive(x, y) {
        return this.board[x][y].alive;
    }

    setCellState(x, y, isAlive) {
        this.board[x][y].alive = isAlive;
    }

    switchCellState(x, y) {
        this.board[x][y].alive = !this.board[x][y].alive;
    }

    getCell(x, y) {
        return this.board[x][y];
    }

    drawBoard(ctx) {
        for (let i = 0; i < this.numCellsX; i++) {
            for (let j = 0; j < this.numCellsY; j++) {
                this.board[i][j].draw(ctx, this.cellSize);
            }
        }
    }

    transformClickToCellCoords(clickX, clickY) {
        return {
            x: Math.floor(clickX / this.cellSize), 
            y: Math.floor(clickY / this.cellSize)
        }
    }

    onClick(event) {
        const clickCoords = this.transformClickToCellCoords(event.offsetX, event.offsetY);
        this.switchCellState(clickCoords.x, clickCoords.y);
    }
}

function draw() {
    const canvas = document.getElementById('tutorial');
    const ctx = canvas.getContext('2d');

    const board = new Board(300, 300, 10);
    canvas.addEventListener('click', board.onClick);

    board.setCellState(15, 15, true);

    setInterval(() => {
        ctx.clearRect(0, 0, 300, 300);
        board.drawBoard(ctx);
    }, 33);
}