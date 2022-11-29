import { NextPage } from "next";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  collection,
  DocumentData,
  getDocs,
  query,
  QueryDocumentSnapshot,
  where,
} from "firebase/firestore";
import Image from "next/image";
import { db } from "../utils/firebase/clientApp";
import Header from "../components/Header";
import { useLoadScript } from "@react-google-maps/api";
import Map from "../components/Map";
import { StarIcon } from "@heroicons/react/solid";

const Search: NextPage = () => {

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });
  
  const router = useRouter();
  let search_from_query = router.query.ville;

  const { data: session } = useSession<boolean>();
  const [loading, setLoading] = useState<boolean>(true);
  const [restaurants, setRestaurants] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);

  useEffect(() => {
    if (search_from_query === undefined || session === undefined) return;
    if (session === null) {
      router.push("/");
      return;
    }
    if (typeof search_from_query === "string") {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      search_from_query = search_from_query.toUpperCase();
      
      console.log(search_from_query);
      getRestaurants();
      setLoading(false);
    }
  }, [search_from_query, session]);

  const restaurantsCollection = collection(db, "restaurants");

  const getRestaurants = async () => {

    const restauQuery = query(
      restaurantsCollection,
      // where('title', '>=', search_from_query.search),where('title', '<=', search_from_query.search + '~')
      where("city", ">=", search_from_query),
      where("city", "<=", search_from_query + "\uf8ff")
    );
    const querySnapshot = await getDocs(restauQuery);
    const result: QueryDocumentSnapshot<DocumentData>[] = [];
    querySnapshot.forEach((snapshot) => {
      result.push(snapshot);
    });
    // console.log("restaurants DB: ", result);
    // console.log("search: ", search_from_query);
    setRestaurants(result);
  };

    // console.log("search: ", search_from_query);
    // console.log("type: ", typeof search_from_query);

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        {session ? (
          <>
            <div className={styles.grid}>
              {<div className={styles.section_restau}>
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
              </div> }
              <div id="map" className="sticky top-0 w-[50%]">
                {isLoaded && <Map restaurants={restaurants} />}
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </main>
    </div>
  );
};

export default Search;
