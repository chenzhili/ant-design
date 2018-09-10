import { Component } from "react"
import { CheckBox, Input, Icon, Checkbox, Select, DatePicker, TreeSelect, InputNumber } from "antd"
import { connect } from "dva";
import moment from 'moment';
import 'moment/locale/zh-cn';
import styles from "./filterCom.less"
const Option = Select.Option;



/* 细化每一个 筛选 item 项 */
function FilterText(props) {
    let { condition, changeConditionValue,value,id } = props;
    return (
        <div>
            {
                condition != 0 && condition != 1 && <Input value={value} className={styles.filterItem} onChange={(e)=>{changeConditionValue(id,{value:e.target.value})}}/>
            }
        </div>
    );
}

function FilterNum(props) {
    let { condition, changeConditionValue,value,id } = props;
    // console.log(value);
    return (
        <div>
            {
                condition != 0 && condition != 1 && (
                    <div>
                        {condition != -1 && <InputNumber value={value} className={styles.filterItem} onChange={(e)=>{changeConditionValue(id,{value:e})}}/>}
                        {
                            condition == -1 && <div className={styles.filterNumRange}>
                                <InputNumber value={value[0]} className={styles.filterNumRangeItem} placeholder="最小值" onChange={(e)=>{
                                    let tempData = null;
                                    if(value instanceof Array){
                                        tempData = [...value];
                                        tempData[0] = e;
                                    }else{
                                        tempData = [];
                                        tempData[0] = e;
                                    }
                                    changeConditionValue(id,{value:tempData});
                                }}/>
                                <div>~</div>
                                <InputNumber value={value[1]} className={styles.filterNumRangeItem} placeholder="最大值" onChange={(e)=>{
                                    let tempData = null;
                                    if(value instanceof Array){
                                        tempData = [...value];
                                        tempData[1] = e;
                                    }else{
                                        tempData = [];
                                        tempData[1] = e;
                                    }
                                    changeConditionValue(id,{value:tempData});
                                }}/>
                            </div>
                        }
                    </div>
                )
            }
        </div>
    );
}

function FilterDate(props) {
    let { condition, changeConditionValue,value,id,extendedType } = props;
    // console.log(props);
    const treeData = [{
        title: '固定值',
        value: "0",
        key: '0',
    }, {
        title: '今天',
        value: 1,
        key: '1',
    }, {
        title: '昨天',
        value: 2,
        key: '2',
    }, {
        title: '本周',
        value: 3,
        key: '3',
    }, {
        title: '上周',
        value: 4,
        key: '4',
    }, {
        title: '本月',
        value: 5,
        key: '5',
    }, {
        title: '上月',
        value: 6,
        key: '6',
    }];
    return (
        <div>
            {
                condition != 0 && condition != 1 && (
                    <div>
                        {condition != -1 && <div>
                            <TreeSelect showSearch value={extendedType} treeData={treeData} className={styles.filterItem + " " + styles.filterItemSelect} 
                                onChange={(e)=>{changeConditionValue(id,{extendedType:e})}}
                            />
                            {
                                extendedType == 0 && <DatePicker value={value?moment(value):moment()} className={styles.filterItem} showTime format="YYYY-MM-DD HH:mm:ss" 
                                    onChange={(e)=>{changeConditionValue(id,{value:moment(e).format("YYYY-MM-DD HH:mm:ss")})}}
                                />
                            }
                        </div>}
                        {
                            condition == -1 && <div>
                                <DatePicker value={value?moment(value[0]):moment()} placeholder="起始日期" className={styles.filterItem} showTime format="YYYY-MM-DD HH:mm:ss" onChange={(e)=>{
                                    let tempData = null,tempValue = moment(e).format("YYYY-MM-DD HH:mm:ss");
                                    if(value instanceof Array){
                                        tempData = [...value];
                                        tempData[0] = tempValue;
                                    }else{
                                        tempData = [];
                                        tempData[0] = tempValue;
                                    }
                                    changeConditionValue(id,{value:tempData});
                                }}/>
                                <DatePicker value={value?moment(value[1]):moment()} placeholder="结束日期" className={styles.filterItem} showTime format="YYYY-MM-DD HH:mm:ss" onChange={(e)=>{
                                    let tempData = null,tempValue = moment(e).format("YYYY-MM-DD HH:mm:ss");
                                    if(value instanceof Array){
                                        tempData = [...value];
                                        tempData[1] = tempValue;
                                    }else{
                                        tempData = [];
                                        tempData[1] = tempValue;
                                    }
                                    changeConditionValue(id,{value:tempData});
                                }}/>
                            </div>
                        }
                    </div>
                )
            }
        </div>
    );
}
function FilterSelect(props) {
    let { condition, changeConditionValue,value,id } = props;
    // console.log(props);
    const treeData = [{
        title:'全选',
        value:'0',
        key:'0',
    }, {
        title:'未填写',
        value:'-1',
        key:'-1',
    }, {
        title:'wowo',
        value:'1',
        key:'1',
    }];
    return (
        <div>
            {
                (condition == "select0" || condition == "select1") && <Select className={styles.filterItem + " " + styles.filterItemSelect}
                onChange={(e)=>{changeConditionValue(id,{value:e});}}
                >
                    {treeData.map((v,i)=>{
                        if(v["value"] != "0" && v["value"] != -1){
                            return (
                                <Option key={i} value={v["value"]}>{v["title"]}</Option>
                            );
                        }
                    })}
                </Select>
            }
            {
                condition != 0 && condition != 1 && condition != "select0" && condition != "select1" && <TreeSelect value={value} treeCheckable treeData={treeData} className={styles.filterItem + " " + styles.filterItemSelect}
                    onSelect={(e) => {
                        if (e === "0") {
                            let tempArr = [];
                            treeData.forEach(v => {
                                tempArr.push(v["value"]);
                            });
                            changeConditionValue(id,{value:tempArr});
                        }else{
                            let tempArr = value?[...value]:[];
                            tempArr.push(e);
                            if(tempArr.length == (treeData.length-1)){
                                tempArr.push("0");
                            }
                            changeConditionValue(id,{value:tempArr});
                        }
                    }}
                    onDeselect={(e) => {
                        if (e === "0") {
                            changeConditionValue(id,{value:[]});
                        }else{
                            let tempArr = value?[...value]:[];
                            for(let i=0;i<tempArr.length;i++){
                                let item = tempArr[i];
                                if(item === e){
                                    tempArr.splice(i,1);
                                    i--;
                                }
                                if(item === "0"){
                                    tempArr.splice(i,1);
                                    i--;
                                }
                            }
                            changeConditionValue(id,{value:tempArr});
                        }
                    }} />
            }
        </div>
    );
}

function FilterLocation(props) {
    let { condition, changeConditionValue,value,id,provArr,cityArr,countArr } = props;
    // console.log(props);
    return (
        <div>
            {
                condition != 0 && condition != 1 && (
                    <div>
                        <Select showSearch className={styles.filterItem + " " + styles.filterItemSelect} value={value[0]} placeholder="省/自治区/直辖市" onChange={(e)=>{
                            if(value instanceof Array){
                                value[0] = e;
                            }else{
                                value = [];
                                value[0] = e;
                            }
                            changeConditionValue(id,{value})
                        }}>
                            <Option value="">--请选择--</Option>
                            <Option value="四川省">四川省</Option>
                            <Option value="云南省">云南省</Option>
                        </Select>
                        <div className={styles.filterLocation}>
                            <Select showSearch className={styles.filterLocationItem + " " + styles.filterItemSelect} value={value[1]} placeholder="市" onChange={(e)=>{
                                if(value instanceof Array){
                                    value[1] = e;
                                }else{
                                    value = [];
                                    value[1] = e;
                                }
                                changeConditionValue(id,{value})
                            }}>
                                <Option value="成都市">成都市</Option>
                                <Option value="大理市">大理市</Option>
                            </Select>
                            <Select showSearch className={styles.filterLocationItem + " " + styles.filterItemSelect} value={value[2]} placeholder="区/县" onChange={(e)=>{
                                if(value instanceof Array){
                                    value[2] = e;
                                }else{
                                    value = [];
                                    value[2] = e;
                                }
                                changeConditionValue(id,{value})
                            }}>
                                <Option value="锦江区">锦江区</Option>
                                <Option value="古城区">古城区</Option>
                            </Select>
                        </div>
                    </div>
                )
            }
        </div>
    );
}
export default {
    "string": {
        Com: FilterText
    },
    "number": {
        Com: FilterNum
    },
    "date": {
        Com: FilterDate
    },
    "select": {
        Com: FilterSelect
    },
    "location": {
        Com: FilterLocation
    },
    "attach":{
        Com:FilterText
    }
}