import { useSession, signIn, signOut } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {SearchIcon } from '@heroicons/react/solid'
import Image from "next/dist/client/image";

function Header() {
  const { data: session } = useSession<boolean>();
  const [searchInput, setSearchInput] = useState("");
  const router = useRouter();

  const onSubmit = () => {
    router.push({
      pathname: "/search",
      query: {
        ville: searchInput,
      },
    });
  };

  return (
    <>
      <Head>
        <title>Meilleurs restaurants des Deux-sèvres</title>
        <meta
          name="description"
          content="Meilleurs restaurants des Deux-sèvres"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="z-50 grid grid-cols-3 bg-white w-full shadow-md p-5 md:px-10 h-[10vh]">
        {/* <header className="sticky top-0 z-50 grid grid-cols-3 bg-white w-full shadow-md p-5 md:px-10 h-[10vh]"> */}
        {/* left*/}
        <div
          onClick={() => router.push("/")}
          className="relative flex items-center h-10 w-fullmy-auto"
        >
          <button className=" cursor-pointer h-10  bg-[#589442] w-[19%] text-white rounded-full ">
            Accueil
          </button>
        </div>

        {/* middle */}

        {session ? (
          <div className="flex items-center md:border-2 rounded-full py-1 md:shadow-md">
              <input
                value={searchInput}
                onInput={(e) => setSearchInput(e.currentTarget.value)}
                type="input"
                placeholder={"Chercher par ville..."}
                className="text-sm text-gray-600 placeholder-gray-400 flex-grow pl-5 bg-transparent outline-none"
              />
              <SearchIcon
                onClick={onSubmit}
                className="hidden md:inline-flex h-8 w-8 bg-[#589442] rounded-full text-white p-2 cursor-pointer md:mr-2"
              />
          </div>
        ) : (
          <div className="items-center justify-center text-center">
            <h1 className="text-xl font-semibold">
              Meilleurs restaurants des Deux-Sèvres
            </h1>
          </div>
        )}

        {/* right */}

        <div className="flex items-center justify-end text-gray-500">
          <div onClick={() => (!session ? signIn() : signOut())}>
            {session ? (
              <div className="flex cursor-pointer">
                <Image
                  width={40}
                  height={40}
                  src={session.user.image}
                  alt=""
                />

                <button className=" cursor-pointer h-10 w-36 p-1 ml-3 bg-[#589442]  text-white rounded-full ">
                  Deconnexion
                </button>
              </div>
            ) : (
              <button className=" cursor-pointer h-10 bg-[#589442] w-28 text-white rounded-full p-1">
                Connexion
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
