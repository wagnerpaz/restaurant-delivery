import { Button } from "@chakra-ui/react";
import { GetServerSideProps, NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import DbImage from "/components/DbImage";

import { ssrHelpers } from "/lib/ssrHelpers";
import { IStore } from "/models/Store";
import { IUser } from "/models/User";
import storesMetaSSP from "/server-side-props/storeMetaSSP";

interface HomeProps {
  stores: IStore[];
}

const Home: NextPage<HomeProps> = ({ stores }) => {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const admin = (session?.user as IUser)?.role === "admin";

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
        {stores.filter((f) => f.listed || admin).length === 0 && (
          <div className="container mx-auto flex items-center justify-center h-[calc(100vh-var(--header-height))]">
            <Button className="!bg-hero w-48 !m-auto" onClick={() => signIn()}>
              Entrar
            </Button>
          </div>
        )}
        <section className="container mx-auto px-6 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2">
          {stores
            .filter((f) => f.listed || admin)
            .map((store) => (
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
