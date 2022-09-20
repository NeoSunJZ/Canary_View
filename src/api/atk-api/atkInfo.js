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
 * @param {Number} attackMethodID 攻击方法ID
 * @param {Number} nodeID 节点ID，默认为空时返回所有此方法的提供者，否则只返回指定节点的
 * @return 返回一串包含方法提供者的信息
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
 * @param {Number} attackMethodID       攻击方法ID
 * @param {String} nodeID               节点ID
 * @param {String} attackMethodSource   攻击方法源
 * @param {String} bindAttackMethodName 绑定名
 * @return 返回是否成功
 */
export async function addAtkMethodProvider(attackMethodID, nodeID, attackMethodSource, bindAttackMethodName) {
  let data = null;
  await axiosPlugin({
    method: "post",
    url: "v2/resource/atkInfo/addAttackMethodProvider",
    data: Qs.stringify({
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
 * @description: 用于请求对应服务器更新攻击方法提供者信息
 * @param {Number} attackMethodProviderID 攻击方法提供者ID
 * @param {Number} attackMethodID 攻击方法ID
 * @param {String} nodeID 节点ID
 * @param {String} attackMethodSource 攻击方法源
 * @param {String} bindAttackMethodName 绑定名
 * @return 返回是否成功
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
 * @param {Number} attackMethodProviderID 攻击方法提供者ID
 * @return 返回是否成功
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

/**
 * @description: 用于请求对应服务器新增一个方法
 * @param {String} attackMethodName     攻击方法名
 * @param {String} attackMethodDesc     简介
 * @param {string} attackMethodDetails  详情
 * @param {String} attackMethodPaper    相关论文
 * @param {String} attackMethodPaperUrl 链接
 * @param {Number} attackMethodTypeID   类型
 * @return 返回是否成功
 */
export async function addAtkMethod(attackMethodName, attackMethodDesc, attackMethodDetails, attackMethodPaper, attackMethodPaperUrl, attackMethodTypeID) {
  let data = null;
  await axiosPlugin({
    method: "post",
    url: "v2/resource/atkInfo/addAttackMethod",
    data: Qs.stringify({
      attackMethodName: attackMethodName,
      attackMethodDesc: attackMethodDesc,
      attackMethodDetails: attackMethodDetails,
      attackMethodPaper: attackMethodPaper,
      attackMethodPaperUrl: attackMethodPaperUrl,
      attackMethodTypeID: attackMethodTypeID
    }),
  }).then((response) => {
    if (response.data.state === "SUCCESS") {
      data = 'success'
    }
  });
  return data;
}

/**
 * @description: 用于请求对应服务器更新对应方法
 * @param {Number} attackMethodID       攻击方法ID(主键)
 * @param {String} attackMethodName     攻击方法名
 * @param {String} attackMethodDesc     简介
 * @param {string} attackMethodDetails  详情
 * @param {String} attackMethodPaper    相关论文
 * @param {String} attackMethodPaperUrl 链接
 * @param {Number} attackMethodTypeID   类型
 * @return 返回是否成功
 */
export async function updateAtkMethod(attackMethodID, attackMethodName, attackMethodDesc, attackMethodDetails, attackMethodPaper, attackMethodPaperUrl, attackMethodTypeID) {
  let data = null;
  await axiosPlugin({
    method: "post",
    url: "v2/resource/atkInfo/updateAttackMethod",
    data: Qs.stringify({
      attackMethodID: attackMethodID,
      attackMethodName: attackMethodName,
      attackMethodDesc: attackMethodDesc,
      attackMethodDetails: attackMethodDetails,
      attackMethodPaper: attackMethodPaper,
      attackMethodPaperUrl: attackMethodPaperUrl,
      attackMethodTypeID: attackMethodTypeID
    }),
  }).then((response) => {
    if (response.data.state === "SUCCESS") {
      data = 'success'
    }
  });
  return data;
}