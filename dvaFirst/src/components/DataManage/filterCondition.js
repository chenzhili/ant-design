import { Component } from "react"
import { CheckBox, Input, Icon, Checkbox, Select,DatePicker,TreeSelect } from "antd"
import { connect } from "dva";
import moment from 'moment';
import 'moment/locale/zh-cn';
import styles from "./filterCondition.less"

import GenerateFilterCondition from "./filterHOC"
const Option = Select.Option;

/* const Data = {
    showSearch:true,
    treeData:[{
        title: 'Node1',
        value: '0-0',
        key: '0-0',
      }, {
        title: 'Node2',
        value: '0-1',
        key: '0-1',
      }, {
        title: 'Node2',
        value: '0-2',
        key: '0-2',
      }, {
        title: 'Node2',
        value: '0-3',
        key: '0-3',
      }, {
        title: 'Node2',
        value: '0-4',
        key: '0-4',
      }],
    value: "0-0",
    // treeCheckable: true,
    showCheckedStrategy: TreeSelect.SHOW_PARENT,
    searchPlaceholder: 'Please select',
}
function FilterCom() {
    return (
        <div className={styles.filterContainer}>
            <div className={styles.filterHeader}>
                <div className={styles.inlineBlock+" "+styles.filterHeaderDes}>
                    <div className={styles.filterTitle+" "+styles.inlineBlock}>出差天数（0.5标识半天）</div>
                    <Select className={styles.filterCompare} defaultValue={"all"} dropdownMatchSelectWidth={false}>
                        <Option value="all">不等于任意一个</Option>
                        <Option value="any">任一</Option>
                    </Select>
                </div>
                <Icon type="delete" theme="outlined" className={styles.filterIcon}/>
            </div>
            <div className={styles.filterContent}>
                <Input className={styles.filterItem}/>
                <DatePicker className={styles.filterItem} showTime format="YYYY-MM-DD HH:mm:ss"/>
                <Select className={styles.filterItem+" "+styles.filterItemSelect} defaultValue={1}>
                    <Option value="1">呵呵</Option>
                </Select>
                <TreeSelect className={styles.filterItem+" "+styles.filterItemSelect} {...Data}/>
                <TreeSelect className={styles.filterItem+" "+styles.filterItemSelect} {...Data} />
                <Select className={styles.filterItem+" "+styles.filterItemSelect} defaultValue={1} placeholder="省/自治区/直辖市">
                    <Option value="1">北京</Option>
                </Select>
                <div className={styles.filterLocation}>
                    <Select className={styles.filterLocationItem+" "+styles.filterItemSelect} defaultValue={1} placeholder="市">
                        <Option value="1">呵呵</Option>
                    </Select>
                    <Select className={styles.filterLocationItem+" "+styles.filterItemSelect} defaultValue={1} placeholder="区/县">
                        <Option value="1">呵呵</Option>
                    </Select>
                </div>
            </div>
        </div>
    );
} */

class FilterCondition extends Component {
    constructor(props){
        super(props);
    }
    filterFeildChange(type,e){
        // console.log(type,e);
        this.props.dispatch({
            type:"dataManage/filterConditionChange",
            payload:{
                id:e,
                type
            }
        });
    }
    render() {
        let {fieldNameArr} = this.props;
        let selectFilterArr = [];
        fieldNameArr.forEach(v=>{
            v["isFilter"] && selectFilterArr.push(v["id"]);
        });
        return (
            <div className={styles.container}>
                <Icon className={styles.affixed} type="pushpin" theme="outlined" />
                <div className={styles.header}>
                    筛选符合以下<Select defaultValue={"all"} className={styles.headerSelect}>
                        <Option value="all">所有</Option>
                        <Option value="any">任一</Option>
                    </Select>条件的数据
                </div>
                <div>
                    <div className={styles.filterText}><Icon type="plus" theme="outlined" />添加筛选条件</div>
                    <Select
                        mode="tags"
                        style={{ width: '100%' }}
                        placeholder="添加筛选条件"
                        className={styles.filterSelect}
                        defaultValue ={selectFilterArr}
                        onSelect={this.filterFeildChange.bind(this,1)}
                        onDeselect = {this.filterFeildChange.bind(this,0)}
                    >
                        {fieldNameArr.map((v,i)=>(
                            <Option key={i} value={v["id"]}>{v["name"]}</Option>
                        ))}
                    </Select>
                </div>
                <div className={styles.filterList}>
                    <GenerateFilterCondition {...this.props}/>
                </div>
                <div className={styles.filterBtn}>
                    <div className={styles.filter}>筛选</div>
                    <div className={styles.clear}>
                        <Icon type="tool" theme="outlined" style={{ marginLeft: "4px" }} />
                        清除
                    </div>
                </div>
            </div>
        );
    }
}

export default FilterCondition;