import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types'
import {Row,Col,Layout,Menu,Icon} from "antd";
import styles from "./Dashboard.less";
import logo from "./logo.svg"
import nprogress from "nprogress";

const {Header,Sider,Content,Footer} = Layout;
const Dashboard = (props)=>{
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
};
export default connect((obj)=>{
  console.log(obj);
  return obj;
})(Dashboard);

