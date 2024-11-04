import { HomePageSettings } from '@/src/shared/entities/AppManagement/homepage_settings';
import { TopCarouselImages } from '@/src/shared/entities/AppManagement/top_carousel_images';
import Image from 'next/image';
import { Carousel } from 'primereact/carousel';
import { Galleria } from 'primereact/galleria';
import { useState } from 'react';


interface HeroProps{
    settings:HomePageSettings
}

export default function HeroSection(props:HeroProps) {
    // const {hero_section_main_text,hero_section_sub_text,top_carousel_images} =  props.settings ?
    const responsiveOptions = [
        {
            breakpoint: '991px',
            numVisible: 1
        },
        {
            breakpoint: '767px',
            numVisible: 1
        },
        {
            breakpoint: '575px',
            numVisible: 1
        }
    ];

    const imageTemplate = (image:TopCarouselImages) => {
        return (
            <div className='flex jusify-content-center '>
                <Image src={image.image} width={250} height={250} alt={image.image_name} />
            </div>
        )
    }


    return (
        <div className="w-full bg-blue-50 md:flex justify-content-between p-7 align-items-center">
            <div className='flex-column justify-content-center h-full text-center md:w-6'>
                <h1>{props.settings !== undefined ? props.settings.hero_section_main_text : "We are currently working on our site please hold on"}</h1>
                <h3>{props.settings  !== undefined ? props.settings.hero_section_sub_text : ""}</h3>
            </div>
            <div className='md:w-6'>
                {props.settings !== undefined ? <Galleria 
                    value={props.settings.top_carousel_images} 
                    numVisible={5} 
                    showThumbnails={false}
                    circular
                    showIndicators
                    responsiveOptions={responsiveOptions} 
                    item={imageTemplate} 
                    autoPlay 
                    transitionInterval={2500}
                /> : null}
            </div>
        </div>
    )
}