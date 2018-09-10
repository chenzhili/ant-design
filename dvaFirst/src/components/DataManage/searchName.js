import { Component } from "react"
import { CheckBox, Input, Icon, Checkbox } from "antd"
import { connect } from "dva";
import styles from "./searchName.less"

let time = null;

// 判断是否全选了
function judgeIsAll(arr) {
    for (let i = 0; i < arr.length; i++) {
        let v = arr[i];
        if (!v.isShow) {
            return false
        }
    }
    return true;
}

class SearchName extends Component {
    constructor(props) {
        super(props);
        let { columns, fieldNameArr } = this.props.dataManage;
        this.state = {
            fieldNameArr: [...fieldNameArr],
            isAll: judgeIsAll(fieldNameArr),
            isSearchAll: false
        }
    }
    // 全选
    selectAll(type, e) {
        let { dispatch } = this.props;
        dispatch({
            type: "dataManage/selectAll",
            payload: {
                isAll: e.target.checked,
                type,
                fieldNameArr:type==="isSearchAll"?this.state.fieldNameArr:[]
            }
        });
        this.setState({
            [type]: !this.state[type]
        });
    }
    // 搜索
    searchWord(e) {
        e.stopPropagation();
        let me = this;
        let currentValue = e.target.value, regExp = new RegExp(currentValue, "gi");
        let tempArr = [...this.props.dataManage.fieldNameArr];
        time && clearTimeout(time);
        time = setTimeout(() => {
            if (currentValue) {
                for (let i = 0; i < tempArr.length; i++) {
                    let v = tempArr[i];
                    if (!regExp.test(v["name"])) {
                        tempArr.splice(i, 1);
                        i--;
                    }
                }
                me.setState({
                    fieldNameArr: tempArr,
                    isSearchAll:judgeIsAll(tempArr)
                });
            } else {
                me.setState({
                    fieldNameArr: tempArr
                });
            }
        }, 300);
    }
    // 选择项
    selectItem(name, e) {
        let { dispatch } = this.props;
        dispatch({
            type: "dataManage/selectFieldItem",
            payload: {
                name
            }
        });
    }
    render() {
        let { fieldNameArr, isAll,isSearchAll } = this.state;
        return (
            <div className={styles.container}>
                <Input className={styles.searchInput} onChange={this.searchWord.bind(this)} style={{background:'url("./search.png") no-repeat 5px 6px',backgroundSize:"16px"}}/>
                <div className={styles.checkboxContainer}>
                    {
                        fieldNameArr.length == this.props.dataManage.fieldNameArr.length ? (<Checkbox checked={isAll} className={`${styles.checkBox} ${styles.allCheckBox}`} onChange={this.selectAll.bind(this, "isAll")}>全选</Checkbox>) : (
                            <Checkbox checked={isSearchAll} className={`${styles.checkBox} ${styles.allCheckBox}`} onChange={this.selectAll.bind(this, "isSearchAll")}>搜索结果全选</Checkbox>
                        )
                    }
                    <Checkbox className={`${styles.checkBox} ${styles.checkboxTitle}`}>标题</Checkbox>
                    {
                        fieldNameArr.map((v, i) => (
                            <Checkbox checked={v.isShow} key={i} className={styles.checkBox} onChange={this.selectItem.bind(this, v["name"])}>{v["name"]}</Checkbox>
                        ))
                    }
                    {
                        !fieldNameArr.length && <div className={styles.checkBox} style={{ textAlign: "center" }}>搜索暂无内容</div>
                    }
                </div>
            </div>
        );
    }
}

export default SearchName;