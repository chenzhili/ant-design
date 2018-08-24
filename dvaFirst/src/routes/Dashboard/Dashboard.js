import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types'
import { Row, Col, Layout, Menu, Icon, Form, Input } from "antd";
import styles from "./Dashboard.less";
import logo from "./logo.svg"
import nprogress from "nprogress";

import ChildSchool from "../../components/immutable/ChildSchool";
import ChildHome from "../../components/immutable/ChildHome";
import InnerChildSchool from "../../components/immutable/InnerChildSchool";
import update from 'immutability-helper';

const { Header, Sider, Content, Footer } = Layout;
const FormItem = Form.Item;
class Dashboard extends React.Component {
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

function T(props) {
  return (
    <div onClick={() => { props.toTest(3) }}>点我状态提升</div>
  );
}

export default connect((obj) => {
  console.log(obj);
  return obj;
})(Dashboard);

