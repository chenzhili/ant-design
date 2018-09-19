import { Map, List, is } from 'immutable';
import moment from "moment";
import { Guid, optionObj } from "../../utils/com";

/**数据管理
 * 获取 字段 数组
 * @param {*} columns 
 * @param {*} title 
 */
function getFeildName(columns, title) {
    if (!columns.length) return;
    let tempArr = [];
    columns.forEach(v => {
        let subtitle = "";
        subtitle = title ? `${title}.${v.title}` : v.title;
        if (v.children) {
            tempArr = tempArr.concat(getFeildName(v.children, subtitle));
        } else {
            tempArr.push({ name: subtitle, type: v["type"], dataIndex: v["dataIndex"], id: v["id"] });
        }
    });
    return tempArr
}
// 添加colSpan
let i = 1;
function _updateArr(columns, dealArr, isShow) {
    if (!columns.length) return;
    let n = dealArr.length;
    columns.forEach(v => {
        if (v["title"] === dealArr[i - 1]) {
            if (i !== n) {
                if (v["children"].length) {
                    i++;
                    _updateArr(v["children"], dealArr, isShow);
                }
            }
            if (i == n) {
                if (isShow) {
                    if (v.hasOwnProperty("colSpan")) {
                        delete (v["colSpan"]);
                    }
                } else {
                    v["colSpan"] = 0;
                }
                i = 1;
            }
        }
    });
}
// 判断子集是否都有colSpan，有父级也加上
function judgeCol(columns) {
    if (!columns.length) return;
    function judgeAll(child) {
        for (let i = 0; i < child.length; i++) {
            let item = child[i];
            if (!item.hasOwnProperty("colSpan")) {
                return false;
            }
        }
        return true;
    }
    columns.forEach(v => {
        let child = v["children"];
        if (child && child.length) {
            judgeCol(child);
            if (judgeAll(child)) {
                v["colSpan"] = 0;
            }
        }
    })
}
function updateFeildName(columns, showFeildNameArr) {
    if (!columns.length) return;
    if (!showFeildNameArr.length) return;
    let dealFeildNameArr = [];
    showFeildNameArr.concat().forEach(v => {
        dealFeildNameArr.push({ name: v["name"].split("."), isShow: v["isShow"] });
    });
    // 这种做法是为了实现到时候是统一修改 多个 字段，不适用于 发生变化就重新渲染
    dealFeildNameArr.forEach(v => {
        _updateArr(columns, v["name"], v["isShow"]);
    });
    // 如果 children中 都有colSapn，就在 父级加入 colSpan
    // console.log("处理前",columns);
    judgeCol(columns);
    // console.log("处理后",columns);
    return columns;
}
export default {
    namespace: 'dataManage',
    state: {
        menuOperate: [
            { icon: "plus", name: "批量操作" },
            { icon: "plus", name: "批量导出附件" },
            { icon: "plus", name: "批量打印二维码" },
        ],
        // 需要对每个 最后一层表头加上数据 类型 和 标识 id
        columns: [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: "100px",
            type: "string",
            id: Guid(),
            filters: [{
                text: 'Joe',
                value: 'Joe',
            }, {
                text: 'John',
                value: 'John',
            }],
            onFilter: (value, record) => record.name.indexOf(value) === 0,
        }, {
            title: 'Other',
            children: [{
                title: 'Age',
                dataIndex: 'age',
                key: 'age',
                width: "200px",
                type: "number",
                id: Guid(),
                // sorter: (a, b) => a.age - b.age,
                souter: true,//这是用于 后台请求的写法，在 onChange 事件中 去 做 异步请求
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
        }],
        tableData: [],
        // 这个数据用于 条件筛选（如果 筛选 条件 不只是 对于 字段的 那在 另说），同时用于 字段显示
        fieldNameArr: [], //存储 所有的 字段,isShow来标识是否显示此字段,isFilter 标识当前字段是否 用于 条件筛选 [{name:"name",isShow:true,type:"string",dataIndex:"gender(这个应该是 对于 字段的唯一标识符)",isFilter:true,id:"1232-232dsfs-323"}]
        filterConditionArr: [],//存储 筛选条件的所有数据 {name:"name",isShow:true,type:"string",dataIndex:"gender(这个应该是 对于 字段的唯一标识符)",isFilter:true,id:"1232-232dsfs-323",value:"",condition:"",extendedType:0}//condition用于获取 对比关系,extendedType针对 日期类型 的扩展字段
        // 导入逻辑
        importSteps: 1, //导入步骤
    },
    subscriptions: {
        Init({ dispatch }) {
            dispatch({
                type: 'init'
            });
        },
    },
    effects: {


    },
    reducers: {
        init(state, action) {
            let tempData = [];
            for (let i = 0; i < 100; i++) {
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
            // 初始化显示字段
            let { columns } = state, tempFiledNameArr = [...state.fieldNameArr];
            let tempFiledName = getFeildName(columns);
            // console.log(tempFiledName);
            tempFiledName.length && tempFiledName.forEach(v => {
                tempFiledNameArr.push({
                    id: v["id"],
                    name: v["name"],
                    isShow: true,
                    isFilter: false,
                    type: v["type"],
                    dataIndex: v["dataIndex"]
                });
            });
            return { ...state, tableData: tempData, fieldNameArr: tempFiledNameArr }
        },
        // 文件引入的逻辑
        changeSteps(state, action) {
            let { steps } = action.payload;
            return { ...state, importSteps: steps }
        },
        // 对于筛选条件的逻辑
        filterConditionChange(state, action) {
            let { fieldNameArr, filterConditionArr } = state, { id, type } = action.payload;
            if (type == 1) {
                fieldNameArr.forEach(v => {
                    if (v["id"] === id) {
                        v["isFilter"] = true;
                        let tempValue = "";
                        let tempObj = { ...v, extendedType: "0", value: tempValue, condition: optionObj[v["type"]][0]["value"] };
                        // 日期类型 对 value需要特殊处理，并且加入 provArr,cityArr,countArr 存储 省市区；
                        if (v["type"] == "date") {
                            tempValue = moment().format("YYYY-MM-DD HH:mm:ss");
                        }
                        if (v["type"] == "location") {
                            tempObj["provArr"] = [{ name: "请选择", value: "" }];
                            tempObj["cityArr"] = [];
                            tempObj["countArr"] = [];
                        }
                        filterConditionArr.push(tempObj);
                    }
                });
            }
            if (type == 0) {
                fieldNameArr.forEach(v => {
                    if (v["id"] === id) {
                        v["isFilter"] = false;
                    }
                });
                for (let i = 0; i < filterConditionArr.length; i++) {
                    let item = filterConditionArr[i];
                    if (item["id"] === id) {
                        filterConditionArr.splice(i, 1);
                        break;
                    }
                }
            }
            return { ...state, fieldNameArr, filterConditionArr }
        },
        changeConditionValue(state, action) {
            let { id, keyValue } = action.payload, { filterConditionArr } = state;
            filterConditionArr = filterConditionArr.map(v => {
                if (v["id"] === id) {
                    v = { ...v, ...keyValue }
                }
                return v;
            })
            return { ...state, filterConditionArr };
        },
        // 主要的 表格编辑数据
        deleteAll(state, action) {
            return { ...state, tableData: [] };
        },
        deleteSelectedItem(state, action) {
            let tableData = List(state.tableData).toJS(), { selectedRows } = action.payload;
            for (let i = 0; i < tableData.length; i++) {
                for (let x = 0; x < selectedRows.length; x++) {
                    let v = tableData[i], item = selectedRows[x];
                    if (v["key"] === item["key"]) {
                        tableData.splice(i, 1);
                        i--;
                        break;
                    }
                }
            }
            return { ...state, tableData };
        },
        // 数据管理 的 字段名选择 逻辑
        selectFieldItem(state, action) {
            let tempFiledNameArr = List(state.fieldNameArr).toJS(), { name } = action.payload;
            tempFiledNameArr.forEach(v => {
                if (v["name"] === name) {
                    v["isShow"] = !v["isShow"];
                }
            });
            let tempColumns = updateFeildName(state.columns, tempFiledNameArr);
            return { ...state, fieldNameArr: tempFiledNameArr, columns: tempColumns };
        },
        selectAll(state, action) {
            let tempFiledNameArr = List(state.fieldNameArr).toJS(), { isAll, type, fieldNameArr } = action.payload, newColumns = null;
            if (type === "isAll") {
                state.columns.length && localStorage.setItem("columns", JSON.stringify(state.columns));
                tempFiledNameArr.forEach(v => {
                    v["isShow"] = isAll
                });
                newColumns = isAll ? JSON.parse(localStorage.getItem("columns")) : [];
                // console.log(isAll,newColumns);
            }
            if (type === "isSearchAll") {
                tempFiledNameArr.forEach(v => {
                    fieldNameArr.forEach(i => {
                        if (i["name"] == v["name"]) {
                            v["isShow"] = isAll;
                        }
                    });
                });
                newColumns = updateFeildName(JSON.parse(localStorage.getItem("columns")), tempFiledNameArr);
            }
            return { ...state, fieldNameArr: tempFiledNameArr, columns: newColumns };
        }
    }
}