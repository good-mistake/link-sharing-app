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
        console.log(data);
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

  const handleShare = () => {
    if (!user?._id) return;
    const url = `${window.location.origin}/preview/${user._id}`;
    navigator.clipboard.writeText(url);
    setSuccess(true);
  };
  if (!isMounted) return null;
  return (
    <div className="min-h-[140vh] flex flex-col">
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
            <div className="absolute inset-0 flex justify-center items-center bg-[#633CFF] ">
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
            <div className="mb-6">
              <div>
                <header className="bg-[#633CFF] p-4 rounded-bl-[1rem] rounded-br-[1rem] rounded-tl-[0rem] rounded-tr-[0rem] z-10 min-h-[60vh]">
                  <div className="w-[100%] p-2 shadow-lg shadow-[#633CFF]/50 flex mt-2 justify-between items-center bg-white  rounded-lg shadow-xl">
                    <button className="backBtn" onClick={handlePreviewBtn}>
                      Back to Editor
                    </button>
                    <button
                      onClick={handleShare}
                      className="shareLink flex justify-center items-center gap-2 cursor-pointer "
                    >
                      Share Link
                    </button>
                  </div>
                </header>
                <main
                  className="min-h-[45vh] w-[340px] absolute bg-white rounded-[24px] 
                  shadow-2xl top-[75%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                  flex flex-col justify-center items-center bg-white p-8 
                 shadow-xl"
                >
                  <div className="flex flex-col justify-center items-center">
                    {user?.profilePicture && (
                      <Image
                        src={user?.profilePicture || ""}
                        alt="profilePic"
                        width={105}
                        height={105}
                        className="rounded-full mb-6 border-[4px] border-[#633CFF] aspect-square "
                      />
                    )}
                    <p
                      style={{
                        top: `${174}px`,
                        left: "50%",
                      }}
                      className=" bg-white userNameP w-[237px] text-center  mb-2"
                    >
                      <span> {user?.firstName}</span>
                      <span> {user?.lastName}</span>
                    </p>
                    <p
                      style={{
                        top: `${200}px`,
                        left: "50%",
                      }}
                      className=" userEmail w-[237px] text-center mb-[56px]"
                    >
                      {user?.profileEmail}
                    </p>
                    {user?.links.map((link, index) => (
                      <>
                        <div
                          key={index}
                          style={{
                            backgroundColor: link ? link.color : "white",
                          }}
                          className="shadow-xl mb-4 w-[237px] h-[56px] p-4 rounded-lg flex justify-between items-center"
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
        </div>
      )}
      <div className="relative min-h-[140vh] flex flex-col">
        {success && (
          <div
            className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[400px] flex justify-center 
    items-center bg-[#333333] text-[#737373] p-4 rounded-[12px] shadow-lg"
          >
            <Image
              src="/images/icon-link-copied-to-clipboard.svg"
              alt="copied"
              width={15}
              height={15}
              className="w-[15px] h-[15px] mix-blend-multiply"
            />
            <p className="text-white text-center ml-2">
              The link has been copied to your clipboard!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;
