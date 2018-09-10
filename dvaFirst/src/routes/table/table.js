import { Component } from "react"
import { Table,Switch } from "antd";

const columns = [{
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 100,
    fixed: 'left',
    filters: [{
        text: 'Joe',
        value: 'Joe',
    }, {
        text: 'John',
        value: 'John',
    }],
    onFilter: (value, record) => record.name.indexOf(value) === 0,
}, {
    title: 'Other',
    children: [{
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        width: 200,
        sorter: (a, b) => a.age - b.age,
    }, {
        title: 'Address',
        children: [{
            title: 'Street',
            dataIndex: 'street',
            key: 'street',
            width: 200,
        }, {
            title: 'Block',
            children: [{
                title: 'Building',
                dataIndex: 'building',
                key: 'building',
                width: 100,
            }, {
                title: 'Door No.',
                dataIndex: 'number',
                key: 'number',
                width: 100,
            }],
        }],
    }],
}, {
    title: 'Company',
    children: [{
        title: 'Company Address',
        dataIndex: 'companyAddress',
        key: 'companyAddress',
    }, {
        title: 'Company Name',
        dataIndex: 'companyName',
        key: 'companyName',
    }],
}, {
    title: 'Gender',
    dataIndex: 'gender',
    key: 'gender',
    width: 80,
    fixed: 'right',
}];

const data = [];
for (let i = 0; i < 100; i++) {
    data.push({
        key: i,
        name: 'John Brown',
        age: i + 1,
        street: 'Lake Park',
        building: 'C',
        number: 2035,
        companyAddress: 'Lake Street 42',
        companyName: 'SoftLake Co',
        gender: 'M',
    });
}

class TestTable extends Component {
    constructor(){
        super();
        this.state = {
            isShow:false
        }
    }
    render() {
        return (
            <div>
                <Switch onChange={e=>{console.log(e);this.setState({
                    isShow:e
                })}}/>
                <Table
                columns={columns}
                dataSource={data}
                bordered
                size="middle"
                rowSelection={this.state.isShow && {
                    onchange:function(){console.log("变化");},
                    onSelect:function(...data){console.log(data);},
                    onSelectAll:function(...data){console.log(data);},
                    onSelectInvert:function(...data){console.log(data);}
                }}
                pagination={{
                    pagination:"bottom"
                }}
                scroll={{ x: "130%", y: 200 }} //折算数字的宽度，来计算width
                
            />
            </div>
        );
    }
}

export default TestTable;