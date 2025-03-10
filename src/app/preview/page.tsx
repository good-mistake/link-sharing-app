"use client";
import { useEffect, useState } from "react";
import { getProfile } from "../../services/services.js";
type UserType = {
  _id: string;
  firstName: string;
  lastName: string;
  profileEmail: string;
  accountEmail: string;
  profilePicture?: string;
  links: { _id: string; url: string; platform: string }[];
};
const Preview = () => {
  const [user, setUser] = useState<UserType | null>(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getProfile();

        setUser(data.profile);
      } catch (error) {
        console.error(error);
        localStorage.removeItem("token");
      }
    };

    fetchUser();
  }, []);
  console.log(user);
  return <div>sasda</div>;
};

export default Preview;
