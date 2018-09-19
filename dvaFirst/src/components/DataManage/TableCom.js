import { Component } from "react"
import { Table, Select,Input } from "antd"
import styles from "./TableCom.less";
import {is} from "immutable";
import moment from "moment";

const Option = Select.Option;
// 自定制 table的 row 和 col
function CustomCell(props) {
    let { index } = props;
    return (
        <td>
            {
                index === -1 ? (
                    !props["children"][2]?(
                    <Select style={{ width: 160, border: "1px solid #ddd", borderRadius: "4px" }} defaultValue={1} dropdownMatchSelectWidth={true}>
                        <Option value={1}>Age</Option>
                    </Select>):<Input style={{width:160,textAlign:"center",border:"none"}} readOnly={true} value={"表单字段"}/>
                ) : props.children
            }
        </td>
    );
}
function CustomRow(props) {
    return (
        <tr>
            {props.children}
        </tr>
    );
}
// 如果传入的 isCustom 为 true，就是自定制 table
class TableCom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            x: "100%",
        }
        this.getTableContainer = ele => {
            if (!ele) return;
            this.table = ele.clientWidth;
        }
    }
    // 这个发生在 渲染之后，这里用来更新我的 x值
    getSnapshotBeforeUpdate(prevProps, prevState) {
        if (this.table) {
            let { columns } = this.props;
            let ActualyWidth = this._getActualyWidth(columns);
            let percent = ActualyWidth / this.table * 100;
            return percent;
        }
        return null;
    }
    // 这个是跟上面那个生命周期一起使用
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (snapshot) {
            // console.log("更新时间",snapshot);
            this.state.x = `${snapshot < 100 ? 100 : Math.ceil(snapshot)}%`;
        }
    }
    // 这个用于当 props于 state有关的时候
    static getDerivedStateFromProps(nextProps, prevState) {
        return null;
    }
    shouldComponentUpdate(nextProps={}, nextState={}) {
        const thisProps = this.props || {}, thisState = this.state || {};

        if (Object.keys(thisProps).length !== Object.keys(nextProps).length ||
            Object.keys(thisState).length !== Object.keys(nextState).length) {
            return true;
        }

        for (const key in nextProps) {
            if (thisProps[key] !== nextProps[key] || !is(thisProps[key], nextProps[key])) {
                return true;
            }
        }

        for (const key in nextState) {
            if (thisState[key] !== nextState[key] || !is(thisState[key], nextState[key])) {
                return true;
            }
        }
        return false;
    }
    componentDidMount() {
        // console.log("table之后，这里改变了 state，是导致 两次 render 的原因");
        if (!this.table) return;
        let { columns, isCustom } = this.props;
        // 这个判断 写在这里 少一次 render;
        if (isCustom) {
            if ((() => {
                for (let i = 0; i < columns.length; i++) {
                    let v = columns[i];
                    if (v["dataIndex"] === "custom") {
                        return false;
                    }
                }
                return true;
            })()) {
                columns.unshift({
                    title: '',
                    dataIndex: 'custom',
                    key: 'custom',
                    width: 176,
                });
            }
        }
        let ActualyWidth = this._getActualyWidth(columns);
        let percent = ActualyWidth / this.table * 100;
        this.setState({
            x: `${percent < 100 ? 100 : Math.ceil(percent)}%`
        });
    }
    _getActualyWidth(columns) {
        if (!columns || !columns.length) return;
        let total = 0;
        columns.forEach(v => {
            if (v.children) {
                total += this._getActualyWidth(v.children)
            } else {
                if (!v.hasOwnProperty("colSpan")) {
                    total += v.width ? parseFloat(v["width"]) : 0;
                }
            }
        });
        return total;
    }
    // 添加 onCell 方法
    _setOnCellFun(columns) {
        if (!columns.length) return;
        columns.forEach(v => {
            if (v.children) {
                this._setOnCellFun(v["children"]);
            } else {
                v["onCell"] = record => ({
                    record,
                    index: record["key"]
                })
            }
        });
        return columns;
    }
    render() {
        console.log("table", "渲染");
        let { columns, tableData, rowSelection, removeHeight, isCustom } = this.props;
        // 如果是 自定制 table的 操作
        let components = {};
        if (isCustom) {

            tableData = tableData.map((v, i) => {
                v["custom"] = `${i + 1}`;
                return v;
            });
            tableData.unshift({
                key: -1,
                custom: "表单字段",
                name: "",
                age: "",
                street: "",
                building: "",
                number: "",
                companyAddress: "",
                companyName: "",
                gender: "",
                time: ""
            });
            components["body"] = {
                row: CustomRow,
                cell: CustomCell
            }
            columns = this._setOnCellFun(columns);
        }
        return (
            <div className={styles.contentTable} ref={this.getTableContainer} style={{ height: `calc(100% - ${removeHeight})` }}>
                <Table style={{ width: "100%", height: "100%" }}
                    components={components}
                    columns={columns}
                    dataSource={tableData}
                    bordered
                    size="small"
                    pagination={false}
                    scroll={{ x: this.state.x, y: true }}
                    rowClassName={(record, index) => {
                        let str = styles.rowHeight;
                        if (index % 2 === 0) {
                            str += ` ${styles.rowEven}`;
                        }
                        return str;
                    }}
                    onChange={(pagination, filters, sorter) => {
                        // 排序
                        console.log(sorter);
                    }}
                    onRow={(record) => {
                        return {
                            onClick: () => { console.log("点击了行"); },       // 点击行
                            onMouseEnter: () => { },  // 鼠标移入行
                        };
                    }}
                    onHeaderCell={(column) => {
                        // console.log(column);
                    }}
                    // 选择操作
                    rowSelection={rowSelection && rowSelection()}
                />
            </div>
        );
    }
}

export default TableCom;