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

export const getAllAttackBindInfos = async (atkID) => {
    if (attackBindInfoStore[atkID] == null) {
        setNotice(atkID, '正在获取方法绑定的节点信息', 'processing');
        attackBindInfoStore[atkID] = await getAtkProvider(atkID);
    }
    return attackBindInfoStore[atkID]
}

export const getAttackBindInfosByNodeID = async (atkID, nodeID) => {
    await getAllAttackBindInfos(atkID);
    let attackBindInfoList = []
    attackBindInfoStore[atkID].forEach(element => {
        if (element.nodeID == nodeID) {
            attackBindInfoList.push(element)
        }
    });
    return attackBindInfoList;
}

export const getBindInfoByProviderID = (attackBindInfos, providerID) => {
    let attackBindInfo = null
    attackBindInfos.forEach(element => {
        if (element.attackMethodProviderID == providerID) {
            attackBindInfo = element
        }
    });
    return attackBindInfo
}

export const getAttackDeclaration = async (atkID, nodeID, currentServerDeclaration, providerID = null) => {
    let attackBindInfos = await getAttackBindInfosByNodeID(atkID, nodeID)

    if (attackBindInfos.length == 0) {
        setNotice(atkID, '该攻击方法在当前服务节点没有绑定', 'error');
        return null;
    }

    let attackBindInfo = null
    if (attackBindInfos.length > 1) {
        if (providerID == null) {
            setNotice(atkID, '该攻击方法在当前服务节点有多个绑定', 'warning');
            return null;
        } else {
            attackBindInfo = getBindInfoByProviderID(attackBindInfos, providerID)
        }
    } else {
        attackBindInfo = attackBindInfos[0]
    }

    let attackDeclaration = null

    setNotice(atkID, '正在获取配置列表', 'processing');
    currentServerDeclaration['attack']['attackList'].forEach((element) => {
        if (element.attackMethodName == attackBindInfo['bindAttackMethodName']) {
            attackDeclaration = element;
        }
    });
    if (attackDeclaration == null) {
        setNotice(atkID, '当前服务节点未提供绑定的方法实现', 'error');
    }
    return attackDeclaration;
};