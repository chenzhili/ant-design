// 条件筛选
// 条件筛选
const configObj = {
    // "包含": {value: "0", condition: "{0} in('value')"},
    // "不包含": {value: "1", condition: "{0} not in ('value')"},
    "包含": {value: "13", condition: "{0} like '%value%'"},
    "不包含": {value: "14", condition: "({0} not like '%value%' or {0} is null)"},
    "为空": {value: "2", condition: "{0} is null"},
    "不为空": {value: "3", condition: "{0} is not null"},
    "等于": {value: "4", condition: "{0}='value'"},
    "不等于": {value: "5", condition: "({0}<>'value' or {0} is null)"},
    "等于任意一个": {value: "6", condition: "{0} in (value)"},
    "不等于任意一个": {value: "7", condition: "({0} not in (value) or {0} is null)"},
    "大于": {value: "8", condition: "{0}>'value'"},
    "大于等于": {value: "9", condition: "{0} >='value'"},
    "小于": {value: "10", condition: "{0}<'value'"},
    "小于等于": {value: "11", condition: "{0}<='value'"},
    "选择范围": {value: "12", condition: "({0} between 'value' and 'value')"},
    // "属于": {value: "13", condition: "{0} like '%value%'"},
    // "不属于": {value: "14", condition: "{0} not like '%value%'"},
};
const dealConfigArr = Object.keys(configObj).reduce((prev, next) => {
    prev.push(configObj[next]);
    return prev;
}, []);
const filterArr = {
    string: ["包含", "不包含", "为空", "不为空", "等于", "不等于", "等于任意一个", "不等于任意一个"],
    number: ["大于", "大于等于", "为空", "不为空", "等于", "不等于", "选择范围", "小于", "小于等于"],
    date: ["等于", "不等于", "大于等于", "小于等于", "选择范围", "为空", "不为空"],
    select: ["等于", "不等于", "等于任意一个", "不等于任意一个", "为空", "不为空"],
    location: ["包含", "不包含", "为空", "不为空"],
    attach: ["为空", "不为空"],
    member: ["等于", "不等于", "等于任意一个", "不等于任意一个","为空", "不为空"],
    department: ["等于", "不等于", "等于任意一个", "不等于任意一个","为空", "不为空"],
    // member: ["等于", "包含"],
    // department: ["等于", "包含"],
}
const optionObj = Object.keys(filterArr).reduce((prev, next) => {
    prev[next] = filterArr[next].reduce((p, n) => {
        p.push({
            name: n,
            ...configObj[n]
        });
        return p;
    }, []);
    return prev;
}, {});

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