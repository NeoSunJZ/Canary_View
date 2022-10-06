import axiosPlugin from '@/axiosPlugin.js'
import Qs from 'qs'

/**
 * @description: 用于请求返回服务器节点信息
 * @param {Number} pageNum
 * @param {Number} pageSize 默认 2
 * @return 返回一个包含服务器节点信息的对象
 */
export async function getNodeInfo() {
    let data = null;
    await axiosPlugin({
        method: "get",
        url: "v2/resource/NodeInfo/getNodeInfo",
        params: {
            //
        },
    }).then((response) => {
        if (response.data.state === "SUCCESS") {
            data = response.data.msg;
        }
    });
    return data;
}


/**
 * @description: 用于请求增加一个节服务器点
 * @param {String} ip 
 * @param {String} port
 * @param {String} name 服务器名
 * @param {String} desc 服务器描述
 * @return 返回是否成功增加
 */
export async function addNodeInfo(ip, port, name, desc) {
    let success = false;
    await axiosPlugin({
        method: "post",
        url: "v2/resource/NodeInfo/addNodeInfo",
        data: Qs.stringify({
            ip: ip,
            port: port,
            nodeName: name,
            nodeDesc: desc
        }),
    }).then((response) => {
        if (response.data.state === "SUCCESS") {
            success = true
        }
    });
    return success;
}

/**
 * @description: 用于请求删除一个服务器节点
 * @param {Number} nodeID 删除的节点ID
 * @return 返回是否成功
 */
export async function deleteNodeInfo(nodeID) {
    let success = false;
    await axiosPlugin({
        method: "get",
        url: "v2/resource/NodeInfo/deleteNodeInfo",
        params: {
            nodeID: nodeID
        },
    }).then((response) => {
        if (response.data.state === "SUCCESS") {
            success = true
        }
    });
    return success;
}

/**
 * @description: 用于请求更新一个服务器节点
 * @param {Number} nodeID 删除的节点ID
 * @param {String} ip 
 * @param {String} port
 * @param {String} name 服务器名
 * @param {String} desc 服务器描述
 * @return 返回是否成功
 */
export async function updateNodeInfo(nodeID, ip, port, name, desc) {
    let success = false;
    await axiosPlugin({
        method: "post",
        url: "v2/resource/NodeInfo/updateNodeInfo",
        data: Qs.stringify({
            nodeID: nodeID,
            ip: ip,
            port: port,
            nodeName: name,
            nodeDesc: desc
        }),
    }).then((response) => {
        if (response.data.state === "SUCCESS") {
            success = true
        }
    });
    return success;
}