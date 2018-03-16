import React from "react";
import { Test } from "_tslint@5.9.1@tslint";
function TestPage(){
    return (
        <h1>测试Router的用法</h1>
    );
}

class TestPageClass extends React.Component{
    render(){
        return (
            <h1>测试不一样的用法</h1>
        )
    }
}
export {TestPage,TestPageClass}