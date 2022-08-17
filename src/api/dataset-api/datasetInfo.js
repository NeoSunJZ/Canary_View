import axiosPlugin from '@/axiosPlugin.js'

export async function getDatasetInfo(pageNum, pageSize = 10) {
  let data = null;
  await axiosPlugin({
    method: "get",
    url: "v2/resource/datasetInfo/getDatasetInfo",
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

export async function getDatasetProvider(datasetID, nodeID = null) {
  let data = null;
  await axiosPlugin({
    method: "get",
    url: "v2/resource/datasetInfo/getDatasetProvider",
    params: {
      datasetID: datasetID,
      nodeID: nodeID,
    },
  }).then((response) => {
    if (response.data.state === "SUCCESS") {
      data = response.data.msg;
    }
  });
  return data;
}