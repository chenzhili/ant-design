import React from 'react';
// import { connect } from 'dva';
import { Table } from "antd"
// import PropTypes from 'prop-types'


import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import { Tabs, Button } from 'antd';
import { Guid } from "../../utils/com"
import styles from "./PackageH1.less"
const TabPane = Tabs.TabPane;


const columns = [{
  title: 'A',
  dataIndex: 'name',
}, {
  title: 'B',
  dataIndex: 'age',
}, {
  title: 'C',
  dataIndex: 'tel',
  render: (value, row, index) => {
    // console.log(row);
    return {
      children: value,
      props: {},
    };
  },
}, {
  title: 'D',
  dataIndex: 'phone',
}, {
  title: 'E',
  dataIndex: 'address',
}];
const guidArr = [Guid(), Guid(), Guid(), Guid(), Guid(), Guid(), Guid(), Guid(),Guid(),]
const realColumn = [{
  title: "A",
  dataIndex: guidArr[0],
  width: "100px",
  isMain: true,
  sorter:true
},{
  title:"子表3",
  children:[
    {
      title:"子表31",
      dataIndex:guidArr[7],
      width:"100px"
    },
    {
      title:"子表32",
      dataIndex:guidArr[8],
      width:"100px"
    }
  ]
}, {
  title: "B",
  dataIndex: guidArr[1],
  width: "100px",
  isMain: true,
}, {
  title: "firstForm",
  children: [
    {
      title: "formA",
      width: "100px",
      dataIndex: guidArr[2],
    }, {
      title: "formB",
      width: "100px",
      dataIndex: guidArr[3]
    }
  ]
}, {
  title: "C",
  dataIndex: guidArr[4],
  width: "100px",
  isMain: true,
}, {
  title: "secondForm",
  children: [
    {
      title: "formAA",
      width: "100px",
      dataIndex: guidArr[5]
    }, {
      title: "formBB",
      width: "100px",
      dataIndex: guidArr[6]
    }
  ]
}];
console.log("realColumn", realColumn);
// 表格数据模板
const realData = {
  config: "",
  data: [
    // 这个是 一行
    {
      cells: [
        {
          code: "id", value: "123", isKey: true
        },
        {
          code: guidArr[0], value: "字符串1"
        },
        {
          code: guidArr[1], value: "字符串2"
        },
        {
          code: guidArr[4], value: "字符串3"
        }
      ],
      children: [
        // 第一个子表单
        {
          config: "",
          data: [
            // 这个是 一行
            {
              cells: [
                {
                  code: "id", value: "1-123", isKey: true
                },
                {
                  code: guidArr[2], value: "子表1 数据1"
                },
                {
                  code: guidArr[3], value: "子表1 数据2"
                }
              ]
            }
          ]
        },
        // 第二个子表单
        {
          config: "",
          data: [
            // 这个是 一行
            {
              cells: [
                {
                  code: "id", value: "2-123", isKey: true
                },
                {
                  code: guidArr[5], value: "子表2 数据1"
                },
                {
                  code: guidArr[6], value: "子表2 数据2"
                }
              ]
            },
            {
              cells: [
                {
                  code: "id", value: "2-1234", isKey: true
                },
                {
                  code: guidArr[5], value: "字符串211"
                },
                {
                  code: guidArr[6], value: "字符串222"
                }
              ]
            },
            {
              cells: [
                {
                  code: "id", value: "2-12345", isKey: true
                },
                {
                  code: guidArr[5], value: "字符串2111"
                },
                {
                  code: guidArr[6], value: "字符串2222"
                }
              ]
            }
          ]
        },
        // 第三个子表
        {
          config: "",
          data: [
            // 这个是 一行
            {
              cells: [
                {
                  code: "id", value: "1-1-123", isKey: true
                },
                {
                  code: guidArr[7], value: "子表3 数据1"
                },
                {
                  code: guidArr[8], value: "子表3 数据2"
                }
              ]
            },
            {
              cells: [
                {
                  code: "id", value: "1-2-1234", isKey: true
                },
                {
                  code: guidArr[7], value: "子表3 数据3"
                },
                {
                  code: guidArr[8], value: "子表3 数据4"
                }
              ]
            },
          ]
        }
      ]
    },
    {
      cells: [
        {
          code: "id", value: "1233", isKey: true
        },
        {
          code: guidArr[0], value: "字符串1"
        },
        {
          code: guidArr[1], value: "字符串2"
        },
        {
          code: guidArr[4], value: "字符串3"
        }
      ],
      children: [
        // 第一个子表单
        {
          config: "",
          data: [
            // 这个是 一行
            {
              cells: [
                {
                  code: "id", value: "1-123", isKey: true
                },
                {
                  code: guidArr[2], value: "子表1 数据1"
                },
                {
                  code: guidArr[3], value: "子表1 数据2"
                }
              ]
            }
          ]
        },
        // 第二个子表单
        {
          config: "",
          data: [
            // 这个是 一行
            {
              cells: [
                {
                  code: "id", value: "2-123", isKey: true
                },
                {
                  code: guidArr[5], value: ""
                },
                {
                  code: guidArr[6], value: "子表2 数据2"
                }
              ]
            },
            {
              cells: [
                {
                  code: "id", value: "2-1234", isKey: true
                },
                {
                  code: guidArr[5], value: "字符串211"
                },
                {
                  code: guidArr[6], value: "字符串222"
                }
              ]
            },
          ]
        },
        // 第三个子表
        {
          config: "",
          data: [
            // 这个是 一行
            {
              cells: [
                {
                  code: "id", value: "1-1-123", isKey: true
                },
                {
                  code: guidArr[7], value: "子表3 数据1"
                },
                {
                  code: guidArr[8], value: "子表3 数据2"
                }
              ]
            },
          ]
        }
      ]
    }
  ]
}
// let item = realData["data"][0];
// for(let i=0;i<20;i++){
//   item["cells"][0]["value"] = Guid()+""+i;
//   realData["data"].push(item);
// }

// 处理 column 的 每个 render 函数，生成 新的  column
let generateColumn = (column) => {
  if (!column || !column.length) return [];
  let tempColumn = JSON.parse(JSON.stringify(column));
  let newColumn = (column) => {
    column.forEach(v => {
      if (!v.children || !v.children.length) {
        if (v["isMain"]) {
          v["render"] = (value, row, index) => {
            if (!value) {
              return {
                children: "",
                props:{
                  colSpan:0,
                  rowSpan:0
                }
              }
            }
            if (value["isMain"]) {
              return {
                children: value["value"],
                props: {
                  rowSpan: row["maxRowSpan"]
                }
              }
            }else{
              return {
                children:value["value"]
              }
            }
          }
        }
      }
      if (v["children"] && v["children"].length) {
        newColumn(v["children"]);
      }
    });
    return column;
  }
  tempColumn = newColumn(tempColumn);
  return tempColumn;
}
// 将 cells的 数据 处理成 主表单 对象
let dealMainAndSubForm = ({ rowData, isMain }) => {
  if (!rowData["cells"] || !rowData["cells"].length) return [];
  let cells = rowData["cells"], tempObj = {};
  cells.forEach(v => {
    if (v["isKey"]) {
      tempObj["key"] = v["value"];
    } else {
      tempObj[v["code"]] = isMain?{ value: v["value"], isMain }:v["value"];
    }
  });
  // console.log("tempObj",tempObj);
  return tempObj;
}
// 计算表格 一行 的 最大 的 合并 行，并且判断当前是否 有子表单 的 合并行
let getMaxRowSpan = (rowChildren) => {
  if (!rowChildren || !rowChildren.length) return 0;
  let subFormRowSpanArr = [];
  rowChildren.forEach(v => {
    if (v["data"] && v["data"].length) {
      subFormRowSpanArr.push(v["data"].length);
    }
  });
  return Math.max.apply(null, subFormRowSpanArr);
}
// 处理 数据 为 table 一行要的 数据
function dealTableRowData(rowData) {
  if (!rowData) return [];
  let realDealRowArr = [];
  let mainFormObj = dealMainAndSubForm({ rowData, isMain: true });
  let maxRowSpan = getMaxRowSpan(rowData["children"]);
  if (maxRowSpan) {
    let allSubForm = {}, dealAllSubForm = [];
    rowData["children"].forEach((v, i) => {
      // 这里的 v 就是 一个 子表单
      allSubForm[i] = [];
      if (v["data"] && v["data"].length) {
        v["data"].forEach(itemRow => {
          // itemRow为 子表单的 一行 
          allSubForm[i].push(dealMainAndSubForm({ rowData: itemRow, isMain: false }));
        });
      }
    });
    // console.log("allSubForm",allSubForm);
    new Array(maxRowSpan).fill(0).forEach((i, index) => {
      let tempArr = [];
      Object.keys(allSubForm).forEach(item => {
        let tempObj = allSubForm[item][index] || {};
        // console.log('tempObj',tempObj);
        tempArr[index] = tempArr[index] ? { ...tempArr[index], ...tempObj } : { ...tempObj };
      });
      // console.log("tempArr",tempArr);
      dealAllSubForm.push(tempArr[index]);
    });
    // console.log("dealAllSubForm", dealAllSubForm);
    dealAllSubForm.forEach((v, i) => {
      if (i === 0) {
        realDealRowArr.push({ ...v, ...mainFormObj, key:`${mainFormObj["key"]}${i}`, maxRowSpan,mainId:mainFormObj["key"] });
      } else {
        realDealRowArr.push({ ...v, key:`${mainFormObj["key"]}${i}`, maxRowSpan,mainId:mainFormObj["key"] });
      }
    });
  } else {
    realDealRowArr.push(mainFormObj);
  }
  // console.log("realDealRowArr", realDealRowArr);
  return realDealRowArr;
}
// 循环处理 table的 数据
let newTableData = (tableData)=>{
  if(!tableData["data"] || !tableData["data"].length)return [];
  let resultDataArr = [];
  tableData["data"].forEach(v=>{
    // resultDataArr = [...resultDataArr,...arr];
    resultDataArr = resultDataArr.concat(dealTableRowData(v));
  });
  return resultDataArr;
}


const dealData = newTableData(realData);
console.log(dealData);

// 测试怎么合并 数据
let testColumn = [{
  title: "A",
  dataIndex: "a1",
  width: "100px",
  render: (value, row, index) => {
    console.log(value);
    if (!value) return {
      children: "",
      props: {
        rowSpan: 0,
        colSpan: 0
      }
    };
    return {
      children: value,
      props: {
        rowSpan: 3
      },
    }
  }
}, {
  title: "B",
  dataIndex: "a2",
  width: "100px",
  /* render: (value, row, index) => {
    return {
      children: value,
      props: {
        rowSpan:3,
      },
    }
  } */
}, {
  title: "firstForm",
  children: [
    {
      title: "formA",
      width: "100px",
      dataIndex: "a3",
    }, {
      title: "formB",
      width: "100px",
      dataIndex: "a4"
    }
  ]
}, {
  title: "C",
  dataIndex: "a5",
  width: "100px",
  /* render: (value, row, index) => {
    return {
      children: value,
      props: {
        rowSpan:3
      },
    }
  } */
}, {
  title: "secondForm",
  children: [
    {
      title: "formAA",
      width: "100px",
      dataIndex: "a6"
    }, {
      title: "formBB",
      width: "100px",
      dataIndex: "a7"
    }
  ]
}];
const testData = [
  {
    key: 1,
    a1: "a",
    a2: "aa",
    a3: "aa",
    a4: "aa",
    a5: "aa",
    a6: "aa",
    a7: "aa",
  },
  {
    key: 2,
    // a1:"b",
    a2: "bb",
    a3: "bb",
    a4: "bb",
    a5: "bb",
    a6: "bb",
    a7: "bb",
  },
  {
    key: 3,
    // a1:"c",
    a2: "cc",
    a3: "cc",
    a4: "cc",
    a5: "cc",
    a6: "cc",
    a7: "cc",
  },
];
const dealColumn = generateColumn(realColumn);
console.log("dealColumn",dealColumn);
class H1Test extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      activeId:""
    }
  }
  render() {
    let {activeId} = this.state;
    return (
      <Table columns={dealColumn} dataSource={dealData} bordered
      rowClassName={(record)=>{
        // console.log(record);
        if(record["mainId"] === activeId){
          return styles.test
        }
      }}
      onRow={(record) => {
        return {
          onClick: () => {
            console.log("行数据",record["mainId"]);
          },       // 点击行
          onMouseEnter: () => {
            // console.log(record);
            this.setState({
              activeId:record["mainId"]
            });
          },  // 鼠标移入行
          onMouseMove:()=>{
            this.setState({
              activeId:record["mainId"]
            });
          },
          onMouseOut:()=>{
            this.setState({
              activeId:""
            });
          }
        };
      }}
      onChange = {(pagination, filters, sorter)=>{
        console.log(sorter);
      }}
      />
    );
  }
}

export default H1Test;