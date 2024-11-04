import { HomePageSettings } from "@/src/shared/entities/AppManagement/homepage_settings"

interface HeroProps{
    settings:HomePageSettings
}

export default function Section1(props:HeroProps) {
    return (
        <div className="bg-primary-900 w-full p-7 flex justify-content-center">
            <div className="md:flex w-full md:gap-2 justify-content-center">
                <div className="col-12 md:col-3 p-3 bg-primary-800 border-round-md mb-2 md:mb-0">
                    <div className="flex align-items-center">
                        <i className="pi pi-truck mr-3 text-primary-400" style={{ fontSize: '2rem' }} />
                        <h4 className="text-white">
                           {props.settings !== null&& props.settings !== undefined 
                           ? props.settings.hero_section_card_1_text : "More to come"}
                        </h4>
                    </div>
                </div>
                <div className="col-12 md:col-3 p-3 bg-primary-800 border-round-md mb-2 md:mb-0">
                    <div className="flex align-items-center">
                        <i className="pi pi-money-bill mr-3 text-primary-400" style={{ fontSize: '2rem' }} />
                        <h4 className="text-white">
                        {props.settings !== null&& props.settings !== undefined 
                         ? props.settings.hero_section_card_2_text : "More to come"}
                        </h4>
                    </div>
                </div>
                <div className="col-12 md:col-3 p-3 bg-primary-800 border-round-md mb-2 md:mb-0">
                    <div className="flex align-items-center">
                        <i className="pi pi-shopping-bag mr-3 text-primary-400" style={{ fontSize: '2rem' }} />
                        <h4 className="text-white">
                        {props.settings !== null&& props.settings !== undefined  ? props.settings.hero_section_card_3_text : "More to come"}
                        </h4>
                    </div>
                </div>
            </div>
        </div>
    )
}