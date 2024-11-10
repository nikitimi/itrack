import Header from '@/components/Header';
import { SidebarMenuSkeleton } from '@/components/ui/sidebar';
import { Suspense } from 'react';

const About = () => {
  const contents = {
    ABOUT_US: `ITrack is a cutting-edge platform designed to empower IT students at Bulacan State University. By leveraging the power of data analytics, ITrack offers 		a comprehensive solution to help you:
      Understand your strengths and weaknesses: Gain valuable insights into your skills and competencies.
      Explore potential career paths: Discover exciting opportunities that align with your interests and goals.
      Connect with industry professionals: Network with experienced IT experts and build valuable relationships.
      Prepare for the future of work: Stay ahead of the curve with the latest industry trends and emerging technologies.
      With ITrack, you’ll have the knowledge and resources to make informed decisions and achieve your full potential.`,
    MISSION: `To empower IT students at Bulacan State University by providing a data-driven platform that fosters informed decision-making, career exploration, and 		professional development.`,
    VISION: `To be the leading platform for IT students, equipping them with the knowledge and tools to excel in the ever-evolving technology landscape.`,
  };
  return (
    <>
      <Suspense fallback={<SidebarMenuSkeleton />}>
        <Header />
      </Suspense>
      <div className="mt-24 flex flex-col items-center justify-center gap-4">
        <section className="pl-12 pt-12 duration-200 ease-in-out sm:w-3/4">
          <div className="via-itrack-primary/70 to-itrack-primary/90 mb-12 rounded-lg bg-gradient-to-bl from-white px-2 py-8 text-center shadow-sm duration-200 ease-in-out">
            <h1 className="w-full font-geist-sans text-xl font-black text-black duration-200 ease-in-out sm:text-2xl md:text-4xl">
              Check your career trajectory
            </h1>
            <h2 className="font-geist-sans text-lg font-bold text-black duration-200 ease-in-out sm:text-xl md:text-2xl">
              anywhere and anytime.
            </h2>
          </div>
          <div className="flex flex-col gap-12">
            {Object.entries(contents).map(([key, content]) => {
              const isAboutUs = key === 'ABOUT_US';

              return (
                <div key={key} className="flex flex-col gap-1">
                  <h2
                    className={`${isAboutUs ? 'text-2xl' : ''} text-center font-bold duration-300 ease-in-out`}
                  >
                    {key.replace(/_/, ' ')}
                  </h2>
                  <p className="p-2 text-justify font-geist-mono text-lg duration-200 ease-in-out">
                    {content}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
