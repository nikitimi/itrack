import routes from '@/utils/routes';
import { headers } from 'next/headers';
import Link from 'next/link';
import { Suspense } from 'react';
import HeaderClient from './HeaderClient';

const Header = () => {
  const headerList = headers();
  return (
    <>
      <header className="grid grid-flow-col">
        <section className="text-white">
          <h2>Admin Routes</h2>
          <div className="flex flex-col">
            {routes.admin.map((r) => (
              <CustomLink key={r} route={r} />
            ))}
          </div>
        </section>
        <section className="text-white">
          <h2>Student Routes</h2>
          <div className="flex flex-col">
            {routes.student.map((r) => (
              <CustomLink key={r} route={r} />
            ))}
          </div>
        </section>
      </header>
      <Suspense fallback={<p>Loading header client...</p>}>
        <HeaderClient {...headerList} />
      </Suspense>
    </>
  );
};

const CustomLink = ({ route }: { route: string }) => {
  const headerList = headers();
  const pathName = headerList.get('x-pathname');
  const defaultColorClasses = [
    'odd:bg-slate-400',
    'bg-slate-200',
    'text-black',
  ];
  const activeColorClasses = [
    'bg-green-500',
    'odd:bg-green-400',
    'text-white',
    'odd:text-slate-100',
  ];
  const baseClasses =
    'rounded-lg p-2 text-center shadow-sm duration-100 ease-in-out hover:bg-blue-400 hover:text-white';

  function setDynamicClass(stringClasses: string[]) {
    let holder = baseClasses;
    stringClasses.forEach((s) => (holder += ` ${s}`));
    return holder;
  }

  return (
    <Link
      href={route}
      className={setDynamicClass(
        pathName === route ? activeColorClasses : defaultColorClasses
      )}
    >
      <button>{route}</button>
    </Link>
  );
};

export default Header;
