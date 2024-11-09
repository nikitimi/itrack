'use client';

import Header, { HeaderNoUser } from '@/components/Header';
import { SidebarMenuSkeleton } from '@/components/ui/sidebar';
import { useAuth } from '@clerk/nextjs';
import Image from 'next/image';

const About = () => {
  return (
    <>
      <DynamicHeader />
      <section className="w-3/4 pl-24 pt-32">
        <h1 className="w-full font-geist-sans text-lg font-black duration-200 ease-in-out sm:text-xl md:text-3xl">
          Check your career trajectory
        </h1>
        <h2 className="font-geist-sans text-base font-bold duration-200 ease-in-out sm:text-lg md:text-2xl">
          anywhere and anytime.
        </h2>
        <p className="p-2 font-geist-mono text-xs duration-200 ease-in-out sm:text-sm">
          Welcome to iTrack! Discover your ideal IT career path with data-driven
          insights. Our platform helps Bustos Campus students find the right job
          by analyzing your skills, education, and goals. Get personalized
          recommendations and take the next step towards your future in IT!
        </p>
      </section>
      <div className="absolute bottom-0 right-2">
        <Image
          priority
          src="/about.png"
          className="h-auto w-[1080px]"
          width={1920}
          height={1080}
          alt=""
        />
      </div>
    </>
  );
};

const DynamicHeader = () => {
  const { userId } = useAuth();

  switch (true) {
    case typeof userId === 'string':
      return <Header />;
    case userId === undefined:
      return <SidebarMenuSkeleton />;
    default:
      return <HeaderNoUser />;
  }
};

export default About;
