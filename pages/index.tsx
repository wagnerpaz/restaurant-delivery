import { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import DbImage from "/components/DbImage";

import { ssrHelpers } from "/lib/ssrHelpers";
import { IStore } from "/models/Store";
import storesMetaSSP from "/server-side-props/storeMetaSSP";

interface HomeProps {
  stores: IStore[];
}

const Home: NextPage<HomeProps> = ({ stores }) => {
  return (
    <main>
      <header className="bg-main-500">
        <div className="container mx-auto flex items-center justify-center">
          <Image
            className="mx-6 w-[200px] h-[150px] object-cover"
            src="/logo.png"
            width={500}
            height={500}
            alt="Rappid logo"
          />
        </div>
      </header>
      <section className="container mx-auto px-6 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2">
        {stores.map((store) => (
          <Link
            className="flex items-center justify-center"
            key={store._id}
            href={`/store/${store.slug}`}
          >
            <DbImage
              className="rounded-2xl w-[200px] h-[200px] bg-white"
              id={store.logo?.toString()}
              width={200}
              height={200}
            />
          </Link>
        ))}
      </section>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = ssrHelpers.pipe(
  storesMetaSSP()
);

export default Home;
