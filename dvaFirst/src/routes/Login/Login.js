import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types'
import styles from './Login.less';
import {Form,Icon,Input,Button,Checkbox} from "antd";

const FormItem = Form.Item;
const Login = ({
  Login,
  dispatch,
  state,
  form:{
    getFieldDecorator,
    validateFieldsAndScroll,
  }
  // 对象的结构
})=>{
  function handleSubmit(){
    validateFieldsAndScroll((err,values)=>{
      if(err){
        console.log("出错了"); 
        return;
      }
      dispatch({type:"Login/Login",playload:values});
    })
  }
  let tempTest = Login.name;
  return (
    
    <div className={`login-form ${styles.container}`} style={stylesSpecial.forItem}>
      <FormItem hasFeedback style={stylesSpecial.forItem}>
        {getFieldDecorator("username",{
          rules:[
            {
              required:true,
              message:"请输入正确的用户名"
            }
          ]
        })(
          <Input className={styles["form-item"]} type="text" placeholder="Username" />
        )}
      </FormItem>
      <FormItem hasFeedback style={stylesSpecial.forItem}>
      {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                min:1,
                max:12,
                // pattern:/(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?]{7,20}$/,
                message:"请输入6到12位的数字加字母或者特殊字符"
              },
            ],
          })(<Input className={styles["form-item"]} type="password" onPressEnter={handleSubmit} placeholder="password" />)}
      </FormItem>
      <Button type="primary" style={stylesSpecial.btn} onClick={handleSubmit} loading={Login.isloading}>
          sign in
      </Button>
    {/* <FormItem>
      {getFieldDecorator('userName', {
        rules: [{ required: true, message: '测试的值'}],
      })(
        <Input onPressEnter={handleSubmit} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
      )}
    </FormItem>
    <FormItem>
      {getFieldDecorator('password', {
        rules: [{ required: true, message: 'Please input your Password!' }],
      })(
        <Input onPressEnter={handleSubmit} prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
      )}
    </FormItem>
    <FormItem>
      {getFieldDecorator('remember', {
        valuePropName: 'checked',
        initialValue: true,
      })(
        <Checkbox>Remember me</Checkbox>
      )}
      <a className="login-form-forgot" href="">Forgot password</a>
      <Button type="primary" htmlType="submit" className="login-form-button" onClick={handleSubmit}> 
        {tempTest}
      </Button>
      Or <a href="">register now!</a>
    </FormItem> */}
  </div>
  );
}

const stylesSpecial = {
  forItem:{
    textAlign:"center"
  },
  btn:{
    width:"70%",
  }
}

Login.propTypes = {
  name:PropTypes.string,
  dispatch:PropTypes.func,
  form:PropTypes.object
};

export default connect(({Login})=>{
  return {Login}
})(Form.create()(Login));
{/**
Form.create()(IndexPage)相当于是把 form这个组建的 props也放到了 IndexPage 组建，所以 存在 form 属性
**/}