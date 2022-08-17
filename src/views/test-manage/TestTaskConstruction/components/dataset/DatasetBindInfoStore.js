import {
    reactive
} from 'vue';
import {
    getDatasetProvider
} from '@/api/dataset-api/datasetInfo.js';

const datasetBindInfoStore = reactive({})

export const getAllDatasetBindInfos = async (datasetID, update = false) => {
    if (datasetBindInfoStore[datasetID] == null || update) {
        datasetBindInfoStore[datasetID] = await getDatasetProvider(datasetID);
    }
    return datasetBindInfoStore[datasetID]
}