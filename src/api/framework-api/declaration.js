import axios from 'axios'
import {
    notification,
    Button
} from 'ant-design-vue';
import {
    h
} from 'vue';


/**
 * @description: 用于请求对应服务器返回声明，确认服务器是否链接
 * @param {String} ip
 * @param {String} port
 * @param {???}  notificationKey
 * @param {Boolean} showNotification 是否弹出提示框
 * @return 返回正确响应的声明或是null
 */
export async function getDeclaration(ip, port, notificationKey = null, showNotification = true) {
    notification.close(notificationKey)
    let data = null;
    let key = `open${Date.now()}`;
    await axios({
            method: "get",
            url: "http://" + ip + ":" + port + "/getDeclaration",
            timeout: 1000
            // cancelToken: this.connectSource.token,
        }).then((response) => {
            if (response.data.version.indexOf("v2.") != -1) {
                data = response.data;
            } else if (showNotification == true) {
                notification["error"]({
                    message: '当前节点版本不受支持',
                    description: '当前节点版本为' + response.data.version + '，现已不再支持，请升级节点SEFI框架版本',
                    duration: 10,
                });
            }
        })
        .catch((error) => {
            if (axios.isCancel(error)) {
                //
            } else if (showNotification == true) {
                notification["error"]({
                    message: '当前节点无法连接，请切换节点或检查网络连通性',
                    description: '请注意，该连接由浏览器本地而非远端服务器发起，请确保当前计算机可以正常访问节点网络。',
                    duration: 10,
                    btn: () =>
                        h(
                            Button, {
                                type: 'primary',
                                size: 'small',
                                onClick: () => getDeclaration(ip, port, key),
                            }, {
                                default: () => '重试'
                            },
                        ),
                    key
                });
                return null
            }
        });
    return data;
}