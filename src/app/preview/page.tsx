"use client";
import { useEffect, useState } from "react";
import { getProfile } from "../../services/services.js";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const data = await getProfile();

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
  }, []);
  const handlePreviewBtn = () => {
    if (!user) return;

    router.push(`/home`);
  };
  console.log(user);
  return (
    <div>
      {error ? (
        <p>There was an error please refresh the page or comeback later</p>
      ) : (
        <div>
          {loading ? (
            <div></div>
          ) : (
            <div>
              <header>
                <button className="previewBtn" onClick={handlePreviewBtn}>
                  Back to Editor
                </button>
                <button className="saveBtn flex justify-center items-center gap-2 cursor-pointer">
                  Share Link
                </button>
              </header>
              <main className="flex flex-col justify-center items-center">
                <div>
                  <Image
                    src={user?.profilePicture || ""}
                    alt="profilePic"
                    width={104}
                    height={104}
                    className="rounded-full absolute border-[5px] border-[#633CFF] aspect-square"
                  />{" "}
                  <p
                    style={{
                      top: `${174}px`,
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                    className="absolute bg-white userName w-[237px] text-center"
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
                    className="absolute userEmail w-[237px] text-center"
                  >
                    {user?.profileEmail}
                  </p>{" "}
                  {user?.links.map((link) => {
                    return (
                      <>
                        <div
                          key={link._id}
                          style={{
                            backgroundColor: link ? link.color : "white",
                            top: `${272 + 60}px`,
                            left: "50%",
                            transform: "translateX(-50%)",
                          }}
                          className="absolute w-[237px] h-[44px] p-4 rounded-lg flex justify-between items-center"
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
                    );
                  })}
                </div>
              </main>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Preview;
