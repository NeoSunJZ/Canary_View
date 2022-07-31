import axiosPlugin from '@/axiosPlugin.js'

/**
 * @description: 用于请求返回服务器节点信息
 * @param {String?} userToken 用户身份令牌，还没用上
 * @param {Number} pageNum
 * @param {Number} pageSize 默认 2
 * @return 返回一个包含服务器节点信息的对象
 */
export async function getNodeInfo(pageNum, pageSize = 2) {
    let data = null;
    await axiosPlugin({
        method: "get",
        url: "v2/resource/NodeInfo/getNodeInfo",
        params: {
            pageNum: pageNum,
            pageSize: pageSize,
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
 * @param {String?} userToken 用户身份令牌，还没用上
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
        params: {
            ip: ip,
            port: port,
            nodeName: name,
            nodeDesc: desc
        },
    }).then((response) => {
        if (response.data.state === "SUCCESS") {
            success = true
        }
    });
    return success;
}

/**
 * @description: 用于请求删除一个服务器节点
 * @param {String?} userToken 用户身份令牌，还没用上
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
 * @param {String?} userToken 用户身份令牌，还没用上
 * @param {Number} nodeID
 * @param {String} ip 
 * @param {String} port
 * @param {String} name 服务器名
 * @param {String} desc 服务器描述
 * @param {Number} nodeID 删除的节点ID
 * @return 返回是否成功
 */
export async function updateNodeInfo(nodeID, ip, port, name, desc) {
    let success = false;
    await axiosPlugin({
        method: "get",
        url: "v2/resource/NodeInfo/updateNodeInfo",
        params: {
            nodeID: nodeID,
            ip: ip,
            port: port,
            nodeName: name,
            nodeDesc: desc
        },
    }).then((response) => {
        if (response.data.state === "SUCCESS") {
            success = true
        }
    });
    return success;
}