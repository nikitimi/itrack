import { HeaderNoUser } from '@/components/Header';
import SignupCard from '@/components/student/SignupCard';
import Image from 'next/image';

const page = () => {
  return (
    <>
      <HeaderNoUser />
      <section className="flex h-full flex-col md:grid md:grid-cols-2">
        <div className="w-32 md:w-full lg:h-auto">
          <Image
            draggable={false}
            priority
            src="/signup.png"
            className="absolute bottom-0 left-12 z-0 h-auto w-auto select-none opacity-0 duration-200 ease-in-out md:opacity-100 lg:w-2/5"
            width={480}
            height={360}
            alt=""
          />
        </div>
        <div className="relative z-10 my-auto p-4">
          <SignupCard />
        </div>
      </section>
    </>
  );
};

export default page;
