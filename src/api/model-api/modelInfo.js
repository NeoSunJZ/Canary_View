import axiosPlugin from '@/axiosPlugin.js'
import Qs from 'qs'

/**
 * @description: 用于请求对应服务器返回模型信息
 * @param {Number} pageNum
 * @param {Number} pageSize 默认 10
 * @param {Boolen} Limited  未知作用参数，反正不是我写的
 * @return 返回一个包含模型信息的对象
 */
export async function getModelInfo(pageNum, pageSize = 10, limited = null) {
  let data = null;
  await axiosPlugin({
    method: "get",
    url: "v2/resource/modelInfo/getModelInfo",
    params: {
      pageNum: pageNum,
      pageSize: pageSize,
      limited: limited,
    },
  }).then((response) => {
    if (response.data.state === "SUCCESS") {
      data = response.data.msg;
    }
  });
  return data;
}

export async function getModelProvider(modelID, nodeID = null) {
  let data = null;
  await axiosPlugin({
    method: "get",
    url: "v2/resource/modelInfo/getModelProvider",
    params: {
      modelID: modelID,
      nodeID: nodeID,
    },
  }).then((response) => {
    if (response.data.state === "SUCCESS") {
      data = response.data.msg;
    }
  });
  return data;
}

export async function getModelConfig(modelProviderID, modelConfigType) {
  let data = null;
  await axiosPlugin({
    method: "get",
    url: "v2/resource/modelInfo/getModelConfig",
    params: {
      modelProviderID: modelProviderID,
      modelConfigType: modelConfigType,
    },
  }).then((response) => {
    if (response.data.state === "SUCCESS") {
      data = response.data.msg;
    }
  });
  return data;
}

/**
 * @description: 用于请求对应服务器新增一个模型
 * @param {String} modelName     模型名
 * @param {String} modelDesc     简介
 * @param {string} modelDetails  详情
 * @param {String} modelPaper    相关论文
 * @param {String} modelPaperUrl 链接
 * @param {Number} modelTypeID   类型
 * @return 返回是否成功
 */
export async function addModelInfo(modelName, modelDesc, modelDetails, modelPaper, modelPaperUrl, modelTypeID) {
  let data = null;
  await axiosPlugin({
    method: "post",
    url: "v2/resource/modelInfo/addModelInfo",
    data: Qs.stringify({
      modelName: modelName,
      modelDesc: modelDesc,
      modelDetails: modelDetails,
      modelPaper: modelPaper,
      modelPaperUrl: modelPaperUrl,
      modelTypeID: modelTypeID
    }),
  }).then((response) => {
    if (response.data.state === "SUCCESS") {
      data = 'success'
    }
  });
  return data;
}

/**
 * @description: 用于请求对应服务器软删除对应模型
 * @param {Number} modelID   模型ID(主键)
 * @return 返回是否成功
 */
export async function deleteModelInfo(modelID) {
  let data = null;
  await axiosPlugin({
    method: "post",
    url: "v2/resource/modelInfo/deleteModelInfo",
    data: Qs.stringify({
      modelID: modelID,
    }),
  }).then((response) => {
    if (response.data.state === "SUCCESS") {
      data = 'success'
    }
  });
  return data;
}

/**
 * @description: 用于请求对应服务器更新对应模型
 * @param {Number} modelID       模型ID(主键)
 * @param {String} modelName     模型名
 * @param {String} modelDesc     简介
 * @param {string} modelDetails  详情
 * @param {String} modelPaper    相关论文
 * @param {String} modelPaperUrl 链接
 * @param {Number} modelTypeID   类型
 * @return 返回是否成功
 */
export async function updateModelInfo(modelID, modelName, modelDesc, modelDetails, modelPaper, modelPaperUrl, modelTypeID) {
  let data = null;
  await axiosPlugin({
    method: "post",
    url: "v2/resource/modelInfo/updateModelInfo",
    data: Qs.stringify({
      modelID: modelID,
      modelName: modelName,
      modelDesc: modelDesc,
      modelDetails: modelDetails,
      modelPaper: modelPaper,
      modelPaperUrl: modelPaperUrl,
      modelTypeID: modelTypeID
    }),
  }).then((response) => {
    if (response.data.state === "SUCCESS") {
      data = 'success'
    }
  });
  return data;
}