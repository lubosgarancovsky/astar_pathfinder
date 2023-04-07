import { Controller } from "./src/Controller.js";
import Spot from "./src/spot.js";

const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext("2d")

const start = document.querySelector('.start')
const finish = document.querySelector('.finish')
const barrier = document.querySelector('.barrier')
const eraser = document.querySelector('.eraser')
const begin = document.querySelector('.begin')
const resetBtn = document.querySelector('.reset')
const delayInput = document.querySelector('.delayInput')
const columnInput = document.querySelector('.columnInput')

const canvasWidth = canvas.clientWidth;
const canvasHeight = canvas.clientHeight;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

let cols = columnInput.value;
let spotSize = Math.floor(canvasWidth / cols)
let rows = Math.floor(canvasHeight / spotSize)

console.log(` RowSize: ${rows} colSize: ${cols} spotSize: ${spotSize}`)

let grid = [[]]

let isDrawing = false
let activeTool = 'barrier'


document.addEventListener('mousedown', buttonPressed)
document.addEventListener('mousemove', handleDrawing)
document.addEventListener('mouseup', () => { isDrawing = false })

start.addEventListener('click', () => { activeTool = 'start'; addClassesToButtons(start) })
finish.addEventListener('click', () => { activeTool = 'finish'; addClassesToButtons(finish) })
barrier.addEventListener('click', () => { activeTool = 'barrier'; addClassesToButtons(barrier) })
eraser.addEventListener('click', () => { activeTool = 'eraser'; addClassesToButtons(eraser) })
begin.addEventListener('click', startPathFinder)
resetBtn.addEventListener('click', reset)

const controller = new Controller();

function addClassesToButtons(pressed) {
    let buttons = [start, finish, barrier, eraser, start]

    for (let button of buttons) {
        button.classList.remove('active')
    }

    pressed.classList.add('active')
}

function buttonPressed(e) {
    isDrawing = true
    handleDrawing(e)
}


function handleDrawing(e) {
    if (isDrawing) {
        let posX = e.clientX - canvas.getBoundingClientRect().left;
        let posY = e.clientY - canvas.getBoundingClientRect().top;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                grid[row][col].handleClick(posX, posY, activeTool)
            }
        }
    }
}

function initGrid() {
    // fill grid 
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            grid[row].push(new Spot(row, col, spotSize, ctx, controller))
        }
        grid.push(new Array())
    }


    // draw grid
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            grid[row][col].draw(ctx)
        }
    }
}

const delay = ms => new Promise(res => setTimeout(res, delayInput.value));


function heuristic(node1, node2) {
    let rowDistance = Math.abs(node1.row - node2.row)
    let colDistance = Math.abs(node1.col - node2.col)

    return rowDistance + colDistance
}


initGrid()

async function startPathFinder() {

    if (!controller.hasStart) {
        alert("You have to specify the starting node");
        return;
    }

    if (!controller.hasEnd) {
        alert("You have to specify the ending node");
        return;
    }

    let start = null
    let end = null
    let openSet = []
    let closedSet = []
    let path = []

    // Update neighbours
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            grid[row][col].updateNeighbours(grid, rows, cols)
            if (grid[row][col].type === 'start') {
                start = grid[row][col]
            }

            if (grid[row][col].type === 'finish') {
                end = grid[row][col]
            }
        }
    }

    if(start == null || end == null || start == undefined || end == undefined) {
        return []
    }


    openSet.push(start)

    while (openSet.length > 0) {


        // delays alghoritm for better visualisation
        if (delayInput.value > 0) {
            await delay()
        }

        let lowestIndex = 0

        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[lowestIndex].f) {
                lowestIndex = i
            }
        }

        let current = openSet[lowestIndex]
        

        for(let spot of openSet) {
            spot.setCurrent()
        }

        if (current === end) {
            let temp = current
            path.push(temp)

            while (temp.parent) {
                temp = temp.parent
                path.push(temp)
            }

            let finalPath = path.reverse()
            drawFinalPath(finalPath, start, end)
            return finalPath
        }


        openSet.splice(lowestIndex, 1)

        closedSet.push(current)
        current.setVisited()

        let neighbours = current.neighbours

        for (let i = 0; i < neighbours.length; i++) {
            let neighbour = neighbours[i]

            if (!closedSet.includes(neighbour)) {
                let possibleG = current.g + 1


                if (!openSet.includes(neighbour)) {
                    openSet.push(neighbour)
                } else if (possibleG >= neighbour.g) {
                    continue
                }

                neighbour.g = possibleG
                neighbour.h = heuristic(neighbour, end)
                neighbour.f = neighbour.g + neighbour.h
                neighbour.parent = current
            }
        }
    }

    alert("There isn't any valid path availible");
    return []
}


async function drawFinalPath(path, start, end) {

    for (let i = 0; i < path.length; i++) {
        await delay()
        path[i].setPath()
    }

    start.setHighlighted()
    end.setHighlighted()
    
}

function reset () {
    grid = [[]]
    cols = columnInput.value
    spotSize = Math.floor(canvasWidth / cols)
    rows = Math.floor(canvasHeight / spotSize)
    controller.hasEnd = false;
    controller.hasStart = false;

    initGrid()
}