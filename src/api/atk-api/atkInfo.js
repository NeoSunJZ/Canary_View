import axiosPlugin from '@/axiosPlugin.js'
import Qs from 'qs'

/**
 * @description: 用于请求对应服务器返回攻击方法
 * @param {Number} pageNum
 * @param {Number} pageSize 默认 10
 * @return 返回一个包含方法的对象
 */
export async function getAtkInfo(pageNum, pageSize = 10) {
  let data = null;
  await axiosPlugin({
    method: "get",
    url: "v2/resource/atkInfo/getAttackMethodInfo",
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
 * @description: 用于请求对应服务器返回攻击提供者
 * @param {Number} attackMethodID
 * @param {Number} nodeID 
 * @return 返回
 */
export async function getAtkProvider(attackMethodID, nodeID = null) {
  let data = null;
  await axiosPlugin({
    method: "get",
    url: "v2/resource/atkInfo/getAttackMethodProvider",
    params: {
      attackMethodID: attackMethodID,
      nodeID: nodeID,
    },
  }).then((response) => {
    if (response.data.state === "SUCCESS") {
      data = response.data.msg;
    }
  });
  return data;
}

export async function getAtkConfig(attackMethodProviderID) {
  let data = null;
  await axiosPlugin({
    method: "get",
    url: "v2/resource/atkInfo/getAttackMethodConfig",
    params: {
      attackMethodProviderID: attackMethodProviderID,
    },
  }).then((response) => {
    if (response.data.state === "SUCCESS") {
      data = response.data.msg;
    }
  });
  return data;
}

/**
 * @description: 用于请求对应服务器更新攻击方法提供者信息
 * @param {Number} attackMethodProviderID
 * @param {Number} attackMethodID
 * @param {String} nodeID
 * @param {String} attackMethodSource
 * @param {String} bindAttackMethodName
 * @return 返回
 */
export async function updateAtkMethodProvider(attackMethodProviderID, attackMethodID, nodeID, attackMethodSource, bindAttackMethodName) {
  let data = null;
  await axiosPlugin({
    method: "post",
    url: "v2/resource/atkInfo/updateAttackMethodProvider",
    data: Qs.stringify({
      attackMethodProviderID: attackMethodProviderID,
      attackMethodID: attackMethodID,
      nodeID: nodeID,
      attackMethodSource: attackMethodSource,
      bindAttackMethodName: bindAttackMethodName
    }),
  }).then((response) => {
    if (response.data.state === "SUCCESS") {
      data = 'success'
    }
  });
  return data;
}

/**
 * @description: 用于请求对应服务器软删除攻击方法提供者信息
 * @param {Number} attackMethodProviderID
 * @return 返回
 */
export async function deleteAtkMethodProvider(attackMethodProviderID) {
  let data = null;
  await axiosPlugin({
    method: "get",
    url: "v2/resource/atkInfo/deleteAttackMethodProvider",
    params: {
      attackMethodProviderID: attackMethodProviderID,
    },
  }).then((response) => {
    if (response.data.state === "SUCCESS") {
      data = 'success'
    }
  });
  return data;
}