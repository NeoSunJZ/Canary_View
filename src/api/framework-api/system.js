import axios from 'axios'

export async function getSystemInfo(nodeServerAddr) {
  let data = null;
  await axios({
      method: "get",
      url: "http://" + nodeServerAddr + "/system/info/getSystemInfo",
      params: {},
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

export function startSystemMonitor(nodeServerAddr) {
  var url = "http://" + nodeServerAddr + "/system/info/startSystemMonitor";
  axios.get(url)
}

export function endSystemMonitor(nodeServerAddr) {
  var url = "http://" + nodeServerAddr + "/system/info/endSystemMonitor";
  axios.get(url)
}

export function refreshSystemMonitorWatchDog(nodeServerAddr) {
  var url = "http://" + nodeServerAddr + "/system/info/refreshSystemMonitorWatchDog";
  axios.get(url)
}

export async function getSystemVersion(nodeServerAddr) {
  let data = null;
  await axios({
      method: "get",
      url: "http://" + nodeServerAddr + "/system/info/getSystemVersion",
      params: {},
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