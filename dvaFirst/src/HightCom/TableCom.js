import { Component } from "react"
import { Table, Select, Input, Radio, Icon, Popover, Checkbox } from "antd"
import styles from "./TableCom.less";
import { is, List } from "immutable";
import { Resizable } from 'react-resizable';
import moment from "moment";

const { ColumnGroup, Column } = Table;
const RadioGroup = Radio.Group;

// columns 的 结构 改成 一维数组结构 
/* 
    [
        {
            id,dataIndex,title,key,width,type,sorter:true,parentId,isData
        }
    ]
*/
const Option = Select.Option;
// 处理成 columns
const buildColumns = (columns, id) => {
    // console.log(columns);
    let topColumns = columns ? columns.filter(a => a.parentId === id) : [];

    return topColumns.length ? topColumns.map((a, i) => {
        let { isData, ...other } = a;
        // console.log(other);
        return !isData ? <ColumnGroup key={i} {...other}>
            {buildColumns(columns, a.id)}
        </ColumnGroup> :
            <Column key={i} {...other}></Column>
    }) : []
}

/* 自定义配置 body的 cell */
class ConfigBodyTd extends Component {
    constructor(props) {
        super(props);
    }
    shouldComponentUpdate(nextProps = {}, nextState = {}) {
        return true;
    }
    render() {
        const { children, ...other } = this.props;
        return (
            <td {...other}>
                {children}
            </td>
        );
    }
}
const ConfigTh = (props) => {
    const { freezeType, isFirst, changeSort,sorterCustom,sortOrder, ...other } = props;
    // 新配置 布局方式
    const popoverFixedContent = (
        <div>
            冻结：
        <RadioGroup onChange={(e) => { }} value={freezeType ? freezeType : 0}>
                <Radio value={0}>不冻结</Radio>
                <Radio value={1}>居左</Radio>
                <Radio value={2}>居右</Radio>
            </RadioGroup>
        </div>
    );
    const thClick = (e) => { e.stopPropagation(); changeSort && changeSort(other.id); }
    return (
        <th {...other} className={styles.configContianer}>
            {
                isFirst ? <div className={styles.layout} onClick={(e) => { e.stopPropagation(); }}>
                    <Popover
                        // visible={popoverFixedVisible}
                        content={popoverFixedContent}
                        title="表格列设置"
                        trigger="click"
                    >
                        <Icon type="bars" title="配置布局格式" style={{ color: '#40a9ff' }} />
                    </Popover>
                </div> : null
            }
            {
                sorterCustom?<div className={styles.configSort} onClick={thClick}>
                    <Icon type="caret-up" className={`${sortOrder === "ascend"?styles.sortActive:""}`}/>
                    <Icon type="caret-down" className={`${sortOrder === "descend"?styles.sortActive:""}`}/>
                </div>:null
            }

            {
                other.children
            }
        </th>
    )
}
// 可以对 header的 width 进行 拖动的 
const ResizeHeaderCell = (props) => {
    const { onResize, width, ...restProps } = props;
    if (!width) {
        return <ConfigTh {...restProps} />;
    }
    return (
        <Resizable width={width} height={0} onResize={onResize} onClick={(e)=>{e.stopPropagation();}}>
            <ConfigTh {...restProps} />
        </Resizable>
    );
};
// 获取 实际 长度
const _getActualyWidth = (columns, tableWidth) => {
    console.log(columns);
    if (!columns || !columns.length) return tableWidth;
    let dataColumns = columns.filter(column => column.isData);
    console.log(dataColumns);
    let total = dataColumns.reduce((prev, next) => {
        console.log(next.colSpan ? next.colSpan : 1);
        return prev + next.width * (next.colSpan ? next.colSpan : 1);
    }, 0);
    console.log(total);
    return total;
}
// 获取 表头的 高度
const _getActualyHeight = (columns, id) => {
    let num = 0;
    const _getMaxNumber = (columns, id, k) => {
        num = Math.max(num, k);
        const existColumns = columns.filter(i => i.parentId === id);
        const notColumns = columns.filter(i => i.parentId !== id);
        existColumns.forEach(item => {
            const childrenColumns = notColumns.filter(i => item.id === i.parentId);
            if (childrenColumns.length) {
                _getMaxNumber(notColumns, item.id, k + 1);
            }
        });
    }
    _getMaxNumber(columns, id, 1);
    return 40 * num + (num + 1) * 1;
}

// 处理 固定列 的 操作 ,用 freezeType 来 判定 固定列的方式
const _initFixedColumns = (columns, x) => {
    let leftFixedItem = [], rightFixedItem = [];
    let isTop = columns.filter(item => item.parentId === "");
    let notTop = columns.filter(item => item.parentId !== "");
    for (let i = 0; i < isTop.length; i++) {
        let item = isTop[i];
        switch (item.freezeType) {
            case "1":
                item.fixed = x === "100%" ? null : "left";
                leftFixedItem = leftFixedItem.concat(isTop.splice(i, 1));
                i--;
                break;
            case "2":
                item.fixed = x === "100%" ? null : "right";
                rightFixedItem = rightFixedItem.concat(isTop.splice(i, 1));
                i--;
                break;
        }
    }
    return [...leftFixedItem, ...isTop, ...notTop, ...rightFixedItem];
}
const _addHeaderFun = ({columns,handleWidthResize,changeSort}) => {
    columns.forEach((item) => {
        if (item.isData) {
            item.onHeaderCell = column => ({
                width: column.width,
                isFirst: !item.parentId && item.id !== "del",
                onResize: handleWidthResize(column.id),
                id: column.id,
                changeSort: changeSort,
                sorterCustom:column.sorterCustom,
                sortOrder:column.sortOrder
            });
        } else {
            item.onHeaderCell = column => ({
                isFirst: !item.parentId,
            });
        }
    });
    return columns;
}
const _dealColumns = (columns)=>{
    if(!columns.some(item=>item.show === false))return columns;
    let isFalseItemsObj = columns.reduce((prev,next)=>{
        if(next.show === false){
            prev[next.parentId]=prev[next.parentId]?prev[next.parentId]:[];
            prev[next.parentId].push(next);
        }
        
        return prev;
    },{});
    columns.forEach(column=>{
        if(!column.isData && isFalseItemsObj[column.id] && columns.filter(item=>item.parentId===column.id).length === isFalseItemsObj[column.id].length){
            column.show = false;
        }
    });
    return columns;
}
const _initColumns = (columns) => {
    console.log(columns);
    // 对于 结构 行，看子集
    columns = _dealColumns(columns);
    // resizeableCustom && (columns = _addHeaderFun(columns));
    return columns.filter(item => item.show !== false);
}
/* 自定制 删除操作 */
const _addDeleteColumn = (columns, showDelete) => {
    let exsitDeleteItem = columns.filter(item=>item.key==="del");
    if (!showDelete && !exsitDeleteItem.length) return columns;
    columns.unshift({
        fixed: "left",
        dataIndex: "del",
        id: "del",
        key: "del",
        isData: true,
        title: <Checkbox />,
        parentId: null,
        width: 50,
        render: columns.filter(item => item.isData)[0]["render"],
    });
    return columns;
}
const _addDeleteTableBody = (tableData, showDelete, selectedRows) => {
    if (!showDelete) return tableData;
    tableData.forEach(item => {
        if (item.index === 0) {
            let findItem = selectedRows.filter(v => v.id === item.mainId)[0];
            console.log(findItem);
            item.del = { value: <Checkbox checked={findItem ? findItem.checked : false} />, isMain: true };
        }
    });
    return tableData;
}
// 初始化选这项
const _initSelectedRows = (tableData, showDelete) => {
    if (!showDelete) return [];
    return tableData.reduce((prev, next) => {
        if (next.index === 0) {
            prev.push({ id: next.mainId, checked: false });
        }
        return prev;
    }, []);
}
// 初始化 components 
const _initComponents = (resizeableCustom)=>{
    // 可以 定制 header的宽度
    let components = {};
    if (resizeableCustom) {
        components.header = {
            cell: ResizeHeaderCell
        }
        components.body = {
            cell: ConfigBodyTd
        }
    }
    return components;
}
// 如果传入的 isCustom 为 true，就是自定制 table
class TableCom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            x: "100%",
            y: true,
            bool: true,
            tableWidth: null,
            columns: _addDeleteColumn(_initColumns(props.columns), props.showDelete),// 对于 前端 进行 columns 的 操作 用的
            removeHeight: props.removeHeight,
            hoverId: null,
            showDelete: props.showDelete,
            components:_initComponents(props.resizeableCustom)
        }
        this.state.selectedRows = _initSelectedRows(props.tableData, this.state.showDelete);
        this.state.tableData = _addDeleteTableBody(props.tableData, props.showDelete, this.state.selectedRows);
        this.getTableContainer = ele => {
            if (!ele) return;
            this.table = { width: ele.clientWidth, height: ele.clientHeight };
        }
        this.resize = this.resize.bind(this);
        this.handleWidthResize = this.handleWidthResize.bind(this);
        this.changeSort = this.changeSort.bind(this);
    }
    /* // 这个发生在 渲染之后，这里用来更新我的 x值
    getSnapshotBeforeUpdate(prevProps, prevState) {
        if (this.table) {
            let { columns } = prevState;
            let ActualyWidth = _getActualyWidth(columns);
            let percent = ActualyWidth / this.table.width * 100;
            return percent;
        }
        return null;
    }
    // 这个是跟上面那个生命周期一起使用
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (snapshot) {
            // console.log("更新时间",snapshot);
            this.state.x = `${snapshot < 100 ? 100 : snapshot}%`;
        }
    } */
    // 这个用于当 props于 state有关的时候
    static getDerivedStateFromProps(nextProps, prevState) {
        /* 需要 对于 页面 高度进行 精确 计算 */
        console.log(nextProps, prevState);

        let tempObj = {};
        if (nextProps.fixedConfig && nextProps.removeHeight !== prevState.removeHeight) {
            tempObj.removeHeight = nextProps.removeHeight;
            tempObj.y = prevState.y - (parseFloat(nextProps.removeHeight) - parseFloat(prevState.removeHeight));
        }
        if (nextProps.tableData.length !== prevState.tableData.length || !is(nextProps.tableData, prevState.tableData) || nextProps.showDelete !== prevState.showDelete) {
            tempObj.selectedRows = _initSelectedRows(nextProps.tableData, nextProps.showDelete);
            tempObj.tableData = _addDeleteTableBody(nextProps.tableData, nextProps.showDelete, tempObj.selectedRows);
            tempObj.showDelete = nextProps.showDelete;

        }
        if (nextProps.columns.length !== prevState.columns.length || !is(nextProps.columns, prevState.columns)) {
            let { columns } = nextProps, { tableWidth } = prevState;
            columns = _addDeleteColumn(_initColumns(columns), nextProps.showDelete);
            let ActualyWidth = _getActualyWidth(columns, tableWidth);
            let percent = ActualyWidth / tableWidth * 100;
            return {
                components:_initComponents(nextProps.resizeableCustom),
                columns,
                x: `${percent < 100 ? 100 : percent}%`,
                ...tempObj
            }
        }
        return tempObj;
    }
    shouldComponentUpdate(nextProps = {}, nextState = {}) {
        const thisProps = this.props || {}, thisState = this.state || {};
        // if (nextProps.resizeableCustom) return true;
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
    /* 这里 对于 监听 页面 尺寸变化没必要了，因为 在 组件  加载完成时 宽度 已经发生变化了 */
    resize() {
        const { columns, tableWidth } = this.state;
        let me = this, prev = +new Date(), time = null, delay = 1000, ActualyWidth = _getActualyWidth(columns, tableWidth);
        const callback = () => {
            this.setState({
                bool: !this.state.bool
            }, () => {
                this.getTableContainer = ele => {
                    if (!ele) return;
                    this.table = { width: ele.clientWidth, height: ele.clientHeight };
                }
                let percent = ActualyWidth / this.table.width * 100;
                this.setState({
                    x: `${percent < 100 ? 100 : Math.ceil(percent)}%`
                });
            });
        }
        let now = +new Date();
        if (now - prev <= delay) {
            time && clearTimeout(time);
            time = setTimeout(() => {
                prev = now;
                callback.call(me);
            }, 500);
        } else {
            prev = now;
            callback.call(me);
        }
    }
    // 改变 选中项 的状态
    changeSelectedRows({ type, bool, id }) {
        let { selectedRows } = this.state;
        if (type === "item") {
            if (bool) {
                selectedRows.push({ key: id });
            } else {
                let changeItem = selectedRows.filter(item => item.id === id)[0];
                const index = selectedRows.indexOf(changeItem);
                selectedRows.splice(index, 1);
            }
        }
        if (type === "all") {
            selectedRows.length = 0;
            if (bool) {

            }
        }
        this.setState({
            selectedRows
        });
    }
    // 改变 sort 以 受控 的 方式 进行 操作
    changeSort(id) {
        let { columns } = this.state;
        let existItem = columns.filter(item => item.id === id)[0];
        let sortIndexLength = columns.filter(item => item.sortOrder && item.id !== id);
        existItem.sortIndex = sortIndexLength.length;
        const index = columns.indexOf(existItem);
        switch (existItem.sortOrder) {
            case "ascend":
                existItem.sortOrder = "descend";
                break;
            case "descend":
                existItem.sortOrder = "false";
                break;
            default:
                existItem.sortOrder = "ascend";
        }
        columns.splice(index, 1, existItem);
        console.log(columns);
        // this.props.changeSortsArr(columns);
        this.setState({columns},()=>{
            this.props.changeSortsArr(columns);
        });
    }
    componentDidMount() {
        // console.log("table之后，这里改变了 state，是导致 两次 render 的原因");
        if (!this.table) return;
        const { columns } = this.state;
        const { isCustom } = this.props;
        let ActualyWidth = _getActualyWidth(columns, this.table.width);
        let percent = ActualyWidth / this.table.width * 100;
        console.log(this.table.height);
        let headerActualyHeight = _getActualyHeight(columns, isCustom ? null : "");
        this.setState({
            x: `${percent < 100 ? 100 : percent}%`,
            y: this.table.height - headerActualyHeight,
            tableWidth: this.table.width
        });
        // window.addEventListener('resize', this.resize);
    }
    componentWillUnmount() {
        // window.removeEventListener("resize", this.resize);
    }
    handleWidthResize = id => (e, { size }) => {
        let { columns } = this.state;
        let getColumns = (columns) => {
            columns.forEach(column => {
                if (column.id === id) {
                    column.width = size.width;
                }
            });
            return columns;
        }
        this.setState({
            columns: getColumns(columns)
        });
    };
    generateResultColumns() {
        const { fixedConfig, isCustom, resizeableCustom } = this.props;
        const { x, columns } = this.state;
        return buildColumns(fixedConfig ? _initFixedColumns(columns, x) : columns, null/* isCustom ? null : "" */);
    }
    /* 初始化 onRow 方法 需要的 配置 */
    initOnRowConfig(record) {
        let me = this;
        const { rowClick, resizeableCustom } = me.props;
        const { hoverId } = me.state;
        let tempObj = {};
        tempObj.onClick = rowClick ? () => { rowClick(record.mainId) } : null;
        if (resizeableCustom) {
            tempObj.onMouseEnter = () => {
                if (record.mainId !== hoverId) {
                    me.setState({
                        hoverId: record.mainId
                    });
                }
            };
            tempObj.onMouseMove = () => {
                if (record.mainId !== hoverId) {
                    me.setState({
                        hoverId: record.mainId
                    });
                }
            };
            tempObj.onMouseOut = () => {
                console.log(record.mainId, hoverId);
                if (record.mainId !== hoverId) {
                    me.setState({
                        hoverId: ""
                    });
                }
            }
        }
        return tempObj;
    }
    render() {
        console.log("table", "渲染");
        let { /* tableData, */ rowSelection, /* removeHeight, */ isCustom, showHeader, borderd, loading, rowClick, expandedRowRender, expandChange, resizeableCustom } = this.props;
        let { columns, x, y, removeHeight, hoverId, tableData,components } = this.state;
        // 如果是 自定制 table的 操作
        console.log(x, columns, y, removeHeight, tableData);
        // 可以 定制 header的宽度
        resizeableCustom && (columns = _addHeaderFun({columns,handleWidthResize:this.handleWidthResize,changeSort:this.changeSort}));
        return (
            <div className={styles.contentTable} ref={this.getTableContainer} style={{ height: `calc(100% - ${removeHeight ? removeHeight : 0})` }}>
                <Table style={{ width: "100%", height: "100%" }}
                    components={components}
                    dataSource={tableData}
                    loading={loading}
                    // columns={columns}
                    expandedRowRender={expandedRowRender}
                    bordered={borderd === undefined ? true : borderd}
                    size="small"
                    pagination={false}
                    onExpand={(expanded, record) => { /* console.log(expanded, record); */ expandChange && expandChange(expanded, record); }}
                    showHeader={showHeader === undefined ? true : showHeader}
                    scroll={{ x, y }}
                    rowClassName={(record, index) => {
                        let str = styles.rowHeight;
                        index % 2 === 0 && (str += ` ${styles.rowEven}`);
                        hoverId === record.mainId && (str += ` ${styles.hoverId}`);
                        return `${str} ${styles.rowHover}`;
                    }}
                    onChange={(pagination, filters, sorter, extra) => {
                        // 排序
                        console.log(pagination, filters, sorter, extra);
                    }}
                onRow={this.initOnRowConfig.bind(this)}
                // 选择操作,对于 有 rowSpan 的 这个 操作 还满足不了
                rowSelection={rowSelection && rowSelection()}
                >
                    {
                        // buildColumns(columns, isCustom ? null : "")
                        this.generateResultColumns()
                    }
                </Table>
            </div>
        );
    }
}

export default TableCom;