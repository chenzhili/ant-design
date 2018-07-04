import React, { Component } from "react"
import { DragSource, DropTarget, DragDropContext } from 'react-dnd'
import { Row, Col, Input, Radio, DatePicker, Button, Rate } from "antd"

const type = "move";

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

    render() {
        const sourceArr = [
            { id: 0, name: "aaaaa", com: <Input /> },
            { id: 1, name: "bbbbb", com: <Radio>bbb</Radio> },
            { id: 2, name: "ccccc", com: <DatePicker /> },
            { id: 3, name: "ddddd", com: <Button>dddd</Button> },
            { id: 4, name: "eeeee", com: <Rate /> },
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

                    >
                        {
                            this.state.formArr.map(v => (
                                <div key={v.id} style={{ marginBottom: "10px" }}>
                                    {v.com}
                                </div>
                            ))
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
        let { formArr, addOuterItem } = props;

        // 判断是否存在
        let isExist = formArr.filter(v => v.id == item.id);
        if (!isExist.length) {
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