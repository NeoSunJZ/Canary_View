import {
    reactive
} from 'vue';
import {
    getModelProvider
} from '@/api/model-api/modelInfo.js';

const modelBindInfoStore = reactive({})

export const getAllModelBindInfos = async (modelID, update = false) => {
    if (modelBindInfoStore[modelID] == null || update) {
        modelBindInfoStore[modelID] = await getModelProvider(modelID);
    }
    return modelBindInfoStore[modelID]
}