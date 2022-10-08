import axios from 'axios'

export async function getInferenceResultByModelName(nodeServerAddr, inferenceModel, batchToken) {
  let data = null;
  await axios({
      method: "get",
      url: "http://" + nodeServerAddr + "/analyzer/result/getInferenceResultByModelName",
      params: {
        inferenceModel: inferenceModel,
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

export async function getExplorePerturbationResult(nodeServerAddr, attackName, baseModel, batchToken) {
  let data = null;
  await axios({
      method: "get",
      url: "http://" + nodeServerAddr + "/analyzer/result/getExplorePerturbationResult",
      params: {
        attackName: attackName,
        baseModel: baseModel,
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

export async function getModelSecuritySyntheticalCapabilityResult(nodeServerAddr, inferenceModel, batchToken) {
  let data = null;
  await axios({
      method: "get",
      url: "http://" + nodeServerAddr + "/analyzer/result/getModelSecuritySyntheticalCapabilityResult",
      params: {
        inferenceModel: inferenceModel,
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

export async function getAdvInfo(nodeServerAddr, advImgId, batchToken, needAdvImg = 1) {
  let data = null;
  await axios({
      method: "get",
      url: "http://" + nodeServerAddr + "/analyzer/result/getAdvInfo",
      params: {
        advImgId: advImgId,
        needAdvImg: needAdvImg,
        batchToken: batchToken
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