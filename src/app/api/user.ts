import { userProps } from "@/dataTypes";
import { db } from "@/utils/firebaseconfig";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import {
  collection,
  // getDocs,
  // where,
  // query,
  doc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";
export async function createUser(userData: userProps) {
  const docRef = doc(db, "Users", userData.userId);
  await setDoc(docRef, userData);
  return;
}
// upload profile image
export const uploadImageFile = async (path: string, file: any) => {
  const storage = getStorage();
  const storageRef = ref(storage, path);
  let url = "";
  // 'file' comes from the Blob or File API
  await uploadBytes(storageRef, file).then(async (snapshot: { ref: any }) => {
    await getDownloadURL(snapshot.ref).then((downloadURL: string) => {
      url = downloadURL;
    });
  });
  return url;
};
// show user profile
export const getShowUser = async () => {
  const showUser = collection(db, "Users");
  const q = query(showUser);
  const querySnapshot = await getDocs(q);

  console.log(querySnapshot);
  let users = [] as userProps[];

  querySnapshot.forEach((doc) => {
    const data = doc.data();

    users.push({
      firstName: data.firstName || "",
      profileImage: data?.profileImage || "",
      lastName: data.lastName || "",
      email: data.email || "",
      userId: data.userId || "",
      password: data.password || "",
    });
  });
  console.log(users);
  return users;
};
