import axiosPlugin from '@/axiosPlugin.js'
import Qs from 'qs'

export async function newTask(taskName, taskDesc, taskNodeID, taskTypeID, config) {
  let data = null;
  await axiosPlugin({
    method: "post",
    url: "v2/task/newTask",
    data: Qs.stringify({
      taskName: taskName,
      taskDesc: taskDesc,
      taskNodeID: taskNodeID,
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

export async function getTaskListByType(typeName, pageNum, pageSize = 10) {
  let data = null;
  await axiosPlugin({
    method: "get",
    url: "v2/task/getTaskListByType",
    params: {
      typeName: typeName,
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

export async function getTaskByTaskID(taskID) {
  let data = null;
  await axiosPlugin({
    method: "get",
    url: "v2/task/getTaskByTaskID",
    params: {
      taskID: taskID,
    },
  }).then((response) => {
    if (response.data.state === "SUCCESS") {
      data = response.data.msg;
    }
  });
  return data;
}

export async function setTaskStatus(taskID, batchToken) {
  let data = null;
  await axiosPlugin({
    method: "get",
    url: "v2/task/setTaskStatus",
    params: {
      taskID: taskID,
      batchToken: batchToken
    },
  }).then((response) => {
    if (response.data.state === "SUCCESS") {
      data = response.data.msg;
    }
  });
  return data;
}