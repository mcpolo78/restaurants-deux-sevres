import type { NextPage } from "next";
import { db } from "../utils/firebase/clientApp";
import {
  collection,
  DocumentData,
  getDocs,
  query,
  QueryDocumentSnapshot,
} from "@firebase/firestore";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import Image from "next/image";
import React from "react";
import { useSession, signIn} from "next-auth/react";
import { useLoadScript } from "@react-google-maps/api";
import Map from "../components/Map";
import { getPlacesData } from "../utils/Getplaces";
import { addDoc } from "firebase/firestore";
import Header from "../components/Header";
import { StarIcon } from "@heroicons/react/solid";

const Home: NextPage = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const [restaurants, setRestaurants] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session } = useSession<boolean>();
  const restaurantsCollection = collection(db, "restaurants");

  const getRestaurants = async () => {
    const restauQuery = query(restaurantsCollection);
    const querySnapshot = await getDocs(restauQuery);
    const result: QueryDocumentSnapshot<DocumentData>[] = [];
    querySnapshot.forEach((snapshot) => {
      result.push(snapshot);
    });

    // console.log("restaurants DB: ", result);

    if (result.length < 2) {
      setLoading(true);

      //récupération des restaurants via API externe
      getPlacesData().then((data) => {
        // console.log(data);

        //ajout des restaurants dans la bdd
        const _restau = collection(db, `restaurants`);

        data.map((restau, index) => {
          if (
            !restau.photo ||
            !restau.location_id ||
            !restau.category ||
            !restau.name ||
            !restau.phone ||
            !restau.address ||
            !restau.address_obj ||
            !restau.latitude ||
            !restau.longitude ||
            !restau.rating
          )
            return;

          const restauData = {
            location_id: Number(restau.location_id),
            image: restau.photo.images.large.url,
            description: restau.category.name,
            title: restau.name,
            title_search: restau.name.toUpperCase(),
            tel: restau.phone,
            address: restau.address,
            address_search: restau.address.toUpperCase(),
            city: restau.address_obj.city.toUpperCase(),
            lat: Number(restau.latitude),
            lng: Number(restau.longitude),
            rating: Number(restau.rating),
          };
          try {
            addDoc(_restau, restauData);
            //   //#DEV ONLY
            // setTimeout(() => {
            //   // Router.reload();
            // }, 3000);
          } catch (error) {
            console.log(error);
          }
        });
      });
    }
    setRestaurants(result);
  };

  // console.log(searchInput);

  useEffect(() => {
    getRestaurants();
    setLoading(false);
  }, []);

  // console.log(session);
  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        {session ? (
          <>
            <div className={styles.grid}>
              <div className={styles.section_restau}>
                {loading ? (
                  <div className={styles.card}>
                    <h2>Loading...</h2>
                  </div>
                ) : (
                  restaurants.map((restaurant, index) => {
                    return (
                      <a
                        href={`/restaurant/${restaurant.data().location_id}`}
                        key={index}
                      >
                        <div
                          className="flex py-7 px-2 border-b cursor-pointer hover:shadow-lg pr-4 hover:opacity-80 transition transformation duration 200 ease-out first:border-t"
                          key={index}
                        >
                          <div className="relative h-24 w-40 md:h-52 md:w-80 flex-shrink-0">
                            <Image
                              src={restaurant.data().image}
                              layout="fill"
                              objectFit="cover"
                              className="rounded-2xl"
                              alt=""
                            />
                          </div>

                          <div className="felex flex-col flex-grow pl-5">
                            <div className="flex justify-between">
                              <p>{restaurant.data().description}</p>
                            </div>

                            <h4 className="text-xl">
                              {restaurant.data().title}{" "}
                            </h4>
                            <div className="w-10 pt-2"></div>
                            <p className="pt-2 text-sm text-gray-500 flex-grow">
                              {restaurant.data().address}
                            </p>
                            <p className="pt-2 text-sm text-gray-500 flex-grow">
                              {restaurant.data().tel}
                            </p>

                            <div className="flex justify-between items-end pt-5">
                              <p className=" flex items-center">
                                <StarIcon className="h-5 text-[#589442]" />
                                {restaurant.data().rating}
                              </p>
                            </div>
                          </div>
                        </div>
                      </a>
                    );
                  })
                )}
              </div>
              <div id="map" className="sticky top-0 w-[50%]">
                {isLoaded && <Map restaurants={restaurants} />}
              </div>
            </div>
          </>
        ) : (
          <>
            <Image
              src="https://c.tfstatic.com/w_689,h_538,c_fill,g_auto:subject,q_auto,f_auto/tf-product/homepage-hero/fr-FR"
              layout="fill"
              objectFit="contain"
              alt=""
            />
            <div className="absolute top-1/2 w-full text-center">
              <button
                onClick={() => signIn()}
                className="text-lg font-bold my-3 hover:shadow-xl hover:cursor-pointer active:scale-90
                transition duration-150 text-[#589442] bg-white px-10 py-4 shadow-md rounded-full"
              >
                Connexion{" "}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
