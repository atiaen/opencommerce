import { BackendMethod,describeClass,remult } from "remult";
import { HomePageSettings } from "../../entities/AppManagement/homepage_settings";

export default class HomepageController {

    @BackendMethod({ allowed: true })
    static async getAllSettings() {
        const settingsRepo = await remult.repo(HomePageSettings);
        const settings = await settingsRepo.find({
            where:{
                is_deleted:0
            }
        });
        return settings;
    }

    @BackendMethod({ allowed: true })
    static async updateSetting(id: number, setti: HomePageSettings) {
        const settingRepo = await remult.repo(HomePageSettings);
        const setting = await settingRepo.update(id, setti);
        return setting;
    }


    @BackendMethod({ allowed: true })
    static async findOneSetting(id: number) {
        const settingRepo = await remult.repo(HomePageSettings);
        const setting = await settingRepo.findId(id);
        return setting;
    }

    
    @BackendMethod({ allowed: true })
    static async findOneCurrentSetting() {
        const settingRepo = await remult.repo(HomePageSettings);
        const setting = await settingRepo.findFirst({
            use_setting:true,
            is_deleted:0
        })
        return setting;
    }


    static async createSetting(setting:HomePageSettings){
        const settingRepo = await remult.repo(HomePageSettings);
        const savedSetting = await settingRepo.save(setting)
        return savedSetting;
    }

    static async deleteSetting(setting:HomePageSettings){
        const settingRepo = await remult.repo(HomePageSettings);
        setting.is_deleted = 1;
        const savedSetting = await settingRepo.save(setting)
        return savedSetting;
    }

}

describeClass(HomepageController, undefined, undefined, {
    createSetting: BackendMethod({ allowed: true }),
    deleteSetting: BackendMethod({ allowed: true }),
    findOneCurrentSetting: BackendMethod({ allowed: true }),
    // getAdminUserByEmailPassword: BackendMethod({ allowed:true })
})