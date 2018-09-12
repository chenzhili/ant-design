import React, { Component } from "react"
import { Table, Switch, Input, Button, Popconfirm, Form, Select } from "antd";
import styles from "./table.css";

const Option = Select.Option;
const FormItem = Form.Item;
const EditableContext = React.createContext();
// context 就是 不用在像 state和props这种 每层传值，可以 跨阶 传值
//这里是得到 Context对象,方法里 传入值 是指 默认值的意思

const EditableRow = ({ form, index, ...props }) => {
    // console.log("EditableRow", form);
    // console.log("EditableRow", index);
    // console.log("EditableRow", props);
    // form 是由 Form.create() 高阶函数加上去的 属性
    return (
        <EditableContext.Provider value={form}>
            <tr {...props} />
        </EditableContext.Provider>
    )
};

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends Component {
    state = {
        editing: false,
    }

    componentDidMount() {
        if (this.props.editable) {
            document.addEventListener('click', this.handleClickOutside, true);
        }
    }

    componentWillUnmount() {
        if (this.props.editable) {
            document.removeEventListener('click', this.handleClickOutside, true);
        }
    }

    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
                this.input.focus();
            }
        });
    }

    handleClickOutside = (e) => {
        const { editing } = this.state;
        if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
            this.save();
        }
    }

    save = () => {
        const { record, handleSave } = this.props;
        this.form.validateFields((error, values) => {
            if (error) {
                return;
            }
            this.toggleEdit();
            handleSave({ ...record, ...values });
        });
    }

    render() {
        console.log("EditableCell", this.props);
        const { editing } = this.state;
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            ...restProps
        } = this.props;
        return (
            <td ref={node => (this.cell = node)} {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>
                        {(form) => {
                            this.form = form;
                            return (
                                editing ? (
                                    <FormItem style={{ margin: 0 }}>
                                        {form.getFieldDecorator(dataIndex, {
                                            rules: [{
                                                required: true,
                                                message: `${title} is required.`,
                                            }],
                                            initialValue: record[dataIndex],
                                        })(
                                            <Input
                                                ref={node => (this.input = node)}
                                                onPressEnter={this.save}
                                            />
                                        )}
                                    </FormItem>
                                ) : (
                                        <div
                                            className={styles["editable-cell-value-wrap"]}
                                            style={{ paddingRight: 24 }}
                                            onClick={this.toggleEdit}
                                        >
                                            {restProps.children}
                                        </div>
                                    )
                            );
                        }}
                    </EditableContext.Consumer>
                ) : restProps.children}
            </td>
        );
    }
}

class A extends Component {
    constructor(props) {
        super(props);
        this.columns = [{
            title: 'name',
            dataIndex: 'name',
            width: '30%',
            editable: true,
        }, {
            title: 'age',
            dataIndex: 'age',
        }, {
            title: 'address',
            dataIndex: 'address',
        }, {
            title: 'operation',
            dataIndex: 'operation',
            render: (text, record) => {
                return (
                    this.state.dataSource.length >= 1
                        ? (
                            <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                                <a href="javascript:;">Delete</a>
                            </Popconfirm>
                        ) : null
                );
            },
        }];

        this.state = {
            dataSource: [{
                key: '0',
                name: 'Edward King 0',
                age: '32',
                address: 'London, Park Lane no. 0',
            }, {
                key: '1',
                name: 'Edward King 1',
                age: '32',
                address: 'London, Park Lane no. 1',
            }],
            count: 2,
        };
    }

    handleDelete = (key) => {
        const dataSource = [...this.state.dataSource];
        this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
    }

    handleAdd = () => {
        const { count, dataSource } = this.state;
        const newData = {
            key: count,
            name: `Edward King ${count}`,
            age: 32,
            address: `London, Park Lane no. ${count}`,
        };
        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1,
        });
    }

    handleSave = (row) => {
        const newData = [...this.state.dataSource];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        this.setState({ dataSource: newData });
    }

    render() {
        const { dataSource } = this.state;
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });
        return (
            <div>
                <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                    Add a row
                </Button>
                <Table
                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                />
            </div>
        );
    }
}

class TestRow extends Component {
    render() {
        // console.log(this.props);
        return (
            <EditableContext.Provider value={"test"}>
                <tr>
                    {this.props.children}
                </tr>
            </EditableContext.Provider>
        );
    }
}
class TestCell extends Component {
    render() {
        // console.log(this.props);
        let { index } = this.props;
        return (
            <td>
                {
                    index == 0 ? (
                        <EditableContext.Consumer>
                            {
                                (test) => {
                                    return (
                                        <Select style={{ width: "100%" }} defaultValue={1} dropdownMatchSelectWidth={false}>
                                            <Option value={1}>aaaaaaaaaaaaaaaaaa</Option>
                                        </Select>
                                    )
                                }
                            }
                        </EditableContext.Consumer>
                    ):this.props.children
                }
            </td >
        )
    }
}

class TestTable extends Component {
    render() {
        let dataSource = [{
            key: '0',
            name: 'Edward King 0',
            age: '32',
            address: 'London, Park Lane no. 0',
        }, {
            key: '1',
            name: 'Edward King 1',
            age: '32',
            address: 'London, Park Lane no. 1',
        }],
            columns = [{
                title: 'name',
                dataIndex: 'name',
                width: "100px",
                editable: true,
            }, {
                title: 'age',
                dataIndex: 'age',
                width: "400",
            }, {
                title: 'address',
                dataIndex: 'address',
                width: "500",
            }, {
                title: 'operation',
                dataIndex: 'operation',
                width: "500px",
            }],
            components = {
                body: {
                    row: TestRow,
                    cell: TestCell
                }
            }
        columns = columns.map(v => (
            {
                ...v,
                onCell: record => ({
                    record,
                    index: record["key"]
                })
            }
        ));
        return (
            <Table
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                scroll={{ x:"130%"}}
                dataSource={dataSource}
                columns={columns}
            />
        );
    }
}

export default TestTable;