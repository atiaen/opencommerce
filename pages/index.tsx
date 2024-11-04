import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import Navbar from '@/components/global/navbar'
import HeroSection from '@/components/index_components/hero_section'
import Footer from '@/components/global/footer'
import PageTitle from '@/components/shared/page_title'
import Section1 from '@/components/index_components/section1'
import Section2 from '@/components/index_components/section2'
import Section3 from '@/components/index_components/section3'
import { useState } from 'react'
import { HomePageSettings } from '@/src/shared/entities/AppManagement/homepage_settings'
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import api from './api/[...remult]'

//...
export const getServerSideProps: GetServerSideProps = async (context) => {
  // Get remult instance
  const remult = await api.getRemult(context);

  const settings = await remult.repo(HomePageSettings).findFirst({
    use_setting:true,
    is_deleted:0
  })


  const settingsJson = settings ? JSON.parse(JSON.stringify(settings)) : null;

  return { props: { settings: settingsJson } };
};


export default function Home(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // const value = props.settings;

  return (
    <>
      <PageTitle title='Welcome to Medzone'/>
      <Navbar />
      <HeroSection settings={props.settings !== null ? props.settings : undefined} />
      <Section1 settings={props.settings}/>
      <Section2 settings={props.settings}/>
      <Section3 settings={props.settings}/>
      <Footer />
    </>
  )
}
