import React, { Component } from "react"
import { DragSource, DropTarget } from 'react-dnd'
import { Row, Col, Input, Radio, DatePicker, Button, Rate } from "antd"
const type = "move";

/**
 用 gird 实现 拖拽布局：
    1、思路：
        I、想可以只指定 column 的 数量， rows 自己填充，那就只能从上到下进行布局
        II、当然可以 把 column 和 row 的 行列数 都定死，可以任意拖动

    2、这两种 风格：
        I、第一种 风格 就是要一次填充 上去，用 grid-columm 和 grid-row 进行布局，这样可能拖动 会和 配置冲突（这里还不清楚）(这里要不 只能指定 元素 占有的 格子数 如：grid-column:span 3;grid-row:span:2;这样 列数占 3，行数占2；用拖动实现具体的位置，有些可能就是要单独 定制 具体的位置，也可以设置，用于覆盖前面的)
 
 */

function generateDndCom(Com) {
    return DragSource(type, {
        beginDrag(props, monitor, component) {
            let { item } = props;
            return {
                item
            };
        },
        endDrag(props, moniter, component) {

        }
    }, (connect, moniter) => ({
        connectDragSource: connect.dragSource(),
    }))(DropTarget(type, {
        hover(props, monitor, component) {
            let { id: hoverId, findOuterItem, sortItems } = props;
            // let { item:{id:dragId,com} } = monitor.getItem();
            let { item } = monitor.getItem();
            let { id: dragId } = item;
            const isOver = monitor.isOver({ shallow: true });
            const isExist = findOuterItem(dragId);
            let { index: currentIndex } = findOuterItem(hoverId);
            if (isOver && dragId != hoverId) {
                if (isExist) {
                    // 删除原有位置，在插入到新的位置
                    let { index: originIndex } = isExist;
                    sortItems(true, originIndex, currentIndex, { com: item.com, id: item.id });
                } else {
                    // 查到 hoverId 的位置 直接插入
                    sortItems(false, currentIndex, item, { com: item.com, id: item.id });
                }
            }
        }
    }, (connect, monitor) => ({
        connectDropTarget: connect.dropTarget(),
    }))(
        class extends Component {
            render() {
                let { connectDropTarget, connectDragSource } = this.props;
                return connectDragSource(connectDropTarget(
                    <div>
                        <Com />
                    </div>
                ));
            }
        }
    ));

}

function generateClass(com) {
    return class extends Component {
        render() {
            return (
                <div>
                    {com}
                </div>
            );
        };
    }
}

class DndAdvance extends Component{
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
    sortItems(isExist, ...arg) {
        let tempArr = [...this.state.formArr];
        if (isExist) {
            let [originIndex, currentIndex, item] = arg;
            tempArr.splice(originIndex, 1);
            tempArr.splice(currentIndex, 0, item);
        } else {
            let [currentIndex, item] = arg;
            tempArr.splice(currentIndex, 0, item);
        }
        this.setState({
            formArr: tempArr
        });
    }

    render() {
        const sourceArr = [
            { id: 0, name: "aaaaa", com: generateClass(<Input style={{ cursor: "move" }} />) },
            { id: 1, name: "bbbbb", com: generateClass(<Radio style={{ cursor: "move" }}>bbb</Radio>) },
            { id: 2, name: "ccccc", com: generateClass(<DatePicker style={{ cursor: "move" }} />) },
            { id: 3, name: "ddddd", com: generateClass(<Button style={{ cursor: "move" }}>dddd</Button>) },
            { id: 4, name: "eeeee", com: generateClass(<Rate style={{ cursor: "move" }} />) },
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
                            this.state.formArr.map((v, i) => {
                                let C = generateDndCom(v.com);
                                return (
                                    <div key={i} style={{ marginBottom: "10px" }}>
                                        <C
                                            id={v.id}
                                            item={v}
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
        console.log("跟target的Drop是一回事吗");
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
    drop(props,monitor,component){
        console.log("事件发生");
    },
    hover(props, monitor, component) {

        let { item } = monitor.getItem();
        let { formArr, addOuterItem, DeleteItem, findOuterItem } = props;
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
            <div style={{ width: "100%",height:"100%", backgroundColor: "#E6F7FF", display:"grid",gridTemplateColumns:"33% 33% 33%",justifyItems:"center",alignItems:"center" }}>
                {this.props.children}
            </div>
        );
    }
}


export default DndAdvance;