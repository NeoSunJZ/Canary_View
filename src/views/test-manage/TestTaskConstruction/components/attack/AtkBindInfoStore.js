import {
    reactive
} from 'vue';

import {
    getAtkProvider
} from '@/api/atk-api/atkInfo.js';

const atkBindInfoStore = reactive({})

export const getAllAtkBindInfos = async (modelID, update = false) => {
    if (atkBindInfoStore[modelID] == null || update) {
        atkBindInfoStore[modelID] = await getAtkProvider(modelID);
    }
    return atkBindInfoStore[modelID]
}