import GlobalModel from '../models/global.model';

export default class GlobalController {
    async getAgents({ searchable }) {
        const globalModel = new GlobalModel();
        const data = await globalModel.getAgents({
            searchable,
        });

        return data;
    }

    async getClients({ searchable }) {
        const globalModel = new GlobalModel();
        const data = await globalModel.getClients({
            searchable,
        });

        return data;
    }

    async getProfile({ id }) {
        const globalModel = new GlobalModel();
        const data = await globalModel.getProfileData({
            id,
        });

        return data;
    }

    async getVendors({ searchable }) {
        const globalModel = new GlobalModel();
        const data = await globalModel.getVendors({
            searchable,
        });

        return data;
    }
}
