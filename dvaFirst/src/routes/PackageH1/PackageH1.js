import React from 'react';
// import { connect } from 'dva';
import { Table,Tag,Divider } from "antd"
// import PropTypes from 'prop-types'


import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import { Tabs, Button } from 'antd';
import { Guid } from "../../utils/com"
import styles from "./PackageH1.less"
const TabPane = Tabs.TabPane;
const { Column, ColumnGroup } = Table;

let headerIds = new Array(42).fill(1).map(item => Guid());

/* 格式化 表头 数据 */
var headerColumns = [
  [
    { "Value": "序号", "RowSpan": 3, "ColumnSpan": 1, "IsRender": true },
    { "Value": "个人承担任务（20%）", "RowSpan": 3, "ColumnSpan": 3, "IsRender": true },
    { "Value": "", "RowSpan": 3, "ColumnSpan": 3, "IsRender": false },
    { "Value": "", "RowSpan": 3, "ColumnSpan": 3, "IsRender": false },
    { "Value": "计划完成时间", "RowSpan": 3, "ColumnSpan": 1, "IsRender": true },
    { "Value": "实际完成时间", "RowSpan": 3, "ColumnSpan": 1, "IsRender": true },
    { "Value": "工作量(天)", "RowSpan": 3, "ColumnSpan": 1, "IsRender": true },
    { "Value": "评分标准", "RowSpan": 3, "ColumnSpan": 1, "IsRender": true },

    { "Value": "上级评估", "RowSpan": 1, "ColumnSpan": 3, "IsRender": true },
    { "Value": "", "RowSpan": 1, "ColumnSpan": 3, "IsRender": false },
    { "Value": "", "RowSpan": 1, "ColumnSpan": 3, "IsRender": false },


    { "Value": "再上级评估", "RowSpan": 1, "ColumnSpan": 3, "IsRender": true },
    { "Value": "", "RowSpan": 1, "ColumnSpan": 3, "IsRender": false },
    { "Value": "", "RowSpan": 1, "ColumnSpan": 3, "IsRender": false }
  ],

  [
    { "Value": "", "RowSpan": 3, "ColumnSpan": 1, "IsRender": false },
    { "Value": "", "RowSpan": 3, "ColumnSpan": 3, "IsRender": false },
    { "Value": "", "RowSpan": 3, "ColumnSpan": 3, "IsRender": false },
    { "Value": "", "RowSpan": 3, "ColumnSpan": 3, "IsRender": false },
    { "Value": "", "RowSpan": 3, "ColumnSpan": 1, "IsRender": false },
    { "Value": "", "RowSpan": 3, "ColumnSpan": 1, "IsRender": false },
    { "Value": "", "RowSpan": 3, "ColumnSpan": 1, "IsRender": false },
    { "Value": "", "RowSpan": 3, "ColumnSpan": 1, "IsRender": false },

    { "Value": "得分1", "RowSpan": 1, "ColumnSpan": 2, "IsRender": true },
    { "Value": "", "RowSpan": 1, "ColumnSpan": 2, "IsRender": false },
    { "Value": "加权得分", "RowSpan": 2, "ColumnSpan": 1, "IsRender": true },


    { "Value": "得分2", "RowSpan": 1, "ColumnSpan": 2, "IsRender": true },
    { "Value": "", "RowSpan": 1, "ColumnSpan": 2, "IsRender": false },
    { "Value": "加权得分", "RowSpan": 2, "ColumnSpan": 1, "IsRender": true }
  ],

  [
    { "Value": "", "RowSpan": 3, "ColumnSpan": 1, "IsRender": false },
    { "Value": "", "RowSpan": 3, "ColumnSpan": 3, "IsRender": false },
    { "Value": "", "RowSpan": 3, "ColumnSpan": 3, "IsRender": false },
    { "Value": "", "RowSpan": 3, "ColumnSpan": 3, "IsRender": false },
    { "Value": "", "RowSpan": 3, "ColumnSpan": 1, "IsRender": false },
    { "Value": "", "RowSpan": 3, "ColumnSpan": 1, "IsRender": false },
    { "Value": "", "RowSpan": 3, "ColumnSpan": 1, "IsRender": false },
    { "Value": "", "RowSpan": 3, "ColumnSpan": 1, "IsRender": false },

    { "Value": "得分", "RowSpan": 1, "ColumnSpan": 1, "IsRender": true },
    { "Value": "得分1-1", "RowSpan": 1, "ColumnSpan": 1, "IsRender": true },
    { "Value": "", "RowSpan": 2, "ColumnSpan": 1, "IsRender": false },


    { "Value": "得分", "RowSpan": 1, "ColumnSpan": 1, "IsRender": true },
    { "Value": "得分2-1", "RowSpan": 1, "ColumnSpan": 1, "IsRender": true },
    { "Value": "", "RowSpan": 2, "ColumnSpan": 1, "IsRender": false }
  ]
];

function _headerColumns(columns, n) {//columns为元数据 ,n 为 header 的 行数
  let headerColumns = columns.splice(0, n);
  return headerColumns.reduce((prev, next) => {
    let rowData = next.reduce((p, n, index) => { // index 是 对应的 索引值
      const { IsRender, ...other } = n;
      if (IsRender) { p.push({ index, ...other }) };
      return p;
    }, []);
    prev.push(rowData)
    return prev;
  }, []);
}
function _addHeaderColumnsId(columns, n) {
  let firstRow = columns[0];

}
const aaa = _headerColumns(headerColumns, 3);
console.log(aaa);






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
const guidArr = [Guid(), Guid(), Guid(), Guid(), Guid(), Guid(), Guid(), Guid(), Guid(),]
const realColumn = [{
  title: "A",
  dataIndex: guidArr[0],
  width: "100px",
  isMain: true,
  sorter: true
}, {
  title: "子表3",
  children: [
    {
      title: "子表31",
      dataIndex: guidArr[7],
      width: "100px"
    },
    {
      title: "子表32",
      dataIndex: guidArr[8],
      width: "100px"
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
                props: {
                  colSpan: 0,
                  rowSpan: 0
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
            } else {
              return {
                children: value["value"]
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
      tempObj[v["code"]] = isMain ? { value: v["value"], isMain } : v["value"];
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
        realDealRowArr.push({ ...v, ...mainFormObj, key: `${mainFormObj["key"]}${i}`, maxRowSpan, mainId: mainFormObj["key"] });
      } else {
        realDealRowArr.push({ ...v, key: `${mainFormObj["key"]}${i}`, maxRowSpan, mainId: mainFormObj["key"] });
      }
    });
  } else {
    realDealRowArr.push(mainFormObj);
  }
  // console.log("realDealRowArr", realDealRowArr);
  return realDealRowArr;
}
// 循环处理 table的 数据
let newTableData = (tableData) => {
  if (!tableData["data"] || !tableData["data"].length) return [];
  return tableData["data"].reduce((prev, next) => {
    return prev.concat(dealTableRowData(next));
  }, []);
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
console.log("dealColumn", dealColumn);
class H1Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeId: ""
    }
  }
  render() {
    let { activeId } = this.state;
    return (
      <Table columns={dealColumn} dataSource={dealData} bordered
        rowClassName={(record) => {
          // console.log(record);
          if (record["mainId"] === activeId) {
            return styles.test
          }
        }}
        onRow={(record) => {
          return {
            onClick: () => {
              console.log("行数据", record["mainId"]);
            },       // 点击行
            onMouseEnter: () => {
              // console.log(record);
              this.setState({
                activeId: record["mainId"]
              });
            },  // 鼠标移入行
            onMouseMove: () => {
              if(record.mainId !== activeId){
                console.log(record.mainId,activeId);
                this.setState({
                  activeId: record["mainId"]
                });
              }
              
            },
            onMouseOut: () => {
              this.setState({
                activeId: ""
              });
            }
          }
        }}
        onChange={(pagination, filters, sorter) => {
          console.log(sorter);
        }}
      />
    );
  }
}


// 测试 自定制 cell，加上  render 的操作
let h1Data = [{
  key: '5',
  firstName: 'John',
  lastName: 'Brown',
  age: 32,
  address: 'New York No. 1 Lake Park',
  aaaa:332,
  tags: ['nice', 'developer'],
}, {
  key: '2',
  firstName: 'Jim',
  lastName: 'Green',
  age: 42,
  address: 'London No. 1 Lake Park',
  tags: ['loser'],
}, {
  key: '3',
  firstName: 'Joe',
  lastName: 'Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
  tags: ['cool', 'teacher'],
}];
const h1ColumnData = [
  { title: 'Age', dataIndex: 'aaaa', key: 'age',colSpan:2, top: true, width: 400,render:(value,row,index)=>{
    console.log(value);  
    return {children:value}
  },onCell:(record)=>{return {record,test:true}} },
  {title:"test",top:true,dataIndex:"test",key:"test",width:100,render:(value,row,index)=>{
    console.log(value);  
    return {children:value}
  }},
  { title: 'Name', group: true, top: true },
  {
      title: 'First Name', dataIndex: 'firstName', key: 'firstName', parent: 'Name', width: 200
  },
  { title: 'Last Name', dataIndex: 'lastName', key: 'lastName', parent: 'Name', width: 400 },

  { title: 'Address', dataIndex: 'address', key: 'address', top: true, width: 400 },
  {
      title: 'Tags', dataIndex: 'tags', key: 'tags', top: true, width: 400, render: tags => (
          <span>
              {tags.map(tag => <Tag color="blue" key={tag}>{tag}</Tag>)}
          </span>
      )
  },
  {
      title: 'Action', dataIndex: 'action', width: 400, key: 'action', top: true, render: (text, record) => (
          <span>
              <a href="javascript:;">Invite {record.lastName}</a>
              <Divider type="vertical" />
              <a href="javascript:;">Delete</a>
          </span>
      )
  },
]
const renderColumns = (title, columns) => {
  let childrenColumns = columns.filter(a => a.parent === title);
  return childrenColumns.map((a, i) => {
      let { group, top, ...other } = a;
      return group ? <ColumnGroup key={i} width={other.width} title={other.title}>
          {renderColumns(other.title, columns)}
      </ColumnGroup> :
          <Column key={i}  {...other}></Column>
  })
}
const buildColumns = (columns) => {
  let topColumns = columns.filter(a => a.top);
  return topColumns.map((a, i) => {
      let { group, top, ...other } = a;
      return group ? <ColumnGroup key={i} width={other.width} title={other.title}>
          {renderColumns(other.title, columns)}
      </ColumnGroup> :
          <Column key={i} {...other}></Column>
  })
}
const EditableCell = (props)=>{
  console.log(props);
  const {test} = props;
  return <td>
    {
      test?props.children:"test"
    }
  </td>
}
class H2Test extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return (
      <Table dataSource={h1Data} components={{
        body: {
            cell: EditableCell
        }
    }} scroll={{ x: "120%" }}>
        {
            buildColumns(h1ColumnData)
        }
    </Table>
    )
  }
}
const testId = Array(13).fill(1).map(i => Guid());
const tableData = [];
for (let i = 0; i < 10; i++) {
    tableData.push({
        key: i,
        name: 'John Brown',
        age: i + 1,
        street: 'Lake Park',
        building: 'C',
        number: 2035,
        companyAddress: 'Lake Street 42',
        companyName: 'SoftLake Co',
        gender: 'M',
    });
}
const newColumns = [{//testId[0]
  title: 'Name',
  dataIndex: 'name',
  key: 'name',
  width: 100,
  type: "string",
  id: testId[0],
  sorter: true,
  isData: true,
  parentId: "",
  freezeType:"1",
},
{ //testId[1]
  title: 'Other',
  dataIndex: 'Other',
  key: 'Other',
  type: "string",
  id: testId[1],
  parentId: ""
}, {//testId[2]
  title: 'Age',
  dataIndex: 'age',
  key: 'age',
  width: 200,
  type: "number",
  id: testId[2],
  sorter: true,
  parentId: testId[1],
  isData: true
}, {//testId[3]
  title: 'Address',
  dataIndex: 'Address',
  key: 'Address',
  type: "",
  id: testId[3],
  parentId: testId[1],
  isData: false
}, {//testId[4]
  title: 'Street',
  dataIndex: 'street',
  key: 'street',
  width: 200,
  type: "location",
  id: testId[4],
  parentId: testId[3],
  isData: true
}, {//testId[5]
  title: "Block",
  isData: false,
  id: testId[5],
  parentId: testId[3],
}, {//testId[6]
  title: 'Building',
  dataIndex: 'building',
  key: 'building',
  width: 100,
  type: "string",
  parentId: testId[5],
  id: testId[6],
  isData: true
}, {//testId[7]
  title: 'Door No',
  dataIndex: 'Door No',
  key: 'Door No',
  width: 100,
  type: "string",
  parentId: testId[5],
  id: testId[7],
  isData: true
}, { //testId[8]
  title: 'Company',
  id: testId[8],
  parentId: ""
}, {//testId[9]
  title: 'Company Address',
  dataIndex: 'companyAddress',
  key: 'companyAddress',
  width: 100,
  type: "string",
  id: testId[9],
  parentId: testId[8],
  isData: true
}, {//testId[10]
  title: '附件',
  dataIndex: 'companyName',
  key: 'companyName',
  width: 100,
  type: "attach",
  id: testId[10],
  parentId: testId[8],
  isData: true
}, {//testId[11]
  title: 'Gender',
  dataIndex: 'gender',
  key: 'gender',
  width: 80,
  type: "select",
  id: testId[11],
  parentId: "",
  isData: true
}, {//testId[12]
  title: 'Time',
  dataIndex: 'time',
  key: 'Time',
  width: 480,
  type: "date",
  id: testId[12],
  parentId: "",
  isData: true
}];
// H3Test
const buildColumnsNew = (columns, id) => {
  // console.log(columns);
  let topColumns = columns ? columns.filter(a => a.parentId === id) : [];

  return topColumns.length ? topColumns.map((a, i) => {
      let { isData, ...other } = a;
      // console.log(other);
      return !isData ? <ColumnGroup key={i} {...other}>
          {buildColumnsNew(columns, a.id)}
      </ColumnGroup> :
          <Column key={i} {...other}></Column>
  }) : []
}
const _initFixedColumns = (columns, x) => {
  let leftFixedItem = [], rightFixedItem = [];
  let isTop = columns.filter(item => item.parentId === "");
  let notTop = columns.filter(item => item.parentId !== "");
  for (let i = 0; i < isTop.length; i++) {
      let item = isTop[i];
      switch (item.freezeType) {
          case "1":
              item.fixed = x === "100%" ? null : "left";
              leftFixedItem = leftFixedItem.concat(isTop.splice(i, 1));
              i--;
              break;
          case "2":
              item.fixed = x === "100%" ? null : "right";
              rightFixedItem = rightFixedItem.concat(isTop.splice(i, 1));
              i--;
              break;
      }
  }
  return [...leftFixedItem, ...isTop, ...notTop, ...rightFixedItem];
}
class H3Test extends React.Component{
  render(){
    return (
      <Table dataSource={tableData} scroll={{ x: "120%",y:400 }} bordered={true}
      onRow={(record)=>{
        return {
          onMouseEnter:(event)=>{console.log(event,record);}
        }
      }}
      >
        {
            buildColumnsNew(_initFixedColumns(newColumns,"120%"),"")
        }
    </Table>
    )
  }
}
export default H1Test;