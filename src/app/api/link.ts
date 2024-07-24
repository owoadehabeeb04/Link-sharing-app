import { linkProps } from "@/dataTypes";
import { db } from "@/utils/firebaseconfig";
import {
  collection,
  getDocs,
  query,
  doc,
  setDoc,
  where,
} from "firebase/firestore";

export const createLinkCollection = async (link: linkProps) => {
  const linkref = collection(db, "Links");
  const linkDocRef = doc(linkref);
  await setDoc(linkDocRef, link);
  const orderIdd = linkDocRef.id;
  return orderIdd;
};

export const getShowLink = async () => {
  const showLink = collection(db, "Links");
  const q = query(showLink);
  const querySnapshot = await getDocs(q);

  let links = [] as linkProps[];

  querySnapshot.forEach((doc) => {
    links.push({
      name: doc.data().name ?? doc.data().name,
      link: doc.data().the_link ?? doc.data().link,
      userId: doc.data().userId ?? doc.data().userId,
      backgroundColor: doc.data().backgroundColor ?? doc.data().backgroundColor,
    });
  });
  console.log(links);
  return links;
};

export const getShowLinkOfCurrentUser = async (userId: any) => {
  const showLink = collection(db, "Links");
  const q = query(showLink, where("userId", "==", userId));

  try {
    const querySnapshot = await getDocs(q);

    console.log(querySnapshot);
    let links = [] as linkProps[];

    querySnapshot.forEach((doc) => {
      links.push({
        name: doc.data().name ?? doc.data().name,
        link: doc.data().the_link ?? doc.data().link,
        userId: doc.data().userId ?? doc.data().userId,
        backgroundColor:
          doc.data().backgroundColor ?? doc.data().backgroundColor,
      });
    });

    console.log(links);
    return links;
  } catch (error) {
    console.error("Error fetching links for current user:", error);
    return [];
  }
};

