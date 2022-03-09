/* eslint-disable no-unused-vars */
'use strict';

class Cell {
    constructor(x, y, alive) {
        this.x = x;
        this.y = y;
        this.alive = alive;
        this.shouldSwitchState = false;
    }

    draw(ctx, cellSize) {
        if (this.alive) {
            ctx.fillStyle = 'black'; 
            ctx.fillRect(this.x, this.y, cellSize, cellSize);
        } else {
            ctx.strokeRect(this.x, this.y, cellSize, cellSize);
        }
    }

    flagForStateSwitch() {
        this.shouldSwitchState = true;
    }

    applySwitchFlag() {
        if (this.shouldSwitchState) {
            this.alive = !this.alive;
        }
        this.shouldSwitchState = false;
    }
}

class Board {
    constructor(maxX, maxY, cellSize, ctx) {
        this.board = [];
        this.maxX = maxX;
        this.maxY = maxY;
        this.cellSize = cellSize;
        this.numCellsX = this.maxX / this.cellSize;
        this.numCellsY = this.maxY / this.cellSize;
        this.ctx = ctx;

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

    switchCellState(x, y) {
        this.getCell(x, y).flagForStateSwitch();
    }

    getCell(x, y) {
        return this.board[x][y];
    }

    drawBoard() {
        for (let i = 0; i < this.numCellsX; i++) {
            for (let j = 0; j < this.numCellsY; j++) {
                this.getCell(i, j).applySwitchFlag();
                this.getCell(i, j).draw(this.ctx, this.cellSize);
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

    /*  TODO: Game of Life rules.
        The cells are flagged for state change accordingly, and actually switched 
        only after iterating over the board array. 
        1. Any live cell with fewer than two neighbors dies.
        2. Any live cell with two or three live neighbors continues to live.
        3. Any live cell with more than three neighbors dies.
        4. Any dead cell with exactly three neighbors becomes alive. */
    // tick() {
    //     const newBoard = 
    // }
}

function draw() {
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');

    const board = new Board(300, 300, 10, ctx);
    canvas.addEventListener('click', board.onClick);

    setInterval(() => {
        ctx.clearRect(0, 0, 300, 300);
        board.drawBoard();
    }, 33);
}