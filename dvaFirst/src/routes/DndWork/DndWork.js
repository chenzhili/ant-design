import React, { Component } from "react"
import { DragSource, DropTarget } from 'react-dnd'
import { Row, Col, Input, Radio, DatePicker, Button, Rate } from "antd"

const type = "move";

/**
 * 理清整个思路：在哪做啥操作
 * 目标：实现表单的拖拽排序，并且能够 灵活的 相应事件；
 序列号：
    a、拖动源
    b、容器 目标容器
    c、表单项，既为拖动源，也为目标容器

a中需要做的事：
    关键的事件：
        benginDrag:用于 记录 当前 拖动目标的信息，这里返回 的信息 可以在 其他 API 中通过 monitor.getIem()获取；
        endDrag：这个事件待定，因为需要时时 反应 是否在 container 中，可能会在 hover中判断；(第二阶段，试了不行，由于不在 target 里，无法从hover中监听是否 出来)
b中需要做的事：
    关键事件：
        hover：用于 时时 判断 项目是否 进入 container 且 没有 进入 表单项，用 moniter.isOver({shallow:true})精确判断进入的位置
c中需要做的事：既是拖动源也是 目标容器
    关键事件：
        beginDrage:跟上面一样
        hover:这里跟上面差不多，也需要排序

 * 
 */

// 高阶函数用于处理 container--target的排序功能
function generateDndCom(Com){
    return DropTarget(type,{
        hover(props,monitor,component){
            let {id:hoverId,findOuterItem,sortItems} = props;
            // let { item:{id:dragId,com} } = monitor.getItem();
            let {item} = monitor.getItem();
            let {id:dragId} = item;
            const isOver = monitor.isOver({ shallow: true });
            const isExist = findOuterItem(dragId);
            let {index:currentIndex} = findOuterItem(hoverId);
            if(isOver && dragId != hoverId){
                if(isExist){
                    // 删除原有位置，在插入到新的位置
                    let {index:originIndex} = isExist;
                    sortItems(true,originIndex,currentIndex,{com:item.com,id:item.id});
                }else{
                    // 查到 hoverId 的位置 直接插入
                    sortItems(false,currentIndex,item,{com:item.com,id:item.id});
                }
            }
        }
    },(connect,monitor)=>({
        connectDropTarget: connect.dropTarget(),
    }))(
        class extends Component{
            render(){
                let {connectDropTarget} = this.props;
                return connectDropTarget(
                    <div>
                        <Com/>
                    </div>
                );
            }
        }
    );
    
}

function generateClass(com){
    return class extends Component{
        render(){
            return(
                <div>
                    {com}
                </div>
            );
        };
    }
}

export default class DndWork extends Component {
    constructor() {
        super();
        this.state = {
            formArr: [
                // {id:0,com:<Input/>}
            ] //形如 {id,com}这种数据结构的数据
        }
    }

    // 最外层的 container 添加项
    addOuterItem(item) {
        let tempArr = [...this.state.formArr];
        tempArr.push(item);
        this.setState({
            formArr: tempArr
        });
    }
    // 默认 同一个 id 只会被拖拽一次（不然会删除以前添加的）
    findOuterItem(id) {
        let tempArr = [...this.state.formArr];
        let existArr = tempArr.filter(v => v.id == id);
        if (existArr.length) {
            return {
                index: tempArr.indexOf(existArr[0])
            }
        } else {
            return false;
        }
    }
    DeleteItem(index) {
        let tempArr = [...this.state.formArr];
        tempArr.splice(index, 1);
        this.setState({
            formArr: tempArr
        });
    }
    // 对于 放入 target 的 项目的 判断
    sortItems(isExist,...arg){
        let tempArr = [...this.state.formArr];
        if(isExist){
            let [originIndex,currentIndex,item] = arg;
            tempArr.splice(originIndex,1);
            tempArr.splice(currentIndex,0,item);
        }else{
            let [currentIndex,item] = arg;
            tempArr.splice(currentIndex,0,item);
        }
        this.setState({
            formArr:tempArr
        });
    }

    render() {
        const sourceArr = [
            { id: 0, name: "aaaaa", com: generateClass(<Input style={{cursor: "move" }}/>) },
            { id: 1, name: "bbbbb", com: generateClass(<Radio style={{cursor: "move" }}>bbb</Radio>) },
            { id: 2, name: "ccccc", com: generateClass(<DatePicker style={{cursor: "move" }} />) },
            { id: 3, name: "ddddd", com: generateClass(<Button style={{cursor: "move" }}>dddd</Button>) },
            { id: 4, name: "eeeee", com: generateClass(<Rate style={{cursor: "move" }} />) },
        ]
        return (
            <Row type="flex" style={{ width: '100%', height: "100%", border: "1px solid #ddd" }}>
                <Col span={8} style={{ padding: 10 }}>
                    {
                        sourceArr.map((v, i) => (
                            <FormSource
                                key={v.id}
                                item={v}
                                findOuterItem={this.findOuterItem.bind(this)}
                                DeleteItem={this.DeleteItem.bind(this)}
                            />
                        ))
                    }

                </Col>
                <Col span={16}>
                    <FormTarget
                        formArr={this.state.formArr}
                        addOuterItem={this.addOuterItem.bind(this)}
                        DeleteItem={this.DeleteItem.bind(this)}
                        findOuterItem={this.findOuterItem.bind(this)}
                    >
                        {
                            this.state.formArr.map((v,i) =>{
                                let C = generateDndCom(v.com);
                                return (
                                        <div key={i} style={{ marginBottom: "10px" }}>
                                            <C 
                                            id={v.id}
                                            findOuterItem={this.findOuterItem.bind(this)}
                                            sortItems={this.sortItems.bind(this)}
                                            />
                                        </div>
                                )
                            })
                        }
                    </FormTarget>
                </Col>
            </Row>
        )
    }
}

@DragSource(type, {
    beginDrag(props, monitor, component) {
        let { item } = props;
        return {
            item
        };
     },
    endDrag(props, monitor, component) {
        let { findOuterItem, DeleteItem } = props;
        let didDrop = monitor.didDrop();
        let { item: { id } } = monitor.getItem();
        let isExist = findOuterItem(id);
        if (isExist && !didDrop) {
            DeleteItem(isExist.index);
        }
    }
}, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
}))
class FormSource extends Component {
    render() {
        let { connectDragSource } = this.props;
        return connectDragSource(
            <div style={{ width: "90%", border: "1px solid #ddd", textAlign: "center", marginTop: "10px", cursor: "move" }}>
                {this.props.item.name}
            </div>
        );
    }
}

@DropTarget(type, {
    hover(props, monitor, component) {
        
        let { item } = monitor.getItem();
        let { formArr, addOuterItem,DeleteItem,findOuterItem } = props;
        /***
         * 这里加了 shallow:true 就是相当于 阻止冒泡一样，只会触发 当前 hover 事件，不会 冒泡到 下面；
         */
        const isOver = monitor.isOver({ shallow: true });
        // 判断是否存在
        let isExist = formArr.filter(v => v.id == item.id);
        if (!isExist.length && isOver) {
            addOuterItem({
                id: item.id,
                com: item.com
            });
        }
    }
}, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
}))
class FormTarget extends Component {
    render() {
        let { connectDropTarget } = this.props;
        return connectDropTarget(
            <div style={{ width: "100%", height: "200px", backgroundColor: "#E6F7FF", overflow: "scroll" }}>
                {this.props.children}
            </div>
        );
    }
}


// 测试没问题的
/* function test(Com){
    return DropTarget(type, {
        hover(props, monitor, component) {
            console.log("儿子报错没");
        }
    }, (connect, monitor) => ({
        connectDropTarget: connect.dropTarget(),
    }))(
        class extends Component{
            render(){
                const {connectDropTarget} = this.props;
                return connectDropTarget(
                    <div>
                        <Com/>
                    </div>
                );
            }
        }
    );
}

export default class DndWork extends Component {
    constructor() {
        super();
        
    }

    render() {
        
        let testArr = [ChildTarget]
        return (
            <Row type="flex" style={{ width: '100%', height: "100%", border: "1px solid #ddd" }}>
                <Col span={8} style={{ padding: 10 }}>
                    <Source/>

                </Col>
                <Col span={16}>
                    <ContainerTarget>
                        {
                            testArr.map(v=>{
                                let C = test(v);
                                return <C/>
                            })
                        }
                    </ContainerTarget>
                </Col>
            </Row>
        );
    }
}

@DragSource(type, {
    beginDrag(props, monitor, component) {
        let { item } = props;
        return {
            item
        };
    },
    endDrag(props, monitor, component) {
        
    }
}, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
}))
class Source extends Component{
    render(){
        let {connectDragSource} = this.props;
        return connectDragSource(
            <div style={{width:"100px",lineHeight:"40px",border:"1px solid #ddd",padding:"10px",cursor:"move"}}>aaaaaaaaaa</div>
        )
    }
}


@DropTarget(type, {
    hover(props, monitor, component) {
        console.log("老子就操了");
    }
}, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
}))
class ContainerTarget extends Component {
    render() {
        let { connectDropTarget } = this.props;
        return connectDropTarget(
            <div style={{ width: "100%", height: "200px", backgroundColor: "#E6F7FF", overflow: "scroll" }}>
                {this.props.children}
            </div>
        );
    }
}
class ChildTarget extends Component{
    render(){
        return (
            <div style={{width:"100px",height:"100px",background:"#ff0"}}></div>
        );
    }
} */