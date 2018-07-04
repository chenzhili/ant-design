import React,{Component} from "react"
import { DragSource, DropTarget, DragDropContext } from 'react-dnd'

let type = "test"
const styles = {
    item:{
        height:"40px",
        lineHeight:"40px",
        border:"1px dashed #ddd",
        width:"500px",
        marginTop:"10px",
        textAlign:"center",
        cursor:"move"
    }
}

// @DropTarget(type,{

// },(connect, monitor)=>({
//     connectDropTarget: connect.dropTarget()
// })
// )
export default class DndTest extends Component{
    constructor(){
        super();
        this.state = {
            arr: [
                {id:0,name:"Write READMe"},
                {id:1,name:"Create some examples"},
                {id:2,name:"make it generic enough"},
                {id:3,name:"spanm in Twitter and IRC to promote it"},
                // "??????",
                // "PROFIT",
                // "write a cool JS libary"
            ]
        }
    }
    findCard(id){
        const cards = [...this.state.arr];
        let card = cards.filter(v=>v.id == id)[0];
        return {
            card,
            index:cards.indexOf(card)
        }
    }
    operateCard(index,atIndex,card){
        const cards = [...this.state.arr];
        cards.splice(index,1);
        cards.splice(atIndex,0,card);
        this.setState({
            arr:cards
        });
    }
    render(){
        return(
            <div>
                {
                    this.state.arr.map((v,i)=>(
                        <Card id={v.id} item={v} key={i}
                        findCard={this.findCard.bind(this)}
                        operateCard={this.operateCard.bind(this)}
                        />
                    ))
                }
            </div>
        );
    }
}
@DropTarget(type,{
    hover(props, monitor, component){
        let {id:hoverId,findCard,operateCard} = props;
        let {id:dragId} = monitor.getItem()["item"];
        if(hoverId != dragId){
            let {index,card} = findCard(dragId);
            let {index:atIndex} = findCard(hoverId);
            operateCard(index,atIndex,card);
        }
    }
},(connect,monitor)=>({
    connectDropTarget: connect.dropTarget()
}))
@DragSource(type,{
    beginDrag(props,monitor,component){
        let {item,findCard} = props;
        return {
            item,
            initialIndex:findCard(item.id)["index"]
        }
    },
    endDrag(props,monitor,component){
        const didDrop = monitor.didDrop();
        let {findCard,operateCard} = props;
        let {item:{id:dragId},initialIndex} = monitor.getItem();
    
        console.log(initialIndex);
        console.log(dragId);
        if(!didDrop){
            let {index,card} = findCard(dragId);
            operateCard(index,initialIndex,card);
        }
    }
},(connect,monitor)=>({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    currentItem:monitor.getItem()
}))
class Card extends Component{

    render(){
        let {connectDropTarget,connectDragSource,isDragging,currentItem} = this.props;
        return connectDragSource(connectDropTarget(
            <div style={{...styles.item,...{opacity:(currentItem &&currentItem.item.id == this.props.item.id)?"0":"1"}}}>{this.props.item.name}</div>
        ));
    }
}