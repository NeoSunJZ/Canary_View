import {
    reactive
} from 'vue';
import {
    getAtkProvider
} from '@/api/atk-api/atkInfo.js';

export const attackDeclarationStore = reactive({})

export const initAttackDeclarationStore = (atkID) => {
    attackDeclarationStore[atkID] = {
        notice: {
            status: 'processing',
            info: '请等待'
        },
        attackBindInfo: null,
        attackDeclaration: null,
    };
};

const setNotice = (atkID, info, status) => {
    attackDeclarationStore[atkID].notice.info = info;
    attackDeclarationStore[atkID].notice.status = status;
};


export const getAttackDeclaration = async (atkID, nodeID, currentServerDeclaration) => {
    if (attackDeclarationStore[atkID].attackBindInfo == null) {
        // 不存在则请求
        setNotice(atkID, '正在获取方法绑定的节点信息', 'processing');
        let attackBindInfoList = await getAtkProvider(atkID, nodeID);

        if (attackBindInfoList.length > 0) {
            attackDeclarationStore[atkID].attackBindInfo = attackBindInfoList[0];
        } else {
            setNotice(atkID, '方法未绑定当前服务节点', 'error');
            return false;
        }
    }
    if (attackDeclarationStore[atkID].attackDeclaration == null) {
        setNotice(atkID, '正在获取配置列表', 'processing');
        let isfindDeclaration = false;
        currentServerDeclaration['attack']['attackList'].forEach((element) => {
            if (element.attackMethodName == attackDeclarationStore[atkID].attackBindInfo['bindAttackMethodName']) {
                attackDeclarationStore[atkID].attackDeclaration = element;
                isfindDeclaration = true;
            }
        });
        if (!isfindDeclaration) {
            setNotice(atkID, '方法绑定名称在当前节点中不存在', 'error');
            return false;
        }
    }
    return true;
};