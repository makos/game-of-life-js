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
        this.isPaused = true;
        this.updateTime = 100;

        for (let i = 0; i < this.numCellsX; i++) {
            let tempX = [];
            for (let j = 0; j < this.numCellsY; j++) {
                tempX.push(new Cell(i * this.cellSize, j * this.cellSize, false));
            }
            this.board.push(tempX);
        }

        this.onClick = this.onClick.bind(this);
        this.onKeyup = this.onKeyup.bind(this);
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

    onKeyup(event) {
        if (event.code === 'Space') {
            this.isPaused = !this.isPaused;
            if (this.isPaused) {
                console.log('Pausing');
                this.updateTime = 100;
            } else {
                console.log('Unpausing');
                this.updateTime = 1000;
            }
        }
    }

    update() {
        this.drawBoard();
        this.tick();
    }

    /*  TODO: Game of Life rules.
     *  The cells are flagged for state change accordingly, and actually switched 
     *  only after iterating over the board array. 
     *  1. Any live cell with fewer than two neighbors dies.
     *  2. Any live cell with two or three live neighbors continues to live.
     *  3. Any live cell with more than three neighbors dies.
     *  4. Any dead cell with exactly three neighbors becomes alive.
     */
    tick() {
        if (this.isPaused) {
            return;
        }

        for (let i = 0; i < this.numCellsX; i++) {
            for (let j = 0; j < this.numCellsY; j++) {
                /* Find 8 neighbors and test against them. */
                /* TODO: Move this out into separate method. */
                let aliveNeighbors = 0;
                /* Use min() and max() functions to check for board
                 * boundaries. Otherwise nasty things happen.
                 */
                for (let neighborX = Math.max(0, i - 1); neighborX < Math.min(i + 2, this.numCellsX); neighborX++) {
                    for (let neighborY = Math.max(0, j - 1); neighborY < Math.min(j + 2, this.numCellsY); neighborY++) {
                        if (neighborX === i && neighborY === j) {
                            continue;
                        }
                        this.isCellAlive(neighborX, neighborY) ? aliveNeighbors++ : null;
                    }
                }
                if (this.isCellAlive(i, j) && (aliveNeighbors <= 1 || aliveNeighbors > 3)) {
                    this.switchCellState(i, j);
                } else if (!this.isCellAlive(i, j) && aliveNeighbors === 3) {
                    this.switchCellState(i, j);
                }
            }
        }
    }
}

function draw() {
    const canvas = document.getElementById('game');
    const body = document.getElementById('main-body');
    const ctx = canvas.getContext('2d');

    const board = new Board(300, 300, 10, ctx);
    canvas.addEventListener('click', board.onClick);
    body.addEventListener('keyup', board.onKeyup);

    board.update();

    play(ctx, board);   
}

function play(ctx, board) {
    ctx.clearRect(0, 0, 300, 300);
    board.update();

    setTimeout(() => play(ctx, board), board.updateTime);
}