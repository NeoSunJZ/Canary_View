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