'use client';

import React, { useEffect } from 'react';

const HeaderClient = <T,>(props: T) => {
  useEffect(() => console.log(props), [props]);

  return (
    <div className="w-full bg-orange-300 p-12 text-center text-black">
      <button
        className="rounded-lg bg-green-400 px-2 py-1 shadow-sm"
        onClick={() => {
          const headerList = new Headers();
          headerList.set('x-pathname', 'test');
          fetch('/api', { method: 'GET', headers: headerList }).then((d) =>
            console.log(d)
          );
        }}
      >
        Fetch
      </button>
    </div>
  );
};

export default HeaderClient;
