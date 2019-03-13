import React from "react";
import { Table } from 'antd';
import { Resizable  } from 'react-resizable';
import styles from "./ResizeTable.less"


const ResizeableTitle = (props) => {
    console.log(props);
    const { onResize, width, ...restProps } = props;

    if (!width) {
        return <th {...restProps} />;
    }

    return (
        <Resizable width={width} height={0} onResize={onResize}>
            <th {...restProps} />
        </Resizable>
    );
};
const columns = [{
    title: 'Date',
    children:[
        {
            dataIndex: 'date',
            id:"date",
            title:"subData",
            width:200
        }
    ]
}, {
    id:"amount",
    title: 'Amount',
    dataIndex: 'amount',
    width: 100,
}, {
    id:"type",
    title: 'Type',
    dataIndex: 'type',
    width: 100,
}, {
    id:"note",
    title: 'Note',
    dataIndex: 'note',
    width: 100,
}, {
    id:"action",
    title: 'Action',
    key: 'action',
    render: () => (
        <a href="javascript:;">Delete</a>
    ),
}];
class ResizeTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns:columns
        }
    }
    
    handleResize = id=>(e,{size,...other})=>{
        console.log(e,size,other);
        const {columns} = this.state;
        let cycle = (columns)=>{
            columns.forEach(item=>{
                if(item["id"] === id){
                    item["width"] = size.width;
                }else{
                    if(item["children"] && item["children"].length){
                        cycle(item.children);
                    }
                }
            });
            return columns;
        }
        this.setState({
            columns:cycle(columns)
        });
        /* this.setState(({ columns }) => {
            const nextColumns = [...columns];
            nextColumns[index] = {
                ...nextColumns[index],
                width: size.width,
            };
            return { columns: nextColumns };
        }); */
    }
    /* handleResize = index => (e, { size }) => {
        this.setState(({ columns }) => {
            const nextColumns = [...columns];
            nextColumns[index] = {
                ...nextColumns[index],
                width: size.width,
            };
            return { columns: nextColumns };
        });
    }; */
    /* handleResize(index){
        return (e,{size})=>{
            this.setState(({ columns }) => {
                const nextColumns = [...columns];
                nextColumns[index] = {
                    ...nextColumns[index],
                    width: size.width,
                };
                return { columns: nextColumns };
            });
        }
    } */

    render() {
        const cycle = (columns)=>{
            columns.forEach((item,index)=>{
                item["onHeaderCell"] = column=>({
                    width: column.width,
                    onResize: this.handleResize(column.id),
                });
                if(item["children"] && item["children"].length){
                    cycle(item["children"]);
                }
            });
            return columns;
        }
        const columns = cycle(this.state.columns);/* this.state.columns.map((col, index) => ({
            ...col,
            onHeaderCell: column => {
                console.log(column);
                return ({
                    width: column.width,
                    onResize: this.handleResize(index),
                })
            },
        })); */
        const components = {
            header: {
                cell: ResizeableTitle,
            },
        };
    
        const data = [{
            key: 0,
            date: '2018-02-11',
            amount: 120,
            type: 'income',
            note: 'transfer',
        }, {
            key: 1,
            date: '2018-03-11',
            amount: 243,
            type: 'income',
            note: 'transfer',
        }, {
            key: 2,
            date: '2018-04-11',
            amount: 98,
            type: 'income',
            note: 'transfer',
        }];
        return (
            <Table
                bordered
                components={components}
                columns={columns}
                dataSource={data}
            />
        );
    }
}


export default ResizeTable;