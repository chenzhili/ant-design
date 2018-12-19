import { Component } from "react"
import { Modal, Icon, Upload, Button, message } from "antd"
import config from "../../../utils/config";
import styles from "./ImportProcedureOne.less"

function ImportProcedureOne(props) {
    let { importSteps, changeSteps } = props;
    return (
        <div style={{ height: "420px" }}>
            <div className={styles.alertNote}>
                <p><Icon type="exclamation" theme="outlined" />支持 2MB 以内的xls、xlsx格式文件</p>
                <p><Icon type="exclamation" theme="outlined" />文件中数据不能超过50000行、200列（如需导入为部门成员字段，则不能超过10000行、200列）</p>
                <p><Icon type="exclamation" theme="outlined" />子表单明细同样占用行数</p>
                <p><Icon type="exclamation" theme="outlined" />更多导入说明和示例，请查看 <span>帮助文档</span></p>
            </div>
            <div className={styles.mainContent}>
                <div className={styles.contentOperate}>
                    <Upload accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" showUploadList={false}
                    action={"http://127.0.0.1:5004/api/Files/ImportExcel"}
                    onChange={(e) => { 
                        // console.log(e);
                        if (e["file"]["status"] === "done") {
                            const typeReg = /^(\.csv|application\/vnd.openxmlformats-officedocument.spreadsheetml\.sheet|application\/vnd\.ms-excel)$/ig;
                            if (typeReg.test(e["file"]["type"])) {
                                
                            } else {
                                message.config({ maxCount: 1 });
                                message.warning("不支持选择的文件类型");
                            }
                        }
                    }}
                    >
                        <Button style={{ backgroundColor: "#C7EDEB", border: "1px solid #6AD0C8", padding: "0 20px" }}>
                            <Icon type="upload" />
                            上传文件
                        </Button>
                    </Upload>
                    <div className={styles.download}>推荐使用<span>标准模板</span>导入数据</div>
                </div>
            </div>
        </div>
    );
}

export default ImportProcedureOne;