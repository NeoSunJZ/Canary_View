import axiosPlugin from '@/axiosPlugin.js'

/**
 * @description: 用于请求对应服务器返回攻击方法
 * @param {Number} pageNum
 * @param {Number} pageSize 默认 10
 * @return 返回一个包含方法的对象
 */
export async function getAtkInfo(pageNum, pageSize = 10) {
  let data = null;
  await axiosPlugin({
    method: "get",
    url: "v2/resource/atkInfo/getAttackMethodInfo",
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