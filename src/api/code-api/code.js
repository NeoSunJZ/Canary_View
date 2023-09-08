import axios from "axios";

export async function getCodeByAttackName(nodeServerAddr, attackName) {
  let data = null;
  await axios({
    method: "get",
    url: "http://" + nodeServerAddr + "/code/getCode",
    params: {
      attackName: attackName,
    },
  })
    .then((response) => {
      if (response.data.status === "SUCCESS") {
        data = response.data.msg;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return data;
}
