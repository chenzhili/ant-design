import React, { Component } from "react"
// import { DragSource } from 'react-dnd';
// import { DropTarget } from 'react-dnd';
import PropTypes from 'prop-types';

import { DragDropContextProvider, DragSource, DropTarget, DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
// import { Observer } from "rx";

const test = {
    knight: "knight"
}
// console.log(DragDropContextProvider);
class Dnd extends Component {
    constructor() {
        super();
        this.state = {
            x: 0,
            y: 0
        }
    }
    // 点击事件的编辑
    handleSquareClick(toX, toY) {
        this._canMoveKnight(toX, toY) && this.setState({
            x: toX,
            y: toY
        });
    }
    _canMoveKnight(toX, toY) {
        const [x, y] = [this.state.x, this.state.y];
        const dx = toX - x;
        const dy = toY - y;

        return (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
            (Math.abs(dx) === 1 && Math.abs(dy) === 2);
    }
    render() {
        let knightPosition = [...[this.state.x, this.state.y]];
        return (
            // <DragDropContextProvider backend={HTML5Backend}>
            <div style={{ height: "280px" }}>
                <Board
                    knightPosition={knightPosition}
                    handleSquareClick={this.handleSquareClick.bind(this)} />
            </div>
            // </DragDropContextProvider>
        );
    }
}

class Board extends Component {
    static propTypes = {
        knightPosition: PropTypes.arrayOf(
            PropTypes.number.isRequired
        ).isRequired
    };
    constructor(props) {
        super(props);
    }
    renderSquare(i) {
        const x = i % 8;
        const y = Math.floor(i / 8);
        const black = (x + y) % 2 === 1;

        const [knightX, knightY] = this.props.knightPosition;
        const piece = (x === knightX && y === knightY) ?
            <Knight /> :
            null;

        return (
            <div key={i}
                style={{ width: '12.5%', height: '12.5%' }}
                onClick={() => { this.props.handleSquareClick(x, y) }}>
                <Square black={black} x={x} y={y} handleSquareClick={this.props.handleSquareClick}>
                    {piece}
                </Square>
            </div>
        );
    }


    render() {
        const squares = [];
        for (let i = 0; i < 64; i++) {
            squares.push(this.renderSquare(i));
        }

        return (
            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexWrap: 'wrap'
            }}>
                {squares}
            </div>
        );
    }
}

const knightSource = {
    beginDrag(props, monitor, component) {
        /* console.log(props);
        console.log(monitor);
        console.log(component); */
        return {};
    }
}
function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),//这个必须要，因为 为了知道拖动的 DOM节点，但是使用的 React 组件 来进行表示的，必须指明对应的 react 组件的连接对象
        isDragging: monitor.isDragging()
    }
}
@DragSource(test.knight, knightSource, collect)
class Knight extends Component {
    render() {
        const { connectDragSource, isDragging } = this.props;
        return connectDragSource(
            <span style={{
                opacity: isDragging ? 0.5 : 1,
                fontSize: 30,
                fontWeight: 'bold',
                cursor: 'move',
                display: "inlineBlock",
                margin: "auto"
            }}>
                ♘
            </span>
        );
    }
}
const squareTarget = {
    drop(props) {
        const {x,y,handleSquareClick} = props;
        handleSquareClick(x,y);
    }
};

function collectTarget(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(), //这个必须要，因为 为了知道拖动的 DOM节点，但是使用的 React 组件 来进行表示的，必须指明对应的 react 组件的连接对象
        isOver: monitor.isOver()
    };
}
@DropTarget(test.knight, squareTarget, collectTarget)
class Square extends Component {
    static propTypes = {
        black: PropTypes.bool
    };

    render() {
        const { black } = this.props;
        const fill = black ? 'black' : 'white';
        const stroke = black ? 'white' : 'black';
        const { connectDropTarget, isOver } = this.props;
        return (
            connectDropTarget(<div style={{
                backgroundColor: fill,
                color: stroke,
                width: '100%',
                height: '100%',
                display: "flex",
                position:"relative"
            }}>
                {isOver &&
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: '100%',
                        zIndex: 1,
                        opacity: 0.5,
                        backgroundColor: 'yellow',
                    }} />
                }
                {this.props.children}
            </div>)
        );
    }
}

export default Dnd;