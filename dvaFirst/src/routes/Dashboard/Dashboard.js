import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types'
import { Row, Col, Layout, Menu, Icon, Form, Input,Tree  } from "antd";
import styles from "./Dashboard.less";
import logo from "./logo.svg"
import nprogress from "nprogress";

import ChildSchool from "../../components/immutable/ChildSchool";
import ChildHome from "../../components/immutable/ChildHome";
import InnerChildSchool from "../../components/immutable/InnerChildSchool";
import update from 'immutability-helper';

const { Header, Sider, Content, Footer } = Layout;
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
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
class Dashboard extends React.Component {
  state = {
    gData,
    expandedKeys: ['0-0', '0-0-0', '0-0-0-0'],
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
    return (
      <Tree
        className="draggable-tree"
        // defaultExpandedKeys={this.state.expandedKeys}
        draggable
        onDragEnter={this.onDragEnter}
        onDrop={this.onDrop}
      >
        {loop(this.state.gData)}
      </Tree>
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

