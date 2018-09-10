// 条件筛选
const optionObj = Object.freeze({
    string:[
        {name:"包含",value:"string0"},
        {name:"不包含",value:"string1"},
        {name:"为空",value:"0"},
        {name:"不为空",value:"1"},
    ],
    "number":[
        {name:"等于",value:"number0"},
        {name:"不等于",value:"number1"},
        {name:"大于",value:"number2"},
        {name:"大于等于",value:"number3"},
        {name:"小于",value:"number4"},
        {name:"小于等于",value:"number5"},
        {name:"选择范围",value:"-1"},
        {name:"为空",value:"0"},
        {name:"不为空",value:"1"},
    ],
    "date":[
        {name:"等于",value:"date0"},
        {name:"不等于",value:"date1"},
        {name:"大于等于",value:"date2"},
        {name:"小于等于",value:"date3"},
        {name:"选择范围",value:"-1"},
        {name:"为空",value:"0"},
        {name:"不为空",value:"1"},
    ],
    "select":[
        {name:"等于",value:"select0"},
        {name:"不等于",value:"select1"},
        {name:"等于任意一个",value:"select2"},
        {name:"不等于任意一个",value:"select3"},
        {name:"为空",value:"0"},
        {name:"不为空",value:"1"},
    ],
    "location":[
        {name:"属于",value:"location0"},
        {name:"不属于",value:"location1"},
        {name:"为空",value:"0"},
        {name:"不为空",value:"1"},
    ],
    "attach":[
        {name:"为空",value:"0"},
        {name:"不为空",value:"1"},
    ]
});

function Guid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

export {
    Guid,
    optionObj
};