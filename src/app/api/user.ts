import { userProps } from "@/dataTypes";
import { db } from "@/utils/firebaseconfig";
// import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import {
  collection,
  // getDocs,
  // where,
  // query,
  doc,
  getDocs,
  getDoc,
  query,
  setDoc,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
export async function createUser(userData: userProps) {
  const docRef = doc(db, "Users", userData.userId);
  await setDoc(docRef, userData);
  return;
}
// upload profile image

// export const uploadImageFile = async (path: string, file: File) => {
//   const storage = getStorage();
//   const storageRef = ref(storage, path);
//   let url = "";

//   try {
//     const snapshot = await uploadBytes(storageRef, file);
//     url = await getDownloadURL(snapshot.ref);
//   } catch (error) {
//     console.error("Upload error:", error);
//     throw error; // Re-throw the error after logging it
//   }

//   return url;
// };

// show user profile
export const getShowUser = async () => {
  const showUser = collection(db, "Users");
  const q = query(showUser);
  const querySnapshot = await getDocs(q);

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
      links: data.links || "",
    });
  });
  return users;
};

export const linksOfUsersAndFirstNameAndLastName = async (
  userId: any,
  newLink?: string[]
) => {
  try {
    const userItemRef = doc(db, "Users", userId);
    await setDoc(
      userItemRef,
      {
        links: newLink,
      },
      { merge: true }
    );

  } catch (error) {
    console.error("Error updating in firebase:", error);
    throw error;
  }
};

export const UpdateImage = async (userId: any, newProfileImage?: string) => {
  try {
    const userItemRef = doc(db, "Users", userId);
    await setDoc(
      userItemRef,
      {
        profileImage: newProfileImage,
      },
      { merge: true }
    );

  } catch (error) {
    console.error("Error updating in firebase:", error);
    throw error;
  }
};
export const updateFirstNameLastName = async (
  userId: any,
  newFirstName?: string,
  newLastName?: string
) => {
  try {
    const userItemRef = doc(db, "Users", userId);
    await setDoc(
      userItemRef,
      {
        firstName: newFirstName,
        lastName: newLastName,
      },
      { merge: true }
    );

  } catch (error) {
    console.error("Error updating in firebase:", error);
    throw error;
  }
};
