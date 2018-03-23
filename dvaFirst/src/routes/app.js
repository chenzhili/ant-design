import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types'
import {Row,Col,Layout,Menu,Icon} from "antd";
import styles from "./app.less";
import logo from "./Dashboard/logo.svg"
import nprogress from "nprogress";

const {Header,Sider,Content,Footer} = Layout;
// const Dashboard = (props)=>{
//   return (
//     //   栅格布局
//       <div>
//           <Row gutter={16}>
//           <Col className={styles.test} span={8}>col-8</Col>
//           <Col className={styles.test} span={8} >col-8</Col>
//           </Row>
//           <Row>
//           <Col className={styles.test} span={6} offset={6}>col-6 col-offset-6</Col>
//           <Col className={styles.test} span={6} offset={6}>col-6 col-offset-6</Col>
//           </Row>
//           <Row>
//           <Col className={styles.test} span={12} offset={6}>col-12 col-offset-6</Col>
//           </Row>
//       </div>
//   )
// };
// 需要内部的 state的状态，不用纯函数
class App extends React.Component{
    state = {
        collapsed: false,
      };
      toggle = () => {
        this.setState({
          collapsed: !this.state.collapsed,
        });
      }
      navClicked = ({item,key,keyPath})=>{
        const {dispatch,Dashboard} = this.props;
        console.log(Dashboard);
        nprogress.start();
        setTimeout(()=>{
          console.log(1);
          nprogress.done();
        },1000);
        dispatch({type:"Dashboard/testMenu",playload:key});
      }
      componentDidMount(){
          console.log(this.props);
      }
      render() {
        const children = this.props.children;
        console.log(window.location.href);
        const menuList = [
          {type:"user",value:"nav 1"},
          {type:"video-camera",value:"nav 2"},
          {type:"upload",value:"nav 3"}
        ];
        return (
          <div>  {/**这种用 children 的写法不是**/}
            测试路由的嵌套
            <div>{children}</div>
          </div>
        );
      }
}
export default connect(({app})=>{
  return {app}
})(App);

