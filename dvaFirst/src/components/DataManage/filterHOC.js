import { Component } from "react"
import { CheckBox, Input, Icon, Checkbox, Select, DatePicker, TreeSelect, InputNumber } from "antd"
import { connect } from "dva";
import moment from 'moment';
import 'moment/locale/zh-cn';
import styles from "./filterCom.less"

import filterCom from "./filterCom";
import {optionObj} from "../../utils/com"
const Option = Select.Option;



function generateFilterCom(item, i, other) {
    let TempCom = filterCom[item["type"]]["Com"];
    let tempOptionArr = optionObj[item["type"]];
    let {changeConditionValue} = other;
    return (
        <div key={i} className={styles.filterContainer}>
            <div className={styles.filterHeader}>
                <div className={styles.inlineBlock + " " + styles.filterHeaderDes}>
                    <div className={styles.filterTitle + " " + styles.inlineBlock} title={item["name"]}>{item["name"]}</div>
                    <Select className={styles.filterCompare} onChange={(value)=>{
                        let tempData = {};
                        tempData["condition"] = value;
                        tempData["value"] = "";
                        // 对于 日期 范围 进行特殊处理
                        if(item["type"] == "date" && value == "-1"){
                            tempData["value"] = [moment().format("YYYY-MM-DD HH:mm:ss"),moment().format("YYYY-MM-DD HH:mm:ss")];
                        }
                        changeConditionValue(item["id"],tempData)
                    }} defaultValue={tempOptionArr[0]["value"]} dropdownMatchSelectWidth={false}>
                        {
                            tempOptionArr.map((v,i)=>(
                                <Option key={i} value={v["value"]}>{v["name"]}</Option>
                            ))
                        }
                    </Select>
                </div>
                <Icon type="delete" theme="outlined" className={styles.filterIcon} />
            </div>
            <div className={styles.filterContent}>
                <TempCom {...other} {...item}/>
            </div>
        </div>
    )
}

function GenerateFilterCondition(props) {
    let { filterConditionArr,changeConditionValue } = props;
    // console.log(filterConditionArr);
    return (
        <div>
            {
                filterConditionArr.map((v, i) => (
                    generateFilterCom(v, i,{changeConditionValue})
                ))
            }
        </div>
    );
}

export default GenerateFilterCondition;