import axiosPlugin from '@/axiosPlugin.js'
import Qs from 'qs'

export async function getAllQuickTaskConfig(pageNum, pageSize = 10) {
  let data = null;
  await axiosPlugin({
    method: "get",
    url: "v2/task/getAllQuickTaskConfig",
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

export async function newQuickTaskConfig(configName, configDesc, taskTypeID, config) {
  let data = null;
  await axiosPlugin({
    method: "post",
    url: "v2/task/newQuickTaskConfig",
    data: Qs.stringify({
      configName: configName,
      configDesc: configDesc,
      taskTypeID: taskTypeID,
      config: config
    }),
  }).then((response) => {
    if (response.data.state === "SUCCESS") {
      data = response.data.msg
    }
  });
  return data;
}

export async function getQuickTaskConfigByConfigID(configID) {
  let data = null;
  await axiosPlugin({
    method: "post",
    url: "v2/task/getQuickTaskConfigByConfigID",
    data: Qs.stringify({
      configID: configID,
    }),
  }).then((response) => {
    if (response.data.state === "SUCCESS") {
      data = response.data.msg
    }
  });
  return data;
}