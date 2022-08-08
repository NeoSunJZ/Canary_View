import {
    reactive
} from 'vue';
import {
    getAtkProvider
} from '@/api/atk-api/atkInfo.js';

const attackBindInfoStore = reactive({})

export const attackConfigNotice = reactive({})

export const initStore = (atkID, update = false) => {
    if (attackBindInfoStore[atkID] == undefined || update) {
        attackBindInfoStore[atkID] = null;
    }
    if (attackConfigNotice[atkID] == undefined || update) {
        attackConfigNotice[atkID] = {
            status: 'processing',
            info: '请等待'
        };
    }
};

const setNotice = (atkID, info, status) => {
    attackConfigNotice[atkID].info = info;
    attackConfigNotice[atkID].status = status;
};

export const getAttackBindInfoList = async (atkID) => {
    if (attackBindInfoStore[atkID] == null) {
        setNotice(atkID, '正在获取方法绑定的节点信息', 'processing');
        attackBindInfoStore[atkID] = await getAtkProvider(atkID);
    }
    return attackBindInfoStore[atkID]
}

export const getAttackBindInfo = async (atkID, nodeID) => {
    await getAttackBindInfoList(atkID);
    let attackBindInfo = null
    attackBindInfoStore[atkID].forEach(element => {
        if (element.nodeID == nodeID) {
            attackBindInfo = element
        }
    });
    return attackBindInfo;
}

export const getAttackDeclaration = async (atkID, nodeID, currentServerDeclaration) => {
    let attackBindInfo = await getAttackBindInfo(atkID, nodeID)
    if (attackBindInfo == null) {
        setNotice(atkID, '方法未绑定当前服务节点', 'error');
        return null;
    }

    let attackDeclaration = null


    setNotice(atkID, '正在获取配置列表', 'processing');
    currentServerDeclaration['attack']['attackList'].forEach((element) => {
        if (element.attackMethodName == attackBindInfo['bindAttackMethodName']) {
            attackDeclaration = element;
        }
    });
    if (attackDeclaration == null) {
        setNotice(atkID, '方法绑定名称在当前节点中不存在', 'error');
    }
    return attackDeclaration;
};