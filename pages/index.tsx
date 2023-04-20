import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
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
    <>
      <Head>
        <link rel="icon" type="image/x-icon" href={`/favicon.ico`} />
        <title>Comanda Vip | Seu pedido online</title>
      </Head>
      <main>
        <header className="bg-hero shadow-lg">
          <div className="container mx-auto flex items-center justify-center">
            <Image
              className="m-6 w-[200px] object-cover"
              src="/logo.png"
              width={99999}
              height={99999}
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
                className="rounded-2xl w-[200px] h-[200px] bg-white border-hero shadow-md"
                id={store.logo?.toString()}
                width={200}
                height={200}
              />
            </Link>
          ))}
        </section>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = ssrHelpers.pipe(
  storesMetaSSP()
);

export default Home;
