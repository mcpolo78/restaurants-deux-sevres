import { NextPage } from "next";
import { useRouter } from "next/router";
import styles from "../../styles/Home.module.css";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  DocumentData,
  getDocs,
  limit,
  query,
  QueryDocumentSnapshot,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import Image from "next/image";
import { db } from "../../utils/firebase/clientApp";
import StarsRating from "react-star-rate";
import Header from "../../components/Header";
import { StarIcon } from "@heroicons/react/solid";

const Restaurant: NextPage = () => {
  const router = useRouter();
  const location_from_query = router.query.location_id;

  const { data: session } = useSession<boolean>();
  const [loading, setLoading] = useState<boolean>(true);
  const [restaurant, setRestaurant] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);
  const [id_doc, setIdDoc] = useState<string>( Date.now().toString());
  const [starValue, setStarValue] = useState<number>(0);

  const [location_id, setLocation_id] = useState<number>(0);

  useEffect(() => {

    if (location_from_query === undefined || session === undefined) return;
    if (session === null){
      router.push('/');
      return
    }
      
    setLocation_id(Number(location_from_query));
    // console.log("type: ", typeof location_id);
    getRestaurant();
    getReviews();
    setLoading(false);
  }, [location_id, session]);

  const restaurantsCollection = collection(db, "restaurants");
  const ratingsCollection = collection(db, "ratings");

  const getRestaurant = async () => {
    const restauQuery = query(
      restaurantsCollection,
      where("location_id", "==", location_id)
    );

    const querySnapshot = await getDocs(restauQuery);
    const result: QueryDocumentSnapshot<DocumentData>[] = [];
    querySnapshot.forEach((snapshot) => {
      result.push(snapshot);
    });
    // console.log("restaurants DB: ", result);
    setRestaurant(result);
  };

  const getReviews = async () => {
    const ratingsQuery = query(
      ratingsCollection,
      where("id_location", "==", location_id),
      where("user", "==", session?.user?.email!),
    );

    const querySnapshot = await getDocs(ratingsQuery);
    const result: QueryDocumentSnapshot<DocumentData>[] = [];
    querySnapshot.forEach((snapshot) => {
      result.push(snapshot);
    });
    // console.log('ratings db: ', result);

    result.map((res, index) => {
        // console.log(res.data());
        setIdDoc(res.id);
        setStarValue(res.data().note);

    })
        // res.exists
  };

  // console.log("location_id: ", location_id);
  // console.log("result db : ", restaurant);

  const updateRating = async (id_doc: string, location_id: number, note: number) => {
    const docRef = doc(db, `ratings/${id_doc}`);

    const data = {
      id_location: location_id,
      note: note,
      user: session.user.email
    };

    await setDoc(docRef, data);
  };

  // console.log(session);

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <h1 className={styles.title}>Noter ce restaurant</h1>

        {session && (
          <>
            <div className="mt-5">
              <div className="mb-5">
                {loading ? (
                  <div className={styles.card}>
                    <h2>Loading</h2>
                  </div>
                ) : (
                  restaurant.map((restaurant, index) => {
                    return (
                      <div className="flex py-7 px-2 border pr-4" key={index}>
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

                        <div className={styles.cardActions}>
                          <StarsRating
                            key={index}
                            value={starValue}
                            allowHalf={false}
                            onChange={(value) => {
                              setStarValue(value);
                              updateRating(id_doc, location_id, value!);
                            }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Restaurant;
