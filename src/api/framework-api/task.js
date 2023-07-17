import axios from 'axios'

export async function getTaskRunningStatus(nodeServerAddr, batchToken) {
  let data = null;
  await axios({
      method: "get",
      url: "http://" + nodeServerAddr + "/helper/task/runningStatus",
      params: {
        batchToken: batchToken,
      },
    }).then((response) => {
      if (response.data.status === "SUCCESS") {
        data = response.data.code;
      }
    })
    .catch((error) => {
      console.log(error)
    });
  return data;
}

export async function stopTask(nodeServerAddr, batchToken) {
  let data = null;
  await axios({
      method: "get",
      url: "http://" + nodeServerAddr + "/helper/task/stopTask",
      params: {
        batchToken: batchToken,
      },
    }).then((response) => {
      if (response.data.status === "SUCCESS") {
        data = response.data.code;
      }
    })
    .catch((error) => {
      console.log(error)
    });
  return data;
}

export async function getTaskStepLog(nodeServerAddr, batchToken) {
  let data = null;
  await axios({
      method: "get",
      url: "http://" + nodeServerAddr + "/helper/task/getTaskStepLog",
      params: {
        batchToken: batchToken,
      },
    }).then((response) => {
      if (response.data.status === "SUCCESS") {
        data = response.data.msg;
      }
    })
    .catch((error) => {
      console.log(error)
    });
  return data;
}

export async function revokeTaskStepLog(nodeServerAddr, batchToken, systemLogID) {
  let data = null;
  await axios({
      method: "get",
      url: "http://" + nodeServerAddr + "/helper/task/revokeTaskStepLog",
      params: {
        batchToken: batchToken,
        systemLogID: systemLogID,
      },
    }).then((response) => {
      if (response.data.status === "SUCCESS") {
        data = response.data.msg;
      }
    })
    .catch((error) => {
      console.log(error)
    });
  return data;
}

export async function getTaskConsoleLog(nodeServerAddr, batchToken, pageLoadTime) {
  let data = null;
  await axios({
      method: "get",
      url: "http://" + nodeServerAddr + "/helper/task/getTaskConsoleLog",
      params: {
        batchToken: batchToken,
        beforeTime: pageLoadTime
      },
    }).then((response) => {
      if (response.data.status === "SUCCESS") {
        data = response.data.msg;
      }
    })
    .catch((error) => {
      console.log(error)
    });
  return data;
}