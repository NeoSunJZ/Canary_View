import axiosPlugin from '@/axiosPlugin.js'

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