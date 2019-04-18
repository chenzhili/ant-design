import styles from "./TableFooter.less"
import { Button, Icon, Input, message, Select, Pagination, Modal, InputNumber, Switch, Radio } from "antd"
import { Component } from "react";
import { Map, List, is, fromJS } from 'immutable';

const Option = Select.Option;

const modalBody = {
    paddingBottom: "61px",
    maxHeight: "500px",
    overflowY: "auto"
}
const Setting = (props) => {
    const { settingModalVisible, operateSettingModal, filedsArr, changeAttrib,resetConfig,confirm } = props;
    const change = (id, valueName, value) => {
        console.log(value);
        switch(valueName){
            case "freezeType":
            value = value.target.value;
            break;
        }
        changeAttrib({ id, valueName, value });
    }
    const confirmBtn = ()=>{
        confirm();
        operateSettingModal(false);
    }
    const cancelBtn = ()=>{
        operateSettingModal(false);
    }
    const resetBtn = ()=>{
        resetConfig();
    }
    return (
        <Modal
            title="表格配置"
            visible={settingModalVisible}
            centered={true}
            destroyOnClose={true}
            onCancel={() => { operateSettingModal(false); }}
            footer={null}
            width={720}
            maskClosable={false}
            className={styles.modal}
            bodyStyle={modalBody}
        >
            <div className={styles.container}>
                {
                    filedsArr && filedsArr.map((v, i) => (
                        <div key={i} className={styles.modalItem}>
                            <div className={styles.itemLeft}>{v.title}</div>
                            <div className={styles.itemRight}>
                                <Switch checkedChildren="显示条件" unCheckedChildren="隐藏条件" checked={v.filterShow} onChange={change.bind(null, v.id, "filterShow")} />
                                <Switch className={styles.opr} checkedChildren="显示" unCheckedChildren="隐藏" checked={v.show} onChange={change.bind(null, v.id, "show")} />
                                <div className={styles.opr}>冻结：
                                    <Radio.Group value={v.freezeType} onChange={change.bind(null, v.id, "freezeType")} size="small">
                                        <Radio.Button value="1">左</Radio.Button>
                                        <Radio.Button value="0">无</Radio.Button>
                                        <Radio.Button value="2">右</Radio.Button>
                                    </Radio.Group>
                                </div>
                                <div className={styles.opr}>宽度：<InputNumber value={v.width} onChange={change.bind(null, v.id, "width")}/></div>
                            </div>
                        </div>
                    ))
                }
                <div className={styles.modalFooter}>
                    <Button className={styles.btn} type="primary" onClick={resetBtn}>重置</Button>
                    <Button className={styles.btn} type="primary" onClick={confirmBtn}>确定</Button>
                    <Button className={styles.btn} onClick={cancelBtn}>取消</Button>
                </div>
            </div>
        </Modal>
    );
}
/* class Setting extends Component {
    constructor(props) {
        super(props);

    }
    render() {
        const { settingModalVisible, operateSettingModal, filedsArr, changeAttrib } = this.props;
        console.log(filedsArr);
        return (
            <Modal
                title="表格配置"
                visible={settingModalVisible}
                centered={true}
                destroyOnClose={true}
                onCancel={() => { operateSettingModal(false); }}
                footer={null}
                width={720}
                maskClosable={false}
                className={styles.modal}
                bodyStyle={modalBody}
            >
                <div className={styles.container}>
                    {
                        filedsArr && filedsArr.map((v, i) => (
                            <div key={i} className={styles.modalItem}>
                                <div className={styles.itemLeft}>{v.title}</div>
                                <div className={styles.itemRight}>
                                    <Switch checkedChildren="显示条件" unCheckedChildren="隐藏条件" checked={v.filterShow} onChange={(e) => { changeAttrib({ id: v.id, valueName: "filterShow", value: e }) }} />
                                    <Switch className={styles.opr} checkedChildren="显示" unCheckedChildren="隐藏" checked={v.show} />
                                    <div className={styles.opr}>冻结：
                                    <Radio.Group value={v.freezeType} onChange={() => { }} size="small">
                                            <Radio.Button value="1">左</Radio.Button>
                                            <Radio.Button value="0">无</Radio.Button>
                                            <Radio.Button value="2">右</Radio.Button>
                                        </Radio.Group>
                                    </div>
                                    <div className={styles.opr}>宽度：<InputNumber value={v.width} /></div>
                                </div>
                            </div>
                        ))
                    }
                    <div className={styles.modalFooter}>
                        <Button className={styles.btn} type="primary">重置</Button>
                        <Button className={styles.btn} type="primary" onClick={() => { operateSettingModal(false); }}>确定</Button>
                        <Button className={styles.btn} onClick={() => { operateSettingModal(false); }}>取消</Button>
                    </div>
                </div>
            </Modal>
        );
    }
} */
// 初始化 field 项
const initColumns = (columns)=>{
    return columns.reduce((prev,next,i)=>{
        const {id,width,title,} = next;
        prev.push({
            id,
            width,
            title,
            freezeType:"0",//0为 不固定,1为 固定在左边，2为 固定在右边
            show:true,//显示字段
            filterShow:false,//是否显示 条件
        });
        return prev;
    },[]);
}

class TableFooter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns:props.columns,
            settingModalVisible: false,
            filedsArr:initColumns(props.columns),
            changeFiledsObj:{},
        }
        this.operateSettingModal = this.operateSettingModal.bind(this);
        this.changeAttrib = this.changeAttrib.bind(this);
        this.resetConfig = this.resetConfig.bind(this);
        this.confirm = this.confirm.bind(this);
    }
    // 操作设置模块
    operateSettingModal(bool) {
        if(!bool){
            this.setState({
                changeFiledsObj:{}
            });
        }
        this.setState({
            settingModalVisible: bool
        });
    }
    // 在 footer 的 组件 中 属性变化的 方法
    changeAttrib({id,valueName,value}){
        let newFieldsName = List(this.state.filedsArr).toJS();
        const {changeFiledsObj} = this.state;
        // 返回给 上一级，方便于 匹配 哪些项发生了变化
        if(changeFiledsObj[id]){
            changeFiledsObj[id] = {...changeFiledsObj[id],[valueName]:value};
        }else{
            changeFiledsObj[id] = {[valueName]:value};
        }
        newFieldsName.forEach(item=>{
            if(item.id === id){
                item[valueName] = value;
            }
        });
        this.setState({filedsArr:newFieldsName,changeFiledsObj});
    }
    // 重置 配置
    resetConfig(){
        const {columns} = this.state;
        this.setState({
            filedsArr:initColumns(columns),
            changeFiledsObj:{}
        })
    }
    // 确定 
    confirm(){
        const {changeFiledsObj} = this.state;
        this.props.confirmRebuild(changeFiledsObj);
    }
    render() {
        let { pageIndex, totalPage, getPageTableData, pageSize, selecChange, totalCount, designPreview } = this.props;
        let { settingModalVisible,filedsArr } = this.state;
        let settingProps = {
            filedsArr,
            settingModalVisible,
            changeAttrib:this.changeAttrib,
            operateSettingModal: this.operateSettingModal,
            resetConfig:this.resetConfig,
            confirm:this.confirm
        }
        return (
            <div className={styles.footer}>
                <Setting {...settingProps} />
                <div className={styles.footerItem}>
                    {
                        designPreview ? null : <Button icon="setting" className={styles.layout} onClick={() => { this.operateSettingModal(true); }} />
                    }
                    <Pagination className={styles.layout} current={pageIndex} total={totalCount} pageSize={pageSize} onChange={(page, pageSize) => { console.log(page); getPageTableData(page); }} />
                    {
                        designPreview ? null : (
                            <Select
                                className={styles.layout}
                                showSearch
                                style={{ width: 200 }}
                                onChange={(value) => { selecChange && selecChange(value); }}
                                value={pageSize}
                            >
                                <Option value={10}>10条/每页</Option>
                                <Option value={20}>20/每页</Option>
                                <Option value={30}>30/每页</Option>
                                <Option value={40}>40/每页</Option>
                            </Select>
                        )
                    }
                    {
                        designPreview ? null : <Button icon="redo" />
                    }
                </div>
                <div className={`${styles.footerItem} ${styles.footerItemSpecail}`}>
                    <div>
                        显示 {pageSize * (pageIndex - 1) + 1}-{totalCount < (pageIndex * pageSize) ? totalCount : pageIndex * pageSize}，共 {totalCount ? totalCount : totalPage * pageSize} 条
                    </div>
                </div>
            </div>
        );
    }
}
export default TableFooter;