import axios from 'axios'
import {
    notification
} from 'ant-design-vue';

export async function getDeclaration(ip, port) {
    let data = null;
    await axios({
            method: "get",
            url: "http://" + ip + ":" + port + "/getDeclaration",
            timeout: 1000
            // cancelToken: this.connectSource.token,
        }).then((response) => {
            if (response.data.state === "SUCCESS") {
                data = response.data.msg;
            }
        })
        .catch((error) => {
            if (axios.isCancel(error)) {
                //
            } else {
                notification.open({
                    message: '节点状态异常',
                    description: '请求失败',
                });
                return null
            }
        });
    return data;
}