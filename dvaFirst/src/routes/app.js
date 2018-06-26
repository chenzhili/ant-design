import React from 'react';
import { connect } from 'dva';
// import PropTypes from 'prop-types'
import {Row,Col,Layout,Menu,Icon} from "antd";
import styles from "./app.less";
import logo from "./Dashboard/logo.svg"
import nprogress from "nprogress";
import { Router, Route, Switch,Redirect } from 'dva/router';

import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

//添加组件
import Dashboard from "./Dashboard/Dashboard";
import PackageH1 from "./PackageH1/PackageH1"
import Dnd from "./Dnd/Dnd";
import DndAgain from "./DndAgain/DndAgain";
import Sourt from "./sourt/sourt";

const {Header,Sider,Content,Footer} = Layout;
/* const Dashboard = (props)=>{
  return (
    //   栅格布局
      <div>
          <Row gutter={16}>
          <Col className={styles.test} span={8}>col-8</Col>
          <Col className={styles.test} span={8} >col-8</Col>
          </Row>
          <Row>
          <Col className={styles.test} span={6} offset={6}>col-6 col-offset-6</Col>
          <Col className={styles.test} span={6} offset={6}>col-6 col-offset-6</Col>
          </Row>
          <Row>
          <Col className={styles.test} span={12} offset={6}>col-12 col-offset-6</Col>
          </Row>
      </div>
  )
}; */
//需要内部的 state的状态，不用纯函数
/* class App extends React.Component{
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
          <div>  //这种用 children 的写法不是
            测试路由的嵌套
            <div>{children}</div>
          </div>
        );
      }
} */
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
      nprogress.start();
      setTimeout(()=>{
        nprogress.done();
        this.props.dispatch({type:"app/child",playload:key});
        // switch(key){
        //   case 0:
        //   dispatch({type:"app/dashboard",playload:key});
        //   break;
        //   case 1:
        //   dispatch({type:"Dashboard/testMenu",playload:key});
        //   break;
        //   case 2:
        //   dispatch({type:"Dashboard/testMenu",playload:key});
        // }
      },1000);
      // dispatch({type:"Dashboard/testMenu",playload:key});
    }
    componentDidMount(){
      console.log(this.props.match);
    }
    render() {
      console.log(window.location.href);
      const menuList = [
        {type:"user",value:"nav 1"},
        {type:"video-camera",value:"nav 2"},
        {type:"upload",value:"nav 3"},
        {type:"work-again",value:"nav 4"},
        {type:"sourt",value:"nav 5"},
      ];
      return (
        <Layout className={styles.layout}>
          <Sider
            trigger={null}
            collapsible
            collapsed={this.state.collapsed}
          >
            <div className={styles.logo}>
              <img src={logo}/>
              <span className={this.state.collapsed?`${styles["text-is-show"]}`:""}>ANTD ADMIN</span>
            </div>
            <Menu className={styles.menu} theme="light" mode="inline" defaultSelectedKeys={['1']} onClick={this.navClicked}>
            {menuList.map((v,i)=>(
              <Menu.Item key={i} onClick={this.navClicked}>
                <Icon type={v.type}/>
                <span>{v.value}</span>
              </Menu.Item>
            ))}
            </Menu>
          </Sider>
          <Layout>
            <Header style={{ background: '#fff', padding: 0,display:"flex",alignItems:"center" }}>
              <div className={styles.hover} style={{flex:"0 1 10%",textAlign:"center"}}>
              <Icon
                className={styles.trigger}
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggle}
              />
              </div>
              <div style={{flex:"0 1 30%",justifyContent:"end",display:"flex",alignItems:"center",marginLeft:"60%"}}>
                <div className={styles.hover} style={{flex:"0 1 50%",textAlign:"center"}}>
                <Icon type="mail" style={{}}/>
                </div>
                <div className={styles.hover} style={{flex:"0 1 50%",textAlign:"center"}}>
                  <Icon type="user"/>
                  guest
                </div>
              </div>
            </Header>

            <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
                <Switch>
                  <Route path={this.props.match.path} exact render={()=><Redirect to={`${this.props.match.path}/dashboard`}/>}/>
                  <Route path={`${this.props.match.path}/dashboard`} component={Dashboard}/>
                  <Route path={`${this.props.match.path}/h1`} component={PackageH1}/>
                  <Route path={`${this.props.match.path}/dnd`} component={Dnd}/>
                  <Route path={`${this.props.match.path}/again`} component={DndAgain}/>
                  <Route path={`${this.props.match.path}/sort`} component={Sourt}/>
                </Switch>
            </Content>

            <Footer style={{ margin: '24px 16px', padding:'0 24', background: '#fff', minHeight: 60 }}>
                Footer
            </Footer>
          </Layout>
        </Layout>
      );
    }
}
export default DragDropContext(HTML5Backend)(connect(({app})=>{
  return {app}
})(App));

