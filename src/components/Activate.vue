<template>
  <div>
    <a-modal v-model:visible="activateCheckModel" title="许可证状态异常" :maskClosable="false" :closable="false">
      <template #footer>
        <a-button key="submit" type="primary" @click="activate">激活</a-button>
      </template>
      <p>您的许可证已经过期或无效</p>
      <p>
        许可证状态：{{activateStatus['status']}}
        <br />许可证类型：{{activateStatus['type']}}
        <br />许可证有效期：{{activateStatus['validity']}}
      </p>
      <p>如希望继续使用该功能，必须提供一个有效的许可证。您可以从北京理工大学采购并获得该许可证。</p>
      <a-textarea v-model:value="newActiveCode" placeholder="请输入有效的许可证" auto-size />
    </a-modal>
    <slot name="context" :activateStatus="activateStatus" v-if="activateStatus && activateStatus['status'] == 'Activated'"></slot>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref, reactive } from 'vue';
import CryptoJS from 'crypto-js';
import JsRsaSign from 'jsrsasign';

export default defineComponent({
  name: 'activateComponent',
  components: {},
  props: {
    //
  },
  setup(props, context) {
    const activateStatus = ref(null);
    const newActiveCode = ref(null);
    const activateCheckModel = ref(false);

    const K = Math.sin(2023).toString(36);
    const publicKey =
      '-----BEGIN PUBLIC KEY-----' +
      'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCqC9AFf6HQzSuhnED57pCX3iFx' +
      'a6cEgczzstf1hrqJgJsqrvgQ0tHGVwlTFpnI7SbEKaO383ViSCApIGOOvIxfHWHS' +
      'dTALclDbjTufQ2V5v8eQC6kUOxuEPuDlq2X0bYnK4CtuwUoFBSZoZDEHCbEAhotu' +
      'KnSpvVMCephWW7YazwIDAQAB' +
      '-----END PUBLIC KEY-----';
    const coreV = (AC) => {
      try {
        if (AC.indexOf('.') == -1) {
          activateCheckModel.value = true;
          return {
            status: 'No Valid License',
            type: '非法许可证(许可证输入错误)',
            validity: '-',
          };
        }

        const SIGN = AC.split('.')[1];
        AC = AC.split('.')[0];

        if (!verifyBySHA256WithRSA(publicKey, SIGN, AC)) {
          activateCheckModel.value = true;
          return {
            status: 'No Valid License',
            type: '非法许可证(RSA验证失败)',
            validity: '-',
          };
        }
        const DT = CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(AC, K)).toString();
        const INFO = JSON.parse(DT);
        if (Date.now() > INFO['validity'] && INFO['validity'] != 'NEVER') {
          INFO['status'] = 'Expired';
          INFO['validity'] = new Date(INFO['validity']).toLocaleString();
          activateCheckModel.value = true;
        } else {
          INFO['status'] = 'Activated';
          INFO['validity'] = new Date(INFO['validity']).toLocaleString();
          if (INFO['validity'] == 'NEVER') {
            INFO['validity'] == '永久';
          }
        }
        return INFO;
      } catch (e) {
        localStorage.removeItem('AC');
        activateCheckModel.value = true;
        return {
          status: 'No Valid License',
          type: '许可证解析失败',
          validity: '-',
        };
      }
    };

    const generate = () => {
      const keyPair = JsRsaSign.KEYUTIL.generateKeypair('RSA', 1024);
      const privateKey = JsRsaSign.KEYUTIL.getPEM(keyPair.prvKeyObj, 'PKCS8PRV');
      const publicKey = JsRsaSign.KEYUTIL.getPEM(keyPair.pubKeyObj);

      const signBySHA256WithRSA = (privateKey, msg) => {
        const key = JsRsaSign.KEYUTIL.getKey(privateKey);
        const signature = new JsRsaSign.KJUR.crypto.Signature({
          alg: 'SHA256withRSA',
        });
        signature.init(key);
        signature.updateString(msg);
        // 签名后的为16进制字符串，这里转换为16进制字符串
        return JsRsaSign.hextob64(signature.sign());
      };

      const activateCode = CryptoJS.AES.encrypt(
        CryptoJS.enc.Utf8.parse(
          JSON.stringify({
            type: 'Pro+ 定制版',
            validity: new Date().setFullYear(new Date().getFullYear() + 1),
          }).toString()
        ),
        K
      ).toString();

      const sign = signBySHA256WithRSA(privateKey, activateCode);

      console.log(`生成的私钥为：\n${privateKey}`);
      console.log(`生成的公钥为：\n${publicKey}`);
      console.log(`密钥为：\n${activateCode + '.' + sign}`);
    };

    /**
     * SHA256和RSA验签
     * @param publicKey 公钥：必须为标准pem格式。如果是PKCS1格式，必须包含-----BEGIN RSA PRIVATE KEY-----，如果是PKCS8格式，必须包含-----BEGIN PRIVATE KEY-----
     * @param base64SignStr Base64编码签名字符串
     * @param msg 原内容
     * @returns {boolean} 是否验签通过
     */
    const verifyBySHA256WithRSA = (publicKey, base64SignStr, msg) => {
      const key = JsRsaSign.KEYUTIL.getKey(publicKey);
      const signature = new JsRsaSign.KJUR.crypto.Signature({
        alg: 'SHA256withRSA',
      });
      signature.init(key);
      signature.updateString(msg);
      return signature.verify(JsRsaSign.b64tohex(base64SignStr));
    };

    const activate = (e) => {
      localStorage.setItem('AC', newActiveCode.value);
      location.reload();
    };

    const check = () => {
      const KEY = localStorage.getItem('AC');
      activateStatus.value = coreV(KEY);
      if (activateStatus.value['status'] != 'Activated') {
        context.emit('activateStatus', false);
      } else {
        context.emit('activateStatus', true);
      }
    };

    onMounted(() => {
      check();
    });

    return {
      activateStatus,
      newActiveCode,
      activateCheckModel,
      activate,
    };
  },
});
</script>
