import { Component } from "react"
import { Modal, Icon, Upload, Button, Select } from "antd"
import styles from "./ImportProcedureTwo.less"
import { Guid } from "../../../utils/com"
import moment from "moment"

import TableCom from "../TableCom";
const Option = Select.Option;

const columns = [{
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: "100px",
    type: "string",
    id: Guid(),
    sorter: true
}, {
    title: 'Other',
    children: [{
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        width: "200px",
        type: "number",
        id: Guid(),
        sorter: true,
        render: (value, row, index) => {
            console.log(value);
            console.log(row);
            console.log(index);
            return {
                children:value["value"],
                props:{
                    colSpan :value["colSpan"],
                    rowSpan :value["rowSpan"],
                }
            }
        }
    }, {
        title: 'Address',
        children: [{
            title: 'Street',
            dataIndex: 'street',
            key: 'street',
            width: "200px",
            type: "location",
            id: Guid(),
        }, {
            title: 'Block',
            children: [{
                title: 'Building',
                dataIndex: 'building',
                key: 'building',
                width: "100px",
                type: "string",
                id: Guid(),
            }, {
                title: 'Door No',
                dataIndex: 'number',
                key: 'number',
                width: "100px",
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
        width: "100px",
        type: "string",
        id: Guid(),
    }, {
        title: '附件',
        dataIndex: 'companyName',
        key: 'companyName',
        width: "100px",
        type: "attach",
        id: Guid(),
    }],
}, {
    title: 'Gender',
    dataIndex: 'gender',
    key: 'gender',
    width: "80px",
    type: "select",
    id: Guid(),
}, {
    title: 'Time',
    dataIndex: 'time',
    key: 'Time',
    width: "480px",
    type: "date",
    id: Guid(),
}];
let tempData = [];
for (let i = 0; i < 10; i++) {
    tempData.push({
        key: i,
        name: 'John Brown',
        age: {value:i + 1,colSpan:2,rowSpan:1},
        street: 'Lake Park',
        building: 'C',
        number: 2035,
        companyAddress: 'Lake Street 42',
        companyName: 'SoftLake Co',
        gender: 'M',
        time: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
    });
}
function ImportProcedureTwo(props) {
    return (
        <div style={{ height: "420px" }}>
            <div className={styles.selectSheet}>
                工作表
                <Select className={styles.customSelect} defaultValue={"aaaa"}>
                    <Option key={1}>aa</Option>
                </Select>
            </div>
            <TableCom columns={columns} tableData={tempData} removeHeight={"50px"} />
        </div>
    );
}

export default ImportProcedureTwo;