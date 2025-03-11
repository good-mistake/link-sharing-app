"use client";
import { useEffect, useState } from "react";
import { getProfileById } from "../../../services/services";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

import Image from "next/image.js";
type UserType = {
  _id: string;
  firstName: string;
  lastName: string;
  profileEmail: string;
  accountEmail: string;
  profilePicture?: string;
  links: { _id: string; url: string; platform: string; color: string }[];
};

const Preview = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const userId = pathname?.split("/").pop();
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !userId) return;
    const fetchUser = async () => {
      setLoading(true);
      setSuccess(false);
      try {
        const data = await getProfileById(userId);
        setUser(data.profile);
        setLoading(false);
        setError(false);
      } catch (error) {
        setLoading(false);
        setError(true);
        console.error(error);
      }
    };

    fetchUser();
  }, [userId, isMounted]);

  const handlePreviewBtn = () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    router.push(`/home`);
  };
  console.log(user);
  console.log(userId);

  const handleShare = () => {
    if (!user?._id) return;
    const url = `${window.location.origin}/preview/${user._id}`;
    navigator.clipboard.writeText(url);
    setSuccess(true);
  };
  if (!isMounted) return null;
  return (
    <div>
      {error ? (
        <div className="h-screen flex items-center justify-center bg-red-100">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-lg rounded-lg p-6 text-center max-w-md"
          >
            <p className="text-gray-600 mt-2">{error}</p>
            <p className="text-sm text-gray-500 mt-1">
              There was an error please refresh the page or comeback later
            </p>
          </motion.div>
        </div>
      ) : (
        <div>
          {loading ? (
            <div className="absolute inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-6 rounded-xl shadow-2xl flex flex-col items-center"
              >
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#633CFF]"></div>
                <p className="text-gray-700 mt-4">Loading profile...</p>
              </motion.div>
            </div>
          ) : (
            <div className="">
              <div className=" ">
                <header className=" top-0 left-0 right-0 bg-[#633CFF] p-4 rounded-t-lg z-10">
                  <button className="previewBtn" onClick={handlePreviewBtn}>
                    Back to Editor
                  </button>
                  <button
                    onClick={handleShare}
                    className="saveBtn flex justify-center items-center gap-2 cursor-pointer"
                  >
                    Share Link
                  </button>
                </header>
                <main className="absolute bg-white p-6 rounded-xl shadow-2xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center bg-white p-8 rounded-lg shadow-xl">
                  <div>
                    {user?.profilePicture && (
                      <Image
                        src={user?.profilePicture || ""}
                        alt="profilePic"
                        width={104}
                        height={104}
                        className="rounded-full  border-[5px] border-[#633CFF] aspect-square"
                      />
                    )}
                    <p
                      style={{
                        top: `${174}px`,
                        left: "50%",
                        transform: "translateX(-50%)",
                      }}
                      className=" bg-white userName w-[237px] text-center"
                    >
                      <span> {user?.firstName}</span>
                      <span> {user?.lastName}</span>
                    </p>
                    <p
                      style={{
                        top: `${200}px`,
                        left: "50%",
                        transform: "translateX(-50%)",
                      }}
                      className=" userEmail w-[237px] text-center"
                    >
                      {user?.profileEmail}
                    </p>{" "}
                    {user?.links.map((link, index) => (
                      <>
                        <div
                          key={index}
                          style={{
                            backgroundColor: link ? link.color : "white",
                            top: `${272 + index * 60}px`,
                            left: "50%",
                            transform: "translateX(-50%)",
                          }}
                          className=" w-[237px] h-[44px] p-4 rounded-lg flex justify-between items-center"
                        >
                          <Image
                            src={`${
                              link.platform === "Frontendmentor"
                                ? "/images/icon-frontend-mentor.svg"
                                : link.platform === "Stackoverflow"
                                ? "/images/icon-stack-overflow.svg"
                                : `/images/icon-${link.platform.toLowerCase()}.svg`
                            }`}
                            alt={link.platform}
                            width={22}
                            height={22}
                            className="invert sepia brightness-0 hue-rotate-180"
                          />
                          <p className="text-white">{link.platform}</p>
                          <Image
                            src={`/images/icon-arrow-right.svg`}
                            onClick={() => window.open(link.url, "_blank")}
                            alt="arrow right"
                            className="cursor-pointer"
                          />
                        </div>
                      </>
                    ))}
                  </div>
                </main>
              </div>
            </div>
          )}
          {success ? (
            <div className=" top-1/4 left-1/2 transform -translate-x-1/2 bg-[#333333] text-white p-4 rounded-lg shadow-lg">
              <Image
                src="icon-link-copied-to-clipboard.svg"
                alt="copied"
                className="rounded-full  aspect-square invert sepia brightness-0 hue-rotate-180"
              />
              <p>The link has been copied to your clipboard!</p>
            </div>
          ) : (
            ""
          )}
        </div>
      )}
    </div>
  );
};

export default Preview;
