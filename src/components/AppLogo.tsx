import Image from 'next/image';
import React from 'react';

const AppLogo = () => {
  return (
    <div className="mx-auto flex h-8 w-24 items-center justify-center">
      <Image
        draggable={false}
        src="/itrack-removebg.png"
        width={360}
        height={240}
        className="h-auto w-auto"
        alt=""
      />
    </div>
  );
};

export default AppLogo;
