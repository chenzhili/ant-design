import { Component } from "react"
import ReactDOM from 'react-dom';
import { Table, Icon, Select, Button, Input, Dropdown, Menu, Modal, message } from "antd"
import { connect } from 'dva';
import styles from "./DataManage.less"
import {List,Map}from "immutable"

import SearchName from "../../components/DataManage/searchName";
import FilterCondition from "../../components/DataManage/filterCondition"
const Option = Select.Option;
const confirm = Modal.confirm;

class DataManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            x: "100%",
            isShowBatchOper: 0, // 0为隐藏 1为显示 批量操作 2为 批量删除
            allScreen: false,
            operFeild: false,
            openCondition:false,
            selectedRows: [], //选中项数组
        }
        this.getTableContainer = ele => {
            if (!ele) return;
            this.table = ele.clientWidth;
        }
    }
    // 这个发生在 渲染之后，这里用来更新我的 x值
    getSnapshotBeforeUpdate(prevProps, prevState) {
        if (this.table) {
            let { columns } = this.props.dataManage;
            let ActualyWidth = this._getActualyWidth(columns);
            let percent = ActualyWidth / this.table * 100;
            return percent;
        }
        return null;
    }
    // 这个是跟上面那个生命周期一起使用
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(snapshot){
            // console.log("更新时间",snapshot);
            this.state.x = `${snapshot < 100 ? 100 : Math.ceil(snapshot)}%`;
        }
    }
    // 这个用于当 props于 state有关的时候
    static getDerivedStateFromProps(nextProps, prevState) {
        return null;
    }
    componentDidMount() {
        if (!this.table) return;
        let { columns } = this.props.dataManage;
        let ActualyWidth = this._getActualyWidth(columns);
        let percent = ActualyWidth / this.table * 100;
        this.setState({
            x: `${percent < 100 ? 100 : Math.ceil(percent)}%`
        });
    }
    _getActualyWidth(columns) {
        if (!columns.length) return;
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
    // 过滤columns,在页面的显示
    _filterColumns(columns) {
        if (!columns.length) return;
        for (let i = 0; i < columns.length; i++) {
            let item = columns[i];
            if (item.hasOwnProperty("colSpan")) {
                columns.splice(i, 1);
                i--;
                continue;
            }
            if (item.children && item.children.length) {
                this._filterColumns(item.children);
            }
        }
        return columns;
    }
    // 显示批量操作列表
    handleMenuClick(e) {
        switch (e.key) {
            case "0":
                this.showBatchOper(1);
                break;
            default:
                console.log("1");
        }
    }
    // 批量操作
    showBatchOper(e) {
        this.setState({
            isShowBatchOper: e
        });
    }
    // 取消操作
    cancelOper() {
        this.setState({
            isShowBatchOper: 0
        });
    }
    // 全屏
    showAllScreen() {
        this.setState({
            allScreen: !this.state.allScreen
        })
    }
    // 显示筛选
    showFilterCondition(e){
        e.stopPropagation();
        this.setState({
            openCondition:true,
            operFeild: false
        });
    }
    // 显示字段
    showFeildNameOper(e) {
        e.stopPropagation();
        this.setState({
            operFeild: true,
            openCondition:false
        });
    }
    // 清空所有记录
    deleteAll() {
        let me = this;
        let { dispatch } = this.props;
        confirm({
            title: '您确定清空所有数据吗？',
            content: '您当前打算清空所有数据，免费版删除数据无法恢复',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: "dataManage/deleteAll"
                });
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    // 选择操作
    rowSelection() {
        let me = this;
        return me.state.isShowBatchOper ? {
            fixed: true,
            onSelect: function (record, selected, selectedRows, nativeEvent) {
                me.setState({
                    selectedRows
                });
            },
            onSelectAll: function (selected, selectedRows, changeRows) {
                me.setState({
                    selectedRows
                });
            },
        } : undefined
    }
    // 删除选中项
    deleteSelectedItem() {
        let { selectedRows } = this.state;
        let { dispatch } = this.props;
        if (!selectedRows.length) {
            message.warning("请选择需要操作的数据");
            return;
        }
        confirm({
            title: '您确定要删除选中数据吗？',
            content: `您当前删除${selectedRows.length}调数据，免费版删除数据无法恢复`,
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: "dataManage/deleteSelectedItem",
                    payload: {
                        selectedRows
                    }
                });
            }
        });

    }
    // 点中container
    containerClick(e){
        e.stopPropagation();
        this.setState({
            operFeild:false,
            openCondition:false
        });
    }

    // 对于筛选条件 值 和 关系改变的 函数
    changeConditionValue(id,keyValue={}){
        this.props.dispatch({
            type:"dataManage/changeConditionValue",
            payload:{keyValue,id}
        });
    }
    filterFeildChange(type,e){
        this.props.dispatch({
            type:"dataManage/filterConditionChange",
            payload:{
                id:e,
                type
            }
        });
    }
    render() {
        let { tableData, menuOperate } = this.props.dataManage;
        // 注意深层对象引用
        let columns = JSON.parse(JSON.stringify(this.props.dataManage.columns));
        columns = this._filterColumns(columns);
        // console.log("渲染事件",this.state.x);
        let { isShowBatchOper, allScreen, operFeild,openCondition } = this.state;
        let menuItem = menuOperate.map((v, i) => (
            <Menu.Item key={i} style={{ fontSize: "12px" }}>
                <Icon type={v.icon} />{v.name}
            </Menu.Item>
        ));
        let menu = (
            <Menu onClick={this.handleMenuClick.bind(this)}>
                {menuItem}
            </Menu>
        )
        // 传入 筛选 提交的 props
        let conditionProps = {
            ...this.props.dataManage,
            changeConditionValue:this.changeConditionValue.bind(this),
            filterFeildChange:this.filterFeildChange.bind(this),
            dispatch:this.props.dispatch
        }
        return (
            <div className={`${styles.content} ${allScreen && styles.fullScreen}`} onClick={this.containerClick.bind(this)}>
                <div className={styles.cooperate}>
                    {
                        !isShowBatchOper && (
                            <div className={styles.cooperateLeft}>
                                <div className={`${styles.cooperateItem} ${styles.cooperateSpecial}`}>
                                    <Icon type="plus" />
                                    <span className={styles.cooperateText}>新建</span>
                                </div>
                                <div className={styles.cooperateItem}>
                                    <Icon type="download" />
                                    <span className={styles.cooperateText}>导入</span>
                                </div>
                                <div className={styles.cooperateItem}>
                                    <Icon type="upload" />
                                    <span className={styles.cooperateText}>导出</span>
                                </div>
                                <div className={styles.cooperateItem}>
                                    <Dropdown overlay={menu} trigger={['click']}>
                                        <div className="ant-dropdown-link">
                                            <Icon type="plus" />
                                            <span className={styles.cooperateText}>批量操作</span>
                                            <Icon type="down" />
                                        </div>
                                    </Dropdown>
                                </div>
                                <div className={styles.cooperateItem} onClick={this.showBatchOper.bind(this, 2)}>
                                    <Icon type="plus" />
                                    <span className={styles.cooperateText}>删除</span>
                                </div>
                                <div className={styles.cooperateItem}>
                                    <Icon type="plus" />
                                    <span className={styles.cooperateText}>数据回收站</span>
                                </div>
                            </div>
                        )
                    }
                    {
                        isShowBatchOper && (
                            <div className={styles.cooperateLeft}>
                                <div className={styles.cooperateItem} onClick={this.cancelOper.bind(this)}>
                                    <span className={styles.cooperateText}>取消操作</span>
                                </div>
                                {isShowBatchOper == 1 && <div className={styles.cooperateItem}>
                                    <span className={styles.cooperateText}>修改选中</span>
                                </div>}
                                {isShowBatchOper == 1 && <div className={styles.cooperateItem}>
                                    <span className={styles.cooperateText}>修改全部</span>
                                </div>}
                                {isShowBatchOper == 2 && <div className={styles.cooperateItem} onClick={this.deleteSelectedItem.bind(this)}>
                                    <span className={styles.cooperateText}>删除选中</span>
                                </div>}
                                {isShowBatchOper == 2 && <div className={styles.cooperateItem} onClick={this.deleteAll.bind(this)}>
                                    <span className={styles.cooperateText}>清空全部</span>
                                </div>}
                            </div>
                        )
                    }
                    <div className={styles.cooperateRight}>
                        <div style={{ width: "4%" }} className={styles.cooperateItem} title={allScreen ? "取消全屏" : "全屏"} onClick={this.showAllScreen.bind(this)}>
                            <Icon type="scan" style={{ fontSize: "16px" }} />
                        </div>
                        <div className={styles.cooperateItem} style={{ position: "relative" }} onClick={this.showFeildNameOper.bind(this)}>
                            <Icon type="eye" />
                            <span className={styles.cooperateText}>显示字段</span>
                            {operFeild && <SearchName {...this.props}/>}
                        </div>
                        <div className={styles.cooperateItem} style={{ position: "relative" }} onClick={this.showFilterCondition.bind(this)}>
                            <Icon type="filter" />
                            <span className={styles.cooperateText}>筛选条件</span>
                            {openCondition && <FilterCondition {...conditionProps}/>}
                        </div>
                    </div>
                </div>
                <div className={styles.contentTable} ref={this.getTableContainer}>
                    <Table style={{ width: "100%", height: "100%" }} 
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
                        rowSelection={this.rowSelection.call(this)}
                    />
                </div>
                <div className={styles.footer}>
                    <div className={styles.footerItem}>
                        <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder="Select a person"
                            optionFilterProp="children"
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            <Option value="jack">Jack</Option>
                            <Option value="lucy">Lucy</Option>
                            <Option value="tom">Tom</Option>
                        </Select>
                        <div className={styles.footerText}>共24条</div>
                    </div>
                    <div className={`${styles.footerItem} ${styles.footerItemSpecail}`}>
                        <div className={styles.footerPage}>
                            <Button>
                                <Icon type="right" />
                            </Button>
                            <Button>
                                <Icon type="left" />
                            </Button>
                        </div>
                        <div className={styles.footerPageNum}>
                            <Input style={{ width: "30px", height: "30px" }} />
                            <span className={styles.line}>/</span>
                            <span className={styles.num}>2</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(({ dataManage }) => ({ dataManage }))(DataManage);