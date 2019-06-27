import {Component} from "react"
import {Modal, Select, Icon, Tabs, Button, Dropdown, Drawer, Tooltip} from "antd"
import {connect} from "dva";
import TipContent from '../../components/FormControl/TipContent/TipContent'
import moment from 'moment';
import 'moment/locale/zh-cn';
import styles from "./CreditTableRow.less"

const Option = Select.Option;
const TabPane = Tabs.TabPane;

import FormRender from "../../routes/FormRender/FormRender"
import SearchName from "./SearchName"

// 右边流程组件
function RightProcedure(props) {
    let {showDrawer, changeDrawerState, getContainer} = props;
    return (
        <div className={styles.rightContainer}>
            <Tabs defaultActiveKey="1" onChange={() => {
            }}>
                <TabPane tab="审批意见" key="1" className={styles.rightTabs}>Content of Tab Pane 1</TabPane>
                <TabPane tab="流程日志" key="2" className={styles.rightTabs}>Content of Tab Pane 2</TabPane>
            </Tabs>
            <div className={styles.procedureImg} onClick={() => {
                changeDrawerState(true);
            }}>
                <Icon type="plus"/>
                流转图
            </div>
            <Drawer
                title="流程版本"
                placement="right"
                closable={true}
                destroyOnClose={true}
                width={756}
                // getContainer={getContainer()}
                onClose={() => {
                    changeDrawerState(false);
                }}
                visible={showDrawer}
            >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Drawer>
        </div>
    );
}

class CreditTableRow extends Component {
    constructor() {
        super();
        this.state = {
            isEdit: false,
            operFeild: false,
            showDrawer: false,
        }
    }

    changeEditeState(state) {
        this.setState({
            isEdit: state
        });
    }

    getContainer(id) {
        return () => {
            if (!id || typeof document === 'undefined') return null;
            return document.getElementById(id);
        };
    }

    changeDrawerState(bool) {
        this.setState({
            showDrawer: bool
        });
    }

    render() {
        let {isEdit, showDrawer} = this.state;
        let {columns, fieldNameArr, isShowEditModal, changeShowEditModalState, id, FormTemplateVersionId, type, onCompleted} = this.props;
        //console.log(id, FormTemplateVersionId);
        let searchNameProps = {
            columns,
            fieldNameArr,
            backNewfieldArr: () => {
            }
        }
        let rightProcedureProps = {
            showDrawer,
            changeDrawerState: this.changeDrawerState.bind(this),
            getContainer: this.getContainer.bind(this)
        }
        let formRenderProps = {};
        formRenderProps.onCompleted = onCompleted;
        if (type === "modify") {
            formRenderProps.inst = id;
            formRenderProps.tabId = FormTemplateVersionId;
        }
        if (type === "add") {
            formRenderProps.tabId = FormTemplateVersionId;
        }
        // {
        //     !isEdit ? (
        //         <div className={styles.header}>
        //             <div className={styles.headerEidit}>
        //                 <div className={`${styles.headerItem} ${styles.headerItemActive}`} style={{ position: "relative" }}>
        //                     <Dropdown trigger={["click"]} overlay={<SearchName {...searchNameProps} />} placement="bottomRight">
        //                         <div>
        //                             <Icon type="plus" className={styles.headerIcon} />
        //                             <span className={styles.headerText}>显示字段</span>
        //                         </div>
        //                     </Dropdown>
        //                     {/* {operFeild && <SearchName {...searchNameProps} />} */}
        //                 </div>
        //                 <div className={`${styles.headerItem}`}>
        //                     <Icon type="plus" className={styles.headerIcon} />
        //                     <span className={styles.headerText}>打印</span>
        //                 </div>
        //                 <div className={`${styles.headerItem}`}>
        //                     <Icon type="plus" className={styles.headerIcon} />
        //                     <span className={styles.headerText}>分享</span>
        //                 </div>
        //                 <div className={`${styles.headerItem}`} onClick={() => { this.changeEditeState(true); }}>
        //                     <Icon type="plus" className={styles.headerIcon} />
        //                     <span className={styles.headerText}>编辑</span>
        //                 </div>
        //                 <div className={`${styles.headerItem}`}>
        //                     <Icon type="plus" className={styles.headerIcon} />
        //                     <span className={styles.headerText}>删除</span>
        //                 </div>
        //             </div>
        //             <div className={styles.headerPage}>
        //                 <div>&gt;</div>
        //                 <div>1/100</div>
        //                 <div>&lt;</div>
        //             </div>
        //         </div>
        //     ) : ""
        // }
        return (
            <Modal
                visible={isShowEditModal}
                footer={<div style={{textAlign: 'center'}}>
                    <Button onClick={() => this.child.submit()} type="primary">提交</Button>
                    <Button type="primary">暂存</Button>
                    <Button style={{background: 'rgb(187, 187, 187)', border: 'none', color: "#fff"}} onClick={() => {
                        changeShowEditModalState(false)
                    }}>关闭</Button>
                </div>}
                centered={true}
                closable={false}
                className={"previewModal"}
                destroyOnClose={true}
                onCancel={() => {
                    changeShowEditModalState(false);
                }}
                getContainer={() => document.getElementById('dataPreview')}
                mask={false}
                width={'100%'}
                maskClosable={false}
            >
                <div className={styles.container}>
                    <div className={styles.left}>
                        {/* 这里预留 编辑 页面 */}
                        <div className={`${styles.content} ${isEdit ? styles.editHeight : styles.normalHeight}`}>
                            <TipContent/>
                            <FormRender {...formRenderProps} onRef={(ref) => {
                                this.child = ref
                            }}/>
                        </div>
                        {/* {
                            isEdit ? (<div className={styles.footer}>
                                <Button className={styles.footerBtn} onClick={() => {
                                    this.changeEditeState(false);
                                }}>修改</Button>
                                <Button onClick={() => {
                                    this.changeEditeState(false);
                                }}>取消</Button>
                            </div>) : ""
                        } */}
                    </div>
                    {/* <div className={styles.right}>
                        <RightProcedure {...rightProcedureProps} />
                    </div> */}
                </div>
            </Modal>
        );
    }
}

export default CreditTableRow;
