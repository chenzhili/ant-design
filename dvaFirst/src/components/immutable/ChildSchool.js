 import React from "react";
  const Immutable = require('immutable')
export default class ChildSchool extends React.Component{
  /**
   * 判断组件是否需要更新,因为传入我们组件的props本身就是immutable对象，所以可以直接通过is来判断
   * Immutable.is 比较的是两个对象的 hashCode 或 valueOf（对于 JavaScript 对象）。由于 immutable 内部使用了 Trie 数据结构来存储，只要两个对象的 hashCode 相等，值就是一样的。这样的算法避免了深度遍历比较，性能非常好。
   * @param  {Object} nextProps [description]
   * @param  {Object} nextState [description]
   * @return {[type]}           [description]
   */
  shouldComponentUpdate(nextProps = {}, nextState = {}) {
    // 只能说，用 immutability-helper的update函数后，可以让这个数据结构，可以用Immutable插件的 is 函数 进行 ，hasCode的判断
    // console.log(Immutable.is(this.props.information, nextProps.information));
    // let information1 = Immutable.fromJS(this.props.information);
    // let information2 = Immutable.fromJS(nextProps.information);
    // console.log(Immutable.is(information1, information2));
    // console.log(information1===information2);

    // let test1 = {a:1,b:2,c:{d:2}};
    // let test2 = {a:1,b:2,c:{d:2}};
    // console.log("js",Immutable.is(test1,test2));
    // console.log("immutable",Immutable.is(Immutable.fromJS(test1),Immutable.fromJS(test2)));

    if (!Immutable.is(this.props.information, nextProps.information)) {
        return true;
    }
    if (!Immutable.is(this.state, nextState)) {
        return true;
    }
    return false;
 }
componentWillReceiveProps(nextProps){
  console.log("equal",nextProps == this.props);

}
   render(){
      console.log('ChildSchool组件被重新渲染');
      console.log(this.props);
     return (
        <div>
           <div>{this.props.information.location}</div>
           <div>{this.props.information.ratio.ZheJiang}</div>
          ChildSchool
        </div>
      )
   }
 }


