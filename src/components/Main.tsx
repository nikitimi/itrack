import React from 'react';

import type { Children } from '@/utils/types/children';

const Main = (props: Children) => {
  return <main>{props.children}</main>;
};

export default Main;
