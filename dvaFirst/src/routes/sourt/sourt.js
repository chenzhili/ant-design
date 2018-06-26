import React, { Component } from "react";
import { DragSource, DropTarget, DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend';
import { Row, Col,Input,Radio  } from "antd"
import { relativeTimeThreshold } from "moment";


/* 
实现表的拖动编辑的逻辑：
有三种组件：
1、左边的 原始拖动源
2、右边 放源目标的 容器组件
3、右边拖动进来的 即是 拖动源也是 容器组件；
真正的实现拖拽的流程：
通过 target的 isOver事件来判断当前 组件是否需要 放进 容器中，在 source 的 endDrag中判断当前行为是否在 容器中 结束，如果在 容器外结束 通过 didDrop 来 把 在 isOver 中的 组件删除；

在容器中调整顺序 根上面的 实现方式一样，需要找到 拖动源的id 和 拖动对象的 Id 对 数组操作就可以了；

*/

function Guid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

let currentId = -1;
// 添加一个高阶函数
// 这高阶函数应该 即是 拖动源，也是拖动目标，才可以知道对应的 位置 以及让他移动；
function generateCom(com){
    return DropTarget("move",{
        drop(){
            console.log("item","发生没");
        },
        canDrop(){
            // 为 false说明当前的 target 不能 放东西，这个对于 item 是精髓
            //  Unlike drop(), this method will be called even if canDrop() is defined and returns false.
            // 说明 在 这个 为 false的时候，drop不会发生，hover还是为执行
            return false
        },
        hover(props,monitor,component){
            // console.log(monitor.canDrop());
            // console.log(props);
            let {id,findIndex,changeItem} = props;
            let item = monitor.getItem();
            // console.log(item);
            if(id != currentId){
                let toObj = findIndex(id);
                changeItem(item,toObj.index);
                currentId = id;
            }
        }
    },(connect, monitor)=>({
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    }))(DragSource("move",{
        beginDrag(props,monitor,component) {
            // console.log(component);
            let {com,id} = props.v;
            return {
                com,
                id
            };
        },
        endDrag(props,monitor,component){
            // console.log("在他上面也会调用这个吗");
            let didDrop = monitor.didDrop();
            console.log("item",didDrop);
        }
    }, (connect, monitor) => (
        {
            connectDragSource: connect.dragSource(),
            isDragging: monitor.isDragging()
        }
    ))(
        class extends Component{
            render(){
                const {connectDragSource,connectDropTarget} = this.props;
                return connectDropTarget(connectDragSource(
                    <div>
                        {com}
                    </div>
                ));
            }
        }
    ));
}

export default class Sourt extends Component {
    constructor(){
        super();
        this.state = {
            arr:[]
        }
    }
    // 加一个变量提升函数修改 arr
    addItem(id,com){
        let compArr = [...this.state.arr];
        compArr.push({
            id,
            com
        })
        this.setState({
            arr:compArr
        });
    }
    render() {
        let list = [{
            name:"呵呵",
            id:1,
            com:generateCom(<Input placeholder="呵呵" key={1}/>)
        }, {
            name:"哦哦",
            id:2,
            com:generateCom(<Radio key={2}>单选</Radio>)
        },{
            name:"嗯嗯；",
            id:3,
            com:generateCom(<Input placeholder="嗯嗯；" key={3}/>)
        }, {
            name:"多大的",
            id:4,
            com:generateCom(<Input placeholder="多大的" key={4}/>)
        }, {
            name:"打啊",
            id:5,
            com:generateCom(<Input placeholder="打啊" key={5}/>)
        }, ];
        // console.log("这里刷新没",this.state.arr);
        return (
            <div style={{}}>
                <Row type="flex" style={{ width: '100%', height: "100%", border: "1px solid #ddd" }}>
                    <Col span={8} style={{ padding: 10 }}>
                        {list.map((v, i) => ( 
                            <Source key={i} v={v} addItem={this.addItem.bind(this)}/>
                        ))}
                    </Col>
                    <Col span={16}>
                        <Target arr={this.state.arr} />
                    </Col>
                </Row>
            </div>
        );
    }
}

@DragSource("move", {
    beginDrag(props,monitor,component) {
        // console.log(component);
        let {com,id} = props.v;
        return {
            com,
            id
        };
    },
    endDrag(props,monitor,component){
        // console.log("拖动完成执行几次");
        const {addItem} = props;
        const didDrop = monitor.didDrop();
        console.log(didDrop);
        let item = monitor.getItem();
        !didDrop && addItem(item.id,item.com)
        
    }
}, (connect, monitor) => (
    {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
))
class Source extends Component {
    render() {
        const {connectDragSource,isDragging,v} = this.props;
        let opacity = isDragging?1:.2;
        return connectDragSource(
        <div style={{ width: "50%", lineHeight: "30px", textAlign: "center", border: "1px solid #ddd", marginTop: "10px",cursor:"move",isDragging }}>{v.name}</div>);
    }
}

@DropTarget("move", {
    // drop(props) {
    //     console.log("进来没");
    // },
    hover(props,monitor,component){
        // console.log("hover事件一直在执行");
        let isOver = monitor.isOver({shallow:true});
        // console.log(isOver);
        /* let canDrop = monitor.canDrop();
        console.log(canDrop); */
        let item = monitor.getItem();
        // console.log(item);
        
    }
}, (connect, monitor) => {
    // console.log(monitor.getItem());
    // console.log(monitor.isOver());
    // // let arr = [];
    // if(monitor.getItem() && monitor.isOver()){
    //     let {com} = monitor.getItem();
    //     arr.push(com);
    // }
    
    
    return ({
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    })
})
class Target extends Component {
    constructor(props){
        super(props);
    }
    findIndex(id){
        let target = this.props.arr.filter(v=>v.id == id)[0];
        return {
            target,
            index:this.props.arr.indexOf(target)
        }
    }
    changeItem(item,index){
        this.props.arr.splice(index,0,item);
    }
    render() {
        const {connectDropTarget,isOver} = this.props;
        // console.log(this.props.arr);
        return connectDropTarget(
            <div style={{ width: "100%", height: "200px", backgroundColor: "#E6F7FF" }}>
                {this.props.arr.map((v,i)=>{
                    // console.log(v);
                    return (
                        <div key={i}>
                            <v.com id={v.id} findIndex={this.findIndex.bind(this)} changeItem={this.changeItem.bind(this)}/>
                        </div>
                    )
                })}
            </div>
        );
    }
}