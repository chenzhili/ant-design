import {Component} from "react"
import { Modal,Icon,Upload,Button,Select,Input } from "antd"
import styles from "./ImportProcedureThree.less"
import {Guid} from "../../../utils/com"
import moment from "moment"

import TableCom from "../TableCom";

const columns = [{
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 176,
    type: "string",
    id: Guid(),
    sorter: true,
}, {
    title: 'Other',
    children: [{
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        width: 176,
        type: "number",
        id: Guid(),
        sorter: true,
    }, {
        title: 'Address',
        children: [{
            title: 'Street',
            dataIndex: 'street',
            key: 'street',
            width: 176,
            type: "location",
            id: Guid(),
        }, {
            title: 'Block',
            children: [{
                title: 'Building',
                dataIndex: 'building',
                key: 'building',
                width: 176,
                type: "string",
                id: Guid(),
            }, {
                title: 'Door No',
                dataIndex: 'number',
                key: 'number',
                width: 176,
                type: "string",
                id: Guid(),
            }],
        }],
    }],
}, {
    title: 'Company',
    children: [{
        title: 'Company Address',
        dataIndex: 'companyAddress',
        key: 'companyAddress',
        width: 176,
        type: "string",
        id: Guid(),
    }, {
        title: '附件',
        dataIndex: 'companyName',
        key: 'companyName',
        width: 176,
        type: "attach",
        id: Guid(),
    }],
}, {
    title: 'Gender',
    dataIndex: 'gender',
    key: 'gender',
    width: 176,
    type: "select",
    id: Guid(),
}, {
    title: 'Time',
    dataIndex: 'time',
    key: 'Time',
    width: 176,
    type: "date",
    id: Guid(),
}];
let tempData = [];
for (let i = 0; i < 10; i++) {
    tempData.push({
        key: i,
        name: 'John Brown',
        age: i + 1,
        street: 'Lake Park',
        building: 'C',
        number: 2035,
        companyAddress: 'Lake Street 42',
        companyName: 'SoftLake Co',
        gender: 'M',
        time: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
    });
}
function ImportProcedureThree(props){
    return (
        <div style={{height:"420px"}}>
            <div className={styles.selectSheet}>
                表单名臣
                <Input className={styles.customSelect} readOnly={true} value={"出差申请"}/>
            </div>
            <TableCom columns={columns} tableData={tempData} removeHeight={"50px"} isCustom={true}/>
        </div>
    );
}

export default ImportProcedureThree;