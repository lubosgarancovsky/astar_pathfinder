export default class Spot {
    constructor(row, col, size, ctx, controller) {
        this.row = row;
        this.col = col;
        this.x = col * size;
        this.y = row * size;
        this.size = size;
        this.color = '#FFFFFF';
        this.type = 'empty';
        this.ctx = ctx
        this.f = 0
        this.g = 0
        this.h = 0

        this.controller = controller;
        this.neighbours = []
        this.parent = undefined
    }

    updateNeighbours(grid, rows, cols) {
        let row = this.row
        let col = this.col
    
        if (col < cols - 1) {
            if (grid[row][col + 1].type != 'barrier') {
                this.neighbours.push(grid[row][col + 1])
            }
        }

        
        if (col > 0) {
            if (grid[row][col - 1].type != 'barrier'){
                this.neighbours.push(grid[row][col - 1])
            } 
        }

        if (row < rows - 1) {
            if (grid[row + 1][col].type != 'barrier'){
                this.neighbours.push(grid[row + 1][col])
            }
        }

        if (row > 0) {
            if (grid[row - 1][col].type != 'barrier'){
                this.neighbours.push(grid[row - 1][col])
            }
        }


        // Diagonals (OPTIONAL)
        /*
        if (col < cols - 1 && row < rows - 1) {
            if (grid[row + 1][col + 1].type != 'barrier') {
                this.neighbours.push(grid[row + 1][col + 1])
            }
        }

        if (col < cols - 1 && row > 0) {
            if (grid[row - 1][col + 1].type != 'barrier') {
                this.neighbours.push(grid[row - 1][col + 1])
            }
        }

        if (col > 0 && row > 0) {
            if (grid[row - 1][col - 1].type != 'barrier') {
                this.neighbours.push(grid[row - 1][col - 1])
            }
        }

        if (col > 0 && row < rows - 1) {
            if (grid[row + 1][col - 1].type != 'barrier') {
                this.neighbours.push(grid[row + 1][col - 1])
            }
        }
        */
    }

    handleClick(posX, posY, activeTool) {

        // check for click colision
        if ((posX >= this.x) && (posY >= this.y)){
            if ((posX <= this.x + this.size) && (posY <= this.y + this.size)) {

                if (activeTool === 'start' && (this.type === 'barrier' || this.type === 'empty')) {
                    if (!this.controller.hasStart) {
                        this.type = 'start'
                        this.color = '#322bfc'
                        this.controller.hasStart = true;
                    }
                }

                if (activeTool === 'finish' && (this.type === 'barrier' || this.type === 'empty')) {
                    if (!this.controller.hasEnd) {
                        this.type = 'finish'
                        this.color = '#ff3838'
                        this.controller.hasEnd = true;
                    }
                }

                if (activeTool === 'barrier' && this.type === 'empty') {
                    this.type = 'barrier'
                    this.color = '#242424'
                }


                if (activeTool === 'eraser') {
                    if (this.type === 'finish') {
                        this.controller.hasEnd = false;
                    }

                    if (this.type === 'start') {
                        this.controller.hasStart = false;
                    }

                    this.type = 'empty'
                    this.color = '#FFFFFF'
                }
                
                this.draw()
            }
        }
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.strokeStyle = '#dedede';
        this.ctx.fillRect(this.x, this.y, this.size, this.size);
        this.ctx.strokeRect(this.x, this.y, this.size, this.size);
    }

    setVisited() {
        this.color = '#baffc4';
        this.draw()
    }

    setCurrent() {
        this.color = '#2eff4c';
        this.draw()
    }

    setPath() {
        this.color = '#ff1717'
        this.draw()
    }
    
    setHighlighted() {
        this.color = '#32f3fa'
        this.draw()
    }

    reset() {
        this.color = '#FFFFFF';
        this.type = 'empty'
        this.draw()
    }
}