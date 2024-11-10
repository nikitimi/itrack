'use client';

import adminRoutesEnum from '@/lib/enums/routes/adminRoutes';

import { useParams } from 'next/navigation';
import React from 'react';

const Modify = () => {
  const params = useParams();
  const routes = adminRoutesEnum.options.filter((r) =>
    r.includes(params.modify as string)
  );

  if (routes.length === 0) throw new Error('Route doesn&apos;t exists.');

  return <div>{params.modify}</div>;
};

export default Modify;
