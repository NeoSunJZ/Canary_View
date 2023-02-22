import axiosPlugin from '@/axiosPlugin.js'
import Qs from 'qs'

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

export async function addDatasetInfo(datasetName, datasetDesc, datasetWebsite, datasetClassName) {
  let data = null;
  await axiosPlugin({
    method: 'post',
    url: "v2/resource/datasetInfo/addDatasetInfo",
    data: Qs.stringify({
      datasetName: datasetName,
      datasetDesc: datasetDesc,
      datasetWebsite: datasetWebsite,
      datasetClassName: datasetClassName
    }),
  }).then((response) => {
    if (response.data.state === "SUCCESS") {
      data = response.data.msg;
    }
  })
  return data;
}

export async function updateDatasetInfo(datasetID, datasetName, datasetDesc, datasetWebsite, datasetClassName) {
  let data = null;
  await axiosPlugin({
    method: 'post',
    url: "v2/resource/datasetInfo/updateDatasetInfo",
    data: Qs.stringify({
      datasetID: datasetID,
      datasetName: datasetName,
      datasetDesc: datasetDesc,
      datasetWebsite: datasetWebsite,
      datasetClassName: datasetClassName
    }),
  }).then((response) => {
    if (response.data.state === "SUCCESS") {
      data = response.data.msg;
    }
  })
  return data;
}

export async function deleteDatasetInfo(datasetID) {
  let data = null;
  await axiosPlugin({
    method: 'post',
    url: "v2/resource/datasetInfo/deleteDatasetInfo",
    data: Qs.stringify({
      datasetID: datasetID,
    }),
  }).then((response) => {
    if (response.data.state === "SUCCESS") {
      data = true;
    }
  })
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

export async function updateDatasetProvider(datasetProviderID, datasetID, nodeID, datasetSource, bindDatasetName, datasetTypeDesc, isProvideTags) {
  let data = null;
  await axiosPlugin({
    method: "post",
    url: "v2/resource/datasetInfo/updateDatasetProvider",
    data: Qs.stringify({
      datasetProviderID: datasetProviderID,
      datasetID: datasetID,
      nodeID: nodeID,
      datasetSource: datasetSource,
      bindDatasetName: bindDatasetName,
      datasetTypeDesc: datasetTypeDesc,
      isProvideTags: isProvideTags

    }),
  }).then((response) => {
    if (response.data.state === "SUCCESS") {
      data = response.data.msg;
    }
  });
  return data;
}

export async function deleteDatasetProvider(datasetProviderID) {
  let data = null;
  await axiosPlugin({
    method: "post",
    url: "v2/resource/datasetInfo/deleteDatasetProvider",
    data: Qs.stringify({
      datasetProviderID: datasetProviderID,
    }),
  }).then((response) => {
    if (response.data.state === "SUCCESS") {
      data = response.data.msg;
    }
  });
  return data;
}