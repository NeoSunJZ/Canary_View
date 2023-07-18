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