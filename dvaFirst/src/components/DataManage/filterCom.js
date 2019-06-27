import { Component, Fragment } from "react"
import { CheckBox, Input, Icon, Checkbox, Select, DatePicker, TreeSelect, InputNumber, Spin } from "antd"
import { connect } from "dva";
import moment from 'moment';
import 'moment/locale/zh-cn';
import styles from "./filterCom.less"
import debounce from 'lodash/debounce';
import { getFieldItem } from "../../services/DataManage/DataManage"

import FilterPart from '../BookAddress/MemberCom/FilterPart'
const Option = Select.Option;


class ChildSelectCom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectArr: [],
            searchSelectArr: [],
        }
        this.search = debounce(this.search, 800);
        this.initSelectArr = this.initSelectArr.bind(this);
        this.onChange = this.onChange.bind(this);
        this.search = this.search.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.initSelectArr(props.id);
    }
    async initSelectArr(id, searchWord) {
        let WhereExpression = searchWord ? " {0} like '%value%' ".replace("value", searchWord) : "";
        let {data} = await getFieldItem({ FormTemplateId: this.props.templateId, FormTemplateVersionId: this.props.FormTemplateVersionId, ColumnIds: [id], WhereExpression, PageSize: 100 });
        if(data && data instanceof Array){
            this.setState({ [searchWord ? "searchSelectArr" : "selectArr"]: data.filter(item => item.value) });
        }
    }
    search(value) {
        this.initSelectArr(this.props.id, value);
    }
    onChange(value) {
        this.props.changeConditionValue(this.props.id, { value: value });
    }
    onBlur() {
        this.state.searchSelectArr.length = 0;
        this.setState({
            searchSelectArr: this.state.searchSelectArr
        });
    }
    render() {
        const { selectArr, searchSelectArr } = this.state;
        const { multiple, value } = this.props;
        // console.log(selectArr);
        return (
            <Select
                mode={multiple ? "multiple" : null}
                value={value ? value : []}
                filterOption={false}
                onSearch={this.search}
                onChange={this.onChange}
                style={{ width: '100%' }}
                showSearch={true}
                onBlur={this.onBlur}
            >
                {
                    (searchSelectArr.length ? searchSelectArr : selectArr).map(d => <Option key={d.value}>{d.value}</Option>)
                }
            </Select>
        )
    }
}


/* 细化每一个 筛选 item 项 */
function FilterText(props) {
    let { condition, changeConditionValue, value, id, templateId, FormTemplateVersionId } = props;
    const selectType = ["4", "5", "6", "7"];
    const select = selectType.some(item => item === condition);
    // console.log(props);
    return (
        <Fragment>
            {
                select ? <ChildSelectCom templateId={templateId} FormTemplateVersionId={FormTemplateVersionId} multiple={condition === "6" || condition === "7"} changeConditionValue={changeConditionValue} value={value} id={id} /> : (condition !== "2" && condition !== "3" && <Input value={value} className={styles.filterItem} onChange={(e) => { changeConditionValue(id, { value: e.target.value }) }} />)
            }
        </Fragment>
    );
}

function FilterNum(props) {
    let { condition, changeConditionValue, value, id } = props;
    // console.log(value);
    const onChange = (value,index,e) => {
        let tempData = null;
        if (value instanceof Array) {
            tempData = [...value];
            tempData[index] = e;
        } else {
            tempData = [];
            tempData[index] = e;
        }
        changeConditionValue(id, { value: tempData });
    }
    return (
        <Fragment>
            {
                condition !== "2" && condition !== "3" && (
                    <Fragment>
                        {condition !== "12" ? <InputNumber value={value} className={styles.filterItem} onChange={(e) => { changeConditionValue(id, { value: e }) }} /> : (
                            <div className={styles.filterNumRange}>
                                <InputNumber value={value[0]} className={styles.filterNumRangeItem} placeholder="最小值" onChange={onChange.bind(null,value,0)} />
                                <div>~</div>
                                <InputNumber value={value[1]} className={styles.filterNumRangeItem} placeholder="最大值" onChange={onChange.bind(null,value,1)} />
                            </div>
                        )}
                    </Fragment>
                )
            }
        </Fragment>
    );
}

function FilterDate(props) {
    let { condition, changeConditionValue, value, id, extendedType, layout } = props;
    const isHorizon = layout === "horizon";
    console.log(condition, extendedType);
    const treeData = [{
        title: '固定值',
        value: "0",
        key: '0',
    }, {
        title: '今天',
        value: "1",
        key: '1',
    }, {
        title: '昨天',
        value: "2",
        key: '2',
    }, {
        title: '本周',
        value: "3",
        key: '3',
    }, {
        title: '上周',
        value: "4",
        key: '4',
    }, {
        title: '本月',
        value: "5",
        key: '5',
    }, {
        title: '上月',
        value: "6",
        key: '6',
    }];
    const onChange = (value, index, e) => {
        let tempData = null, tempValue = moment(e).format("YYYY-MM-DD HH:mm:ss");
        if (value instanceof Array) {
            tempData = [...value];
            tempData[index] = tempValue;
        } else {
            tempData = [];
            tempData[index] = tempValue;
        }
        changeConditionValue(id, { value: tempData });
    }
    return (
        <Fragment>
            {
                condition !== "2" && condition !== "3" && (
                    <Fragment>
                        {condition !== "12" ? (<Fragment>
                            {
                                condition === "4" ? <TreeSelect showSearch value={extendedType} treeData={treeData} className={`${styles.filterItem} ${styles.filterItemSelect} ${isHorizon ? styles.filterItemH : ""}`}
                                    onChange={(e) => { changeConditionValue(id, { extendedType: e }) }}
                                /> : null
                            }
                            {
                                extendedType === "0" ? <DatePicker value={value ? moment(value) : moment()} className={styles.filterItem} showTime format="YYYY-MM-DD HH:mm:ss"
                                    onChange={(e) => { changeConditionValue(id, { value: moment(e).format("YYYY-MM-DD HH:mm:ss") }) }}
                                /> : null
                            }

                        </Fragment>) : (
                                <Fragment>
                                    <DatePicker value={value ? moment(value[0]) : moment()} placeholder="起始日期" className={`${styles.filterItem} ${isHorizon ? styles.filterItemH : ""}`} showTime format="YYYY-MM-DD HH:mm:ss" onChange={onChange.bind(null, value, 0)} />
                                    <DatePicker value={value ? moment(value[1]) : moment()} placeholder="结束日期" className={styles.filterItem} showTime format="YYYY-MM-DD HH:mm:ss" onChange={onChange.bind(null, value, 1)} />
                                </Fragment>
                            )

                        }
                    </Fragment>
                )
            }
        </Fragment>
    );
}
function FilterSelect(props) {
    let { condition, changeConditionValue, value, id } = props;
    // console.log(props);
    const treeData = [{
        title: '全选',
        value: '0',
        key: '0',
    }, {
        title: '未填写',
        value: '-1',
        key: '-1',
    }, {
        title: 'wowo',
        value: '1',
        key: '1',
    }];
    return (
        <Fragment>
            {
                (condition === "4" || condition === "5") && <Select className={styles.filterItem + " " + styles.filterItemSelect}
                    value={value}
                    onChange={(e) => { changeConditionValue(id, { value: e }); }}
                >
                    {treeData.map((v, i) => {
                        if (v["value"] != "0" && v["value"] != -1) {
                            return (
                                <Option key={i} value={v["value"]}>{v["title"]}</Option>
                            );
                        }
                    })}
                </Select>
            }
            {
                condition !== "2" && condition !== "3" && condition != "4" && condition != "5" && <TreeSelect value={value} treeCheckable treeData={treeData} className={styles.filterItem + " " + styles.filterItemSelect}
                    value={value}
                    onSelect={(e) => {
                        if (e === "0") {
                            let tempArr = [];
                            treeData.forEach(v => {
                                tempArr.push(v["value"]);
                            });
                            changeConditionValue(id, { value: tempArr });
                        } else {
                            let tempArr = value ? [...value] : [];
                            tempArr.push(e);
                            if (tempArr.length == (treeData.length - 1)) {
                                tempArr.push("0");
                            }
                            changeConditionValue(id, { value: tempArr });
                        }
                    }}
                    onDeselect={(e) => {
                        if (e === "0") {
                            changeConditionValue(id, { value: [] });
                        } else {
                            let tempArr = value ? [...value] : [];
                            for (let i = 0; i < tempArr.length; i++) {
                                let item = tempArr[i];
                                if (item === e) {
                                    tempArr.splice(i, 1);
                                    i--;
                                }
                                if (item === "0") {
                                    tempArr.splice(i, 1);
                                    i--;
                                }
                            }
                            changeConditionValue(id, { value: tempArr });
                        }
                    }} />
            }
        </Fragment>
    );
}

function FilterLocation(props) {
    let { condition, changeConditionValue, value, id, provArr, cityArr, countArr, getLocationArr, layout } = props;
    console.log(props);
    value = value instanceof Array ? value : [];
    const onChange = function (type, e) {
        value = value instanceof Array ? value : [];
        switch (type) {
            case "ProId":
                value[0] = e; value[1] = ""; value[2] = "";
                break;
            case "CityId":
                value[1] = e; value[2] = "";
                break;
            default:
                value[2] = e;
        }
        let keyValue = { value };
        if (type === "") {
            changeConditionValue(id, keyValue);
            return
        }
        if (e === "") {
            switch (type) {
                case "ProId":
                    keyValue.cityArr = []; keyValue.countArr = [];
                    break;
                case "CityId":
                    keyValue.countArr = [];
                    break;
            }
            changeConditionValue(id, keyValue);
        } else {
            let item = (type === "ProId" ? provArr : cityArr).filter(v => v.Name === e)[0];
            const callBack = () => {
                getLocationArr({ type, value: item[type], id });
            }
            changeConditionValue(id, keyValue, callBack);
        }
    }
    return (
        <Fragment>
            {
                condition !== "2" && condition !== "3" && (
                    <div className={`${layout === "horizon" ? styles.horizonContainer : ""}`}>
                        <Select showSearch className={styles.filterItem + " " + styles.filterItemSelect} value={value[0]} placeholder="省/自治区/直辖市"
                            onFocus={() => { console.log("测试"); }}
                            onChange={onChange.bind(null, "ProId")}>
                            <Option value="">--请选择--</Option>
                            {
                                provArr.map((v, i) => (
                                    <Option key={i} value={v.Name}>{v.Name}</Option>
                                ))
                            }
                        </Select>
                        <div className={styles.filterLocation}>
                            <Select showSearch className={styles.filterLocationItem + " " + styles.filterItemSelect} value={value[1]} placeholder="市" onChange={onChange.bind(null, "CityId")}>
                                <Option value="">--请选择--</Option>
                                {
                                    cityArr.map((v, i) => (
                                        <Option key={i} value={v.Name}>{v.Name}</Option>
                                    ))
                                }
                            </Select>
                            <Select showSearch className={styles.filterLocationItem + " " + styles.filterItemSelect} value={value[2]} placeholder="区/县" onChange={onChange.bind(null, "")}>
                                <Option value="">--请选择--</Option>
                                {
                                    countArr.map((v, i) => (
                                        <Option key={i} value={v.Name}>{v.Name}</Option>
                                    ))
                                }
                            </Select>
                        </div>
                    </div>
                )
            }
        </Fragment>
    );
}
/* 特殊空间 有关 成员组件 和 部门组件 */
class MemOrDep extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visibleModal: false
        }
    }
    controlFilter = (bool) => {
        this.setState({ visibleModal: bool });
    }
    confirmSubmit = (data) => {
        this.props.changeConditionValue(this.props.id, { value: data });
    }
    render() {
        console.log(this.props);
        const { visibleModal } = this.state;
        let { value, id, type, condition } = this.props;
        let showFilterArr = [];
        if (type === "member") {
            [].push.call(showFilterArr, ...[{ type: 0, name: "部门", idList: [], isTree: true },
            { type: 1, name: "角色", idList: [], isTree: true },
            { type: 2, name: "成员", idList: [], isTree: false },])
        } else {
            showFilterArr.push({ type: 0, name: "部门", idList: [] });
        }
        const filterPartProps = {
            controlFilterPart: {
                isShowModal: visibleModal,
                showFilterArr,
                selectedData: value instanceof Array ? value : [],
                headerTitle: type === "member" ? "成员列表" : "部门列表",
                singleOrMultiple: condition === "0" ? 0 : 1,//0 为 单选，1 为 多选
            },
            controlFilter: this.controlFilter,
            confirmSubmit: this.confirmSubmit,
        }
        return (
            <Fragment>
                {
                    visibleModal ? <FilterPart {...filterPartProps} /> : null
                }
                <Input readOnly={true} onClick={this.controlFilter.bind(null, true)} value={value instanceof Array ? value.map(item => item.name).join(",") : value} />
            </Fragment>
        )
    }
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
    "attach": {
        Com: FilterText
    },
    "member": {
        Com: MemOrDep
    },
    "department": {
        Com: MemOrDep
    }
}