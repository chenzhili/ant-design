import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types'
import {Row,Col,Layout,Menu,Icon} from "antd";
import styles from "./Dashboard.less";
import logo from "./logo.svg"
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
class Dashboard extends React.Component{
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
      componentDidMount(){}
      render() {
        console.log(window.location.href);
        const menuList = [
          {type:"user",value:"nav 1"},
          {type:"video-camera",value:"nav 2"},
          {type:"upload",value:"nav 3"}
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
                {/* <Menu.Item key="1">
                  <Icon type="user" />
                  <span>nav 1</span>
                </Menu.Item>
                <Menu.Item key="2">
                  <Icon type="video-camera" />
                  <span>nav 2</span>
                </Menu.Item>
                <Menu.Item key="3">
                  <Icon type="upload" />
                  <span>nav 3</span>
                </Menu.Item> */}
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
                Content
              </Content>
              <Footer style={{ margin: '24px 16px', padding:'0 24', background: '#fff', minHeight: 60 }}>
                  Footer
              </Footer>
            </Layout>
          </Layout>
        );
      }
}
export default connect((obj)=>{
  console.log(obj);
  return obj;
})(Dashboard);

