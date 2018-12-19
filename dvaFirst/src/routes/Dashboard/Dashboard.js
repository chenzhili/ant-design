import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types'
import { Row, Col, Layout, Menu, Icon, Form, Input, Tree, Table, Divider, Tag,Button } from "antd";
import styles from "./Dashboard.less";
import logo from "./logo.svg"
import nprogress from "nprogress";
import {Guid} from "../../utils/com"

import ChildSchool from "../../components/immutable/ChildSchool";
import ChildHome from "../../components/immutable/ChildHome";
import InnerChildSchool from "../../components/immutable/InnerChildSchool";
import update from 'immutability-helper';

const { Header, Sider, Content, Footer } = Layout;
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
const { Column, ColumnGroup } = Table;

class A extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
  }
  state = {
    information: {
      a: 1,
      b: 2,
      c: 3,
      //将传入ChildHome组件
      home: {
        location: {
          name: 'Hunan huaihua',
          street: 405
        }
      },
      //将传入到ChildSchool组件
      school: {
        location: "DaLian",
        name: "DLUT",
        ratio: {
          Hunan: 698,
          ZheJiang: 900
        }
      }
    },
    test: 1
  }
  // 变量提升
  toTest(a) {
    this.setState({
      toTest: a
    });
  }

  /**
   * 修改school，此时我们的this.state.school部分已经发生改变了
   * @return {[type]} [description]
   */
  changeSchool = () => {
    this.setState(update(this.state, {
      information: {
        school: {
          ratio: {
            ZheJiang: {
              $set: 901
            }
          }
        }
      }
    }))
  }

  /**
   * 修改Home，但是当你点击一次以后再次点击那么我们的this.state是不会发生改变的，这一点一定要注意
   * @return {[type]} [description]
   */
  changeHome = () => {
    this.setState(update(this.state,
      {
        information: {
          home: {
            location: {
              street: {
                $set: 406
              }
            }
          }
        }
      }))
  }
  /**
   * 此时你必须弄清楚，我们传入到ChildSchool，ChildHome组件的information值和该Parent组件
   * 是引用共享的
   * @return {[type]} [description]
   */
  render() {
    console.log("编码");
    return (
      <div>
        {/*通过changeSchool导致state.school发生改变，从而ChildSchool和InnerChildSchool都会重新渲染
            这也就是说，当你修改了ratio.ZheJiang后，那么ratio/school部分都会重新渲染，但是Home不会!!
            因为home的数据都没有发生改变!!!!
           */}
        <ChildSchool information={this.state.information.school}>
          <InnerChildSchool information={this.state.information.school.ratio} />
        </ChildSchool>
        <ChildHome information={this.state.information.home} />
        <button onClick={this.changeSchool}>点击我修改School的值</button>
        <button onClick={this.changeHome}>点击我修改home的值</button>
        <button onClick={() => { this.props.history.push("/app/dashboard"); }}>push相同的路由</button>
        <T toTest={this.toTest.bind(this)} />
        <Form>
          <FormItem validateStatus="error" help="Should be combination of numbers & alphabets" hasFeedback>
            <Input />
          </FormItem>
        </Form>
      </div>
    )
  }
}
function mapTree(key, treeData) {
  let tempArr = [];
  treeData.forEach((v, i) => {
    if (v["key"] === key) {
      tempArr.push({ key, title: v["title"] });
    }
    if (v["key"] !== key && v["children"] && v["children"].length) {
      tempArr = tempArr.concat(mapTree(key, v["children"]));
    }
  });
  return tempArr;
}
function generateParts(selectedKeys, treeData) {
  let resultArr = [];
  selectedKeys.forEach((v, i) => {
    resultArr = resultArr.concat(mapTree(v, treeData));
  })
  return resultArr;
}

/* 树形结构 */
const x = 3;
const y = 2;
const z = 1;
const gData = [];

const generateData = (_level, _preKey, _tns) => {
  const preKey = _preKey || '0';
  const tns = _tns || gData;

  const children = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({ title: key, key });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};
generateData(z);

console.log(gData);
class DashboardTest extends React.Component {
  state = {
    gData,
    expandedKeys: ['0-0', '0-0-0', '0-0-0-0'],
    selectedKeys: ['0-0', '0-0-0']
  }

  onDragEnter = (info) => {
    // console.log(info);
    // expandedKeys 需要受控时设置
    // this.setState({
    //   expandedKeys: info.expandedKeys,
    // });
  }

  onDrop = (info) => {
    console.log(info);
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    // console.log("dropKey",dropKey);
    // console.log("dragKey",dragKey);
    // console.log("dropPos",dropPos);
    // console.log("dropPosition",dropPosition);
    // const dragNodesKeys = info.dragNodesKeys;
    const loop = (data, key, callback) => {
      data.forEach((item, index, arr) => {
        if (item.key === key) {
          return callback(item, index, arr);
        }
        if (item.children) {
          return loop(item.children, key, callback);
        }
      });
    };
    const data = [...this.state.gData];
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      console.log(data === arr);
      arr.splice(index, 1);
      dragObj = item;
    });
    console.log(data);
    if (info.dropToGap) {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    } else {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到尾部，可以是随意位置
        item.children.push(dragObj);
      });
    }
    this.setState({
      gData: data,
    });
  }

  render() {
    const loop = data => data.map((item) => {
      if (item.children && item.children.length) {
        return <TreeNode key={item.key} title={item.title}>{loop(item.children)}</TreeNode>;
      }
      return <TreeNode key={item.key} title={item.title} />;
    });
    let dataArr = generateParts(this.state.selectedKeys, gData);
    console.log(dataArr);
    console.log("重新渲染");
    return (
      <div>
        <Tree
          className="draggable-tree"
          multiple={true}
          // defaultExpandedKeys={this.state.expandedKeys}
          draggable
          onDragEnter={this.onDragEnter}
          onSelect={(key, e) => {
            let tempArr = [];
            e["selectedNodes"].forEach(v => {
              tempArr.push(v["key"]);
            });
            this.setState({
              selectedKeys: tempArr
            });
          }}
          onDrop={this.onDrop}
          selectedKeys={[...this.state.selectedKeys]}
        >
          {loop(this.state.gData)}
        </Tree>
        {
          dataArr.map((v, i) => (
            <div key={i} onClick={() => {
              let { selectedKeys } = this.state;
              for (let i = 0; i < selectedKeys.length; i++) {
                let item = selectedKeys[i];
                if (item === v["key"]) {
                  selectedKeys.splice(i, 1);
                  break;
                }
              }
              console.log(selectedKeys);
              this.setState({ selectedKeys });
            }}>{v["title"]}</div>
          ))
        }
      </div>
    );
  }
}





// 生成 对应的 表头 
function generateColumn(columnsNotLast,ParentCom){
  if(!columnsNotLast || !columnsNotLast.length)return;
  let comp = function({valueObj,Com}){
    return function(){
      return <Com {...valueObj}></Com>
    }
  }
  let nestCom = function({CurrentCom,ParentCom}){
    if(ParentCom){
      return function(){
        return (
          <ParentCom>
          <CurrentCom></CurrentCom>
        </ParentCom>
        )
      }
    }
    return function(){
      (<CurrentCom></CurrentCom>)
    }
  }
  let express;
  // columnsNotLast.forEach((v,i)=>{
    let v = columnsNotLast[0];
    if(!v["notRender"]){
      let tempObj = {title:v["title"],id:v["id"]};
      express = nestCom({CurrentCom:comp({valueObj:tempObj,Com:D}),ParentCom});
      console.log(express);
      if(v["children"] && v["children"].length){
        generateColumn(v["children"],express);
      }
    }
  // });
  return express;
}
function D(props){
  return(
    <div>
      {props.children}
    </div>
  )
}
function F(){
  return (
    <p>aaaa</p>
  )
}
let comp = function({valueObj,Com}){
  return <Com/>
}
let nestCom = function({CurrentCom,ParentCom}){
  if(ParentCom){
      return (
        <ParentCom>
        <CurrentCom></CurrentCom>
      </ParentCom>
      )
    }
  return (<CurrentCom></CurrentCom>)
}

// const All = nestCom({CurrentCom:comp({Com:F}),ParentCom});
// console.log("all",All);

const data = [{
  key: '1',
  firstName: 'John',
  lastName: 'Brown',
  age: 32,
  test:1,
  address: 'New York No. 1 Lake Park',
  tags: ['nice', 'developer'],
}, {
  key: '2',
  firstName: 'Jim',
  lastName: 'Green',
  test:1,
  age: 42,
  address: 'London No. 1 Lake Park',
  tags: ['loser'],
}, {
  key: '3',
  firstName: 'Joe',
  test:1,
  lastName: 'Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
  tags: ['cool', 'teacher'],
}];

let comId = [Guid(),Guid(),Guid(),Guid(),Guid(),Guid()];
var columnsChildren = [
  {
    name:"字段1",
    dataIndex:comId[0],
    key:comId[0]
  },
  {
    name:"字段2",
    dataIndex:comId[1],
    key:comId[1]
  },
  {
    name:"字段3",
    dataIndex:comId[2],
    key:comId[2]
  },
  {
    name:"字段4",
    dataIndex:comId[3],
    key:comId[3]
  },
  {
    name:"字段5",
    dataIndex:comId[4],
    key:comId[4]
  },
  {
    name:"字段6",
    dataIndex:comId[5],
    key:comId[5]
  },
];
const  columnsNotLast = [ //保存 除了 最后的层 的 表头 数据
  {
      title:"a1",
      id:Guid(),
      children:[
          {title:"a11",id:Guid(),children:[
            {id:comId[0]},{id:comId[5]}
          ]},
          {title:"a12",id:Guid(),children:[
            {id:comId[1]}
          ]},
      ]
  },
  {
      title:"",
      id:Guid(),
      notRender:true,
      children:[
        {id:comId[2]}
      ]
  },
  {
    title:"c1",
    id:Guid(),
    children:[
      {title:"c11",id:Guid(),children:[
        {
          title:"c111",id:Guid(),children:[
            {id:comId[3]}
          ]
        }
      ]},
      {
        title:"c21",id:Guid(),children:[
          {id:comId[4]}
        ]
      }
    ]
  }
];
// 处理 成整个 表头的 方法
function dealColumns(columnsNotLast,columnsChildren){
  if(!columnsNotLast || !columnsNotLast.length)return;
  columnsNotLast.forEach(v=>{
    if(!v["children"] || !v["children"].length){
      for(let i=0,l=columnsChildren.length;i<l;i++){
        let item = columnsChildren[i];
        if(item["key"] === v["id"]){
          v = {...v,...item};
          break;
        }
      }
    }else{
      dealColumns(v["children"],columnsChildren)
    }
  });
  console.log(columnsNotLast);
}
dealColumns(columnsNotLast,columnsChildren);
// console.log(columnsNotLast);
class Dashboard extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let aa = function(columnsNotLast){
      return columnsNotLast.map(v=>{
        if(!v["notRender"]){
          let Com = !v["isLast"]?ColumnGroup:Column;
          // let propsObj = !v["isLast"]?{title:v["title"],id:v["id"]}:{...v}
          return (<Com key={v["id"]} {...v}>
          {
            (()=>{
              if(v["children"] && v["children"].length){
                return aa(v["children"])
              }
            })()
          }
        </Com>)
        }
      });
    }
    console.log(aa(columnsNotLast));
    /* let test = columnsNotLast.map(v=>{
      return (
        <ColumnGroup key={v["id"]} title={v["title"]}>
          {
            (()=>{
              if(v["children"] && v["children"].length){
                return v["children"].map(item=>(
                  <ColumnGroup key={v["id"]} title={item["title"]}></ColumnGroup>
                ))
              }
            })()
          }
        </ColumnGroup>
      );
    });
    console.log(test); */
    return (
        <div>
          
        </div>
      // {/* <Table dataSource={data} bordered={true}>
      //   <ColumnGroup title="test">
      //     <Column
      //       title="test"
      //       dataIndex="test"
      //       key="test"
      //     />
      //     <ColumnGroup title="Name">
      //       <Column
      //         title="First Name"
      //         dataIndex="firstName"
      //         key="firstName"
      //       />

      //     </ColumnGroup>
      //     <ColumnGroup title="哦哦">
      //       <Column
      //         title="Last Name"
      //         dataIndex="lastName"
      //         key="lastName"
      //       />
      //     </ColumnGroup>
      //   </ColumnGroup>
      //   <Column
      //     title="Age"
      //     dataIndex="age"
      //     key="age"
      //   />
      //   <Column
      //     title="Address"
      //     dataIndex="address"
      //     key="address"
      //   />
      //   <Column
      //     title="Tags"
      //     dataIndex="tags"
      //     key="tags"
      //     render={tags => (
      //       <span>
      //         {tags.map(tag => <Tag color="blue" key={tag}>{tag}</Tag>)}
      //       </span>
      //     )}
      //   />
      //   <Column
      //     title="Action"
      //     key="action"
      //     render={(text, record) => (
      //       <span>
      //         <a href="javascript:;">Invite {record.lastName}</a>
      //         <Divider type="vertical" />
      //         <a href="javascript:;">Delete</a>
      //       </span>
      //     )}
      //   />
      // </Table> */}
    );
  }
}

function T(props) {
  return (
    <div onClick={() => { props.toTest(3) }}>点我状态提升</div>
  );
}

export default connect((obj) => {
  console.log(obj);
  return obj;
})(Dashboard);

