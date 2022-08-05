import axios from 'axios'
import {
    notification
} from 'ant-design-vue';

/**
 * @description: 用于请求对应服务器返回声明，确认服务器是否链接
 * @param {String} ip
 * @param {String} port
 * @return 返回正确响应的声明或是null
 */
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

/**
 * @description: 用于仅请求对应服务器返回声明不弹窗
 * @param {String} ip
 * @param {String} port
 * @return 返回正确响应的声明或是null
 */
export async function getDeclarationOnly(ip, port) {
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
                return null
            }
        });
    return data;
}