import React, { Component } from "react"
import { DragSource, DropTarget, DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend';

/* import test,{fun1} from "./module"
console.log(fun1);
console.log(test); */
import * as test from "./module"

import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {Map} from "immutable"
console.log(test);
// fun1 = {}; //报错

const move = "aa";
class DndAgain extends Component {
    constructor() {
        super();
        this.state = {
            x: 0,
            y: 0,
            editorState: EditorState.createEmpty()
        }
    }
    onEditorStateChange(editorState) {
        console.log(editorState,editorState.getDecorator(),editorState.getCurrentContent());

        const decorator = editorState.getDecorator();


        const key = editorState.getSelection().get("focusKey");
        const content = editorState.getCurrentContent().getIn(["blockMap", key, "text"])

        let tempState = EditorState.createEmpty();
        console.log(content.length);
        if (content.length <= 10) {
            console.log("======");
            tempState = editorState;
        }else{
            tempState = EditorState.createWithContent(this.state.editorState.getCurrentContent(),decorator)
        }
        this.setState({
            editorState:tempState,
        }, () => {
            console.log(this.state.editorState.getCurrentContent().getIn(["blockMap", key, "text"]))
        });
    };
    // L型点击有效
    _judgeIsOk(toX, toY) {
        let dx = this.state.x - toX;
        let dy = this.state.y - toY;
        return (Math.abs(dx) === 1 && Math.abs(dy) === 2) || (Math.abs(dx) === 2 && Math.abs(dy) === 1);
    }
    // 状体提升
    moveKnight(toX, toY) {
        this._judgeIsOk(toX, toY) && this.setState({
            x: toX,
            y: toY
        });
    }
    render() {
        console.log("=====","render")
        return (
            <div style={{ width: 400, height: 280, /* backgroundColor: "#000" */ }}>
                <Editor
                    maxLength={10}
                    editorState={this.state.editorState}
                    // wrapperClassName="demo-wrapper"
                    // editorClassName="demo-editor"
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    onEditorStateChange={this.onEditorStateChange.bind(this)}
                    // onEditorStateChange={(editorState)=>{console.log(editorState);}}
                />
                {/* <Board knightPosition={[this.state.x, this.state.y]} moveKnight={this.moveKnight.bind(this)} /> */}
            </div>
        );
    }
}


class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stateHover: false
        }
    }
    // knightPosition 表示从上级传入的 骑士的坐标
    toggleHover() {
        this.setState({
            stateHover: !this.state.stateHover
        });
    }
    _computed(i) {
        let x = i % 8;
        let y = Math.floor(i / 8);

        let black = (x + y) % 2 === 1;
        return (
            <div
                key={i}
                style={{
                    width: "12.5%", height: "12.5%"
                }}
                onClick={() => { this.props.moveKnight(x, y) }}
                onMouseEnter={this.toggleHover.bind(this)}
                onMouseLeave={this.toggleHover.bind(this)}
            >
                <Square black={black} x={x} y={y} moveKnight={this.props.moveKnight} stateHover={this.state.stateHover}>
                    {
                        x === this.props.knightPosition[0] && y == this.props.knightPosition[1] && <Knight black={black} />
                    }
                </Square>
            </div>
        );
    }
    render() {
        let tempArr = [];
        for (let i = 0; i < 64; i++) {
            tempArr.push(this._computed(i));
        }
        return (
            <div style={{ width: "100%", height: "100%", display: "flex", flexWrap: "wrap" }}>
                {tempArr}
            </div>
        );
    }
}

@DragSource(move, {
    beginDrag(props, monitor, component) {
        // console.log(component);
        return {
            test: "就是这个"
        };
    }
}, (connect, monitor) => (
    {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
))
class Knight extends Component {
    render() {
        let black = !this.props.black ? "#000" : "#fff";
        let { connectDragSource, isDragging } = this.props;
        return connectDragSource(
            <span style={{ color: black, fontSize: 28, margin: "auto", cursor: "move", fontWeight: "bold", opacity: isDragging ? .5 : 1 }}>♘</span>
        );
    }
}
@DropTarget(move, {
    drop(props) {
        let { moveKnight, x, y } = props;
        moveKnight(x, y);
    },
    hover(props, monitor, component) {
        /* let isOver = monitor.isOver({shallow:true});
        console.log(isOver); */
        /* let canDrop = monitor.canDrop();
        console.log(canDrop); */
        /* let item = monitor.getItem();
        console.log(item); */
    },
    canDrop() {
        return false
    }
}, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
}))
class Square extends Component {
    render() {
        let black = this.props.black ? "#000" : "#fff";
        let { connectDropTarget, isOver, stateHover } = this.props;

        return connectDropTarget(
            <div
                style={{ backgroundColor: black, width: "100%", height: "100%", display: "flex", position: "relative" }}
            >
                {isOver && <div style={{ position: "absolute", width: "100%", height: "100%", backgroundColor: "#ff0" }}></div>}
                {this.props.children}
            </div>
        );
    }
}

export default DragDropContext(HTML5Backend)(DndAgain);