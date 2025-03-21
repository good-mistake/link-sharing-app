"use client";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CustomSelect from "../customselect/Customselect";
import { motion, AnimatePresence } from "framer-motion";
import {
  updateProfile,
  getProfile,
  deleteLink,
} from "../../services/services.js";
import mongoose from "mongoose";
import AnimatedButton from "../animationBtn/AnimatedBtn";
import { platforms } from "../customselect/Customselect";
type UserType = {
  _id: string;
  firstName: string;
  lastName: string;
  profileEmail: string;
  accountEmail: string;
  profilePicture?: string;
  links: {
    _id: string | number;
    url: string;
    platform: string;
    color: string;
  }[];
};
const platformDomains: Record<string, string> = {
  GitHub: "github.com",
  Twitter: "twitter.com",
  Youtube: "youtube.com",
  LinkedIn: "linkedin.com",
  Facebook: "facebook.com",
  Frontendmentor: "frontendmentor.io",
  Gitlab: "gitlab.com",
  Freecodecamp: "freecodecamp.org",
  Stackoverflow: "stackoverflow.com",
  Twitch: "twitch.tv",
  Devto: "dev.to",
  Codepen: "codepen.io",
  CodeWars: "codewars.com",
  Hashnode: "hashnode.com",
};
export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [profiles, setProfiles] = useState<UserType[]>([]);
  const [links, setLinks] = useState<
    { _id: string; url: string; platform: string; color: string }[]
  >([]);

  const [showIntro, setShowIntro] = useState(true);
  const [newLinks, setNewLinks] = useState<
    { id: number; url: string; platform: string; color: string }[]
  >([]);
  const [linkOrProfile, setLinksOrProfile] = useState<boolean>(false);
  // const [selectedPlatform, setSelectedPlatform] = useState("");
  // const [selectedColor, setSelectedColor] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [loadingLinks, setLoadingLinks] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingRemoveLink, setLoadingRemoveLink] = useState(false);
  const [successLinks, setSuccessLinks] = useState(false);
  const [successDeleteLinks, setSuccessDeleteLinks] = useState(false);
  const [successProfile, setSuccessProfile] = useState(false);
  const [errorMessageImg, setErrorMessageIMG] = useState<string | null>(null);
  const [errorMessageProfile, setErrorMessageProfile] = useState<string | null>(
    null
  );
  const [errorMessageLinks, setErrorMessageLinks] = useState<string | null>(
    null
  );

  const handlePreviewBtn = () => {
    if (!user) return;
    startTransition(() => {
      router.push(`preview/${user._id}`);
    });
  };
  const addNewLink = () => {
    setShowIntro(false);

    setNewLinks((prevLinks) => [
      ...prevLinks,
      {
        id: prevLinks.length + 1,
        url: "",
        platform: /*selectedPlatform ||*/ "",
        color: "",
      },
    ]);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      try {
        const data = await getProfile();

        setUser(data.profile);
        setLinks(data.profile.links);
      } catch (error) {
        console.error(error);
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);
  const isValidPlatformUrl = (url: string, platform: string) => {
    try {
      const domain = new URL(url).hostname;
      const expectedDomain = platformDomains[platform];

      if (!expectedDomain) return false;

      return domain.includes(expectedDomain);
    } catch (error) {
      console.error("Invalid URL:", error);
      return false;
    }
  };

  const handlePlatformChange = (platform: string, id: number) => {
    const platformColor =
      platforms.find((p) => p.value === platform)?.color || "";
    setNewLinks((prevLinks) =>
      prevLinks.map((link) =>
        link.id === id ? { ...link, platform, color: platformColor } : link
      )
    );
  };

  const handleSaveLinks = async () => {
    setLoadingLinks(true);
    setSuccessLinks(false);
    setErrorMessageLinks(null);

    if (!user) {
      setLoadingLinks(false);
      return;
    }
    if (newLinks.length === 0) {
      setErrorMessageLinks("Please add at least one link before saving.");
      setLoadingLinks(false);
      return;
    }
    for (const link of newLinks) {
      if (!link.url || !link.platform) {
        setErrorMessageLinks("Please fill out all links before saving.");
        setLoadingLinks(false);
        return;
      }

      if (!isValidPlatformUrl(link.url, link.platform)) {
        setErrorMessageLinks(
          `Invalid URL for ${link.platform}. Please provide a valid ${link.platform} URL.`
        );
        setLoadingLinks(false);
        return;
      }
    }
    try {
      const formattedNewLinks = newLinks.map((link) => ({
        _id: new mongoose.Types.ObjectId().toString(),
        url: link.url,
        platform: link.platform,
        color: link.color,
      }));

      const updatedProfile = {
        ...user,
        links: [...links, ...formattedNewLinks],
      };

      await updateProfile({
        ...updatedProfile,
        links: updatedProfile.links.map((link) => ({
          ...link,
          _id: new mongoose.Types.ObjectId(link._id),
        })),
      });
      setUser(updatedProfile);
      setLinks(updatedProfile.links);
      setNewLinks([]);
      showSuccessLinks();
    } catch (error) {
      console.error("Failed to save links:", error);
      setErrorMessageLinks("Error saving links. Please try again.");
      setSuccessLinks(false);
    } finally {
      setLoadingLinks(false);
    }
  };
  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to upload image");

    const data = await res.json();
    return data.imageUrl;
  };

  const handleSaveProfile = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoadingProfile(true);
    setSuccessProfile(false);
    setErrorMessageProfile(null);

    if (!user) return;

    const firstName = (document.getElementById("name") as HTMLInputElement)
      .value;
    const lastName = (document.getElementById("lastName") as HTMLInputElement)
      .value;
    const profileEmail = (document.getElementById("email") as HTMLInputElement)
      .value;

    if (!firstName || !lastName || !profileEmail) {
      setErrorMessageProfile("All the fields are required.");
      setLoadingProfile(false);
      setLoading(false);
      return;
    }

    try {
      const profileData: Partial<UserType> = {
        ...user,
        firstName,
        lastName,
        profileEmail,
      };

      if (selectedImage) {
        try {
          profileData.profilePicture = await handleImageUpload(selectedImage);
        } catch (error) {
          console.error("Image upload error:", error);
          setErrorMessageProfile("Image upload failed.");
          setLoadingProfile(false);
          return;
        }
      }
      const updatedProfiles: UserType[] = profiles.map((profile) => ({
        _id: profile._id || new mongoose.Types.ObjectId().toString(),
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        profileEmail: profile.profileEmail || "",
        accountEmail: profile.accountEmail || "",
        profilePicture: profile.profilePicture || "",
        links: profile.links || [],
      }));
      setProfiles(updatedProfiles);

      await updateProfile(profileData);
      setUser({ ...user, ...profileData });
      showSuccessProfile();
      setErrorMessageProfile(null);
    } catch (error) {
      console.error("Failed to update profile:", error);
      setErrorMessageProfile("Error saving profile. Please try again.");
    } finally {
      setLoadingProfile(false);
      setLoading(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setErrorMessageIMG("No file selected.");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setErrorMessageIMG(
        "Invalid file type. Please upload a JPEG, PNG, GIF, or WEBP."
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessageIMG(
        "File size exceeds 5MB. Please choose a smaller file."
      );
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
    setErrorMessageIMG(null);
    setSelectedImage(file);
  };
  useEffect(() => {
    if (user?.links && user?.links.length > 0) {
      setShowIntro(false);
    }
  }, [user?.links]);
  const showSuccessLinks = () => {
    setSuccessLinks(true);
    setTimeout(() => {
      setSuccessLinks(false);
    }, 3000);
  };
  const showSuccessProfile = () => {
    setSuccessProfile(true);
    setTimeout(() => {
      setSuccessProfile(false);
    }, 3000);
  };
  const removeLink = async (id: number | string) => {
    setLoadingRemoveLink(true);
    try {
      await deleteLink(id);

      const updatedLinks = links.filter((link) => link._id !== id);
      const updatedNewLinks = newLinks.filter((link) => link.id !== id);
      setLinks(updatedLinks);
      setNewLinks(updatedNewLinks);
      if (updatedLinks.length === 0) {
        setShowIntro(true);
      }

      setSuccessDeleteLinks(true);
      setTimeout(() => {
        setSuccessDeleteLinks(false);
      }, 3000);
    } catch (error) {
      console.error("Error deleting link:", error);
    } finally {
      setLoadingRemoveLink(false);
    }
  };

  return (
    <div className="p-0 sm:p-4 homeContainerPage">
      {loading ? (
        <div className="loading-overlay flex justify-center items-center w-full h-screen">
          <motion.div
            className="w-20 h-20 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        </div>
      ) : (
        <>
          <header className="flex justify-between items-center">
            <div className="mainLogo">
              <Image
                src="/images/logo-devlinks-large.svg"
                alt="logo"
                width="146"
                height="32"
                priority
              />
            </div>
            <div className="flex ">
              <div
                className={`flex links items-center justify-center ${
                  !linkOrProfile ? "links--active" : "links--notActive"
                }`}
                onClick={() => setLinksOrProfile(false)}
              >
                <div
                  className={`w-6 h-6 sm:w-4 sm:h-4  ${
                    !linkOrProfile ? "bg-[#633CFF]" : "bg-[#737373]"
                  }`}
                  style={{
                    maskImage: `${"url(/images/icon-link.svg)"}`,
                    WebkitMaskImage: `${"url(/images/icon-link.svg)"}`,
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskSize: "contain",
                    WebkitMaskSize: "contain",
                  }}
                />

                <p className={`${!linkOrProfile ? "active" : "notActive"}`}>
                  Links
                </p>
              </div>
              <div
                className={`flex profileDetail items-center ${
                  linkOrProfile
                    ? "profileDetail--active"
                    : "profileDetail--notActive"
                }`}
                onClick={() => setLinksOrProfile(true)}
              >
                <div
                  className={`w-7 h-7 sm:w-5 sm:h-5 ${
                    linkOrProfile ? "bg-[#633CFF]" : "bg-[#737373]"
                  }`}
                  style={{
                    maskImage: `${"url(/images/icon-profile-details-header.svg)"}`,
                    WebkitMaskImage: `${"url(/images/icon-profile-details-header.svg)"}`,
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskSize: "contain",
                    WebkitMaskSize: "contain",
                  }}
                />
                <p className={`${linkOrProfile ? "active" : "notActive"}`}>
                  Profile Details
                </p>
              </div>
            </div>
            <AnimatedButton
              className={`previewBtn ${isPending ? "loading" : ""}`}
              onClick={handlePreviewBtn}
            >
              {isPending ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className=" rounded-xl  flex flex-col items-center"
                >
                  <div className="animate-spin rounded-full h-5 w-5 border-b-4 border-[#633CFF]"></div>
                </motion.div>
              ) : (
                <span>Preview</span>
              )}
            </AnimatedButton>
          </header>
          <main className="maincontent flex mb-8">
            <section className="preview ">
              {links.length > 0 || user?.profilePicture ? (
                <div
                  style={{
                    backgroundImage:
                      "url('/images/illustration-phone-mockup.svg')",
                  }}
                  className="rounded-lg relative bg-no-repeat bg-cover bg-center  w-[300px] h-[618px]"
                >
                  {user?.profilePicture && (
                    <Image
                      src={`${user?.profilePicture}`}
                      alt={`profile pic`}
                      width={100}
                      height={100}
                      className="rounded-full absolute border-[5px] border-[#633CFF] aspect-square"
                      style={{
                        top: `${66}px`,
                        left: "50%",
                        transform: "translateX(-50%)",
                      }}
                    />
                  )}

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
                  </p>
                  {Array.from({ length: 5 }).map((_, index) => {
                    const link = links[index];
                    return (
                      <>
                        {link ? (
                          <div
                            key={index}
                            style={{
                              backgroundColor: link ? link.color : "white",
                              top: `${272 + index * 60}px`,
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
                        ) : (
                          <div
                            style={{
                              backgroundColor: "white",
                              top: `${270 + index * 60}px`,
                              left: "50%",
                              transform: "translateX(-50%)",
                            }}
                            className="absolute w-[237px] h-[60px] p-4 rounded-lg flex justify-between items-center"
                          ></div>
                        )}
                      </>
                    );
                  })}
                </div>
              ) : (
                <Image
                  src="/images/illustration-phone-mockup.svg"
                  alt="logo"
                  width={300}
                  height={618}
                />
              )}
            </section>
            <section className="addLink ">
              <AnimatePresence mode="wait">
                <motion.div
                  key={linkOrProfile ? "profile" : "links"}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  {!linkOrProfile ? (
                    <>
                      <h1>Customize your links</h1>
                      <p>
                        Add/edit/remove links below and then share all your
                        profiles with the world!
                      </p>
                      <div className="addLinkSection">
                        <button onClick={addNewLink} className="addLinkBtn">
                          + Add new link
                        </button>
                        {successDeleteLinks && (
                          <motion.div
                            className="w-full mb-4 text-red-600 bg-red-100 border border-red-400 px-4 py-2 rounded-lg flex items-center gap-2"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            Link Deleted successfully!
                          </motion.div>
                        )}
                        {showIntro ? (
                          <div className="flex flex-col justify-center items-center start">
                            <Image
                              src="/images/illustration-empty.svg"
                              alt="logo"
                              className="w-[125px] sm:w-[250px] h-[80px] sm:h-[818px]"
                            />
                            <h2>Let’s get you started</h2>
                            <p className="text-center p-0 sm:px-20">
                              Use the “Add new link” button to get started. Once
                              you have more than one link, you can reorder and
                              edit them. We’re here to help you share your
                              profiles with everyone!
                            </p>
                          </div>
                        ) : (
                          <AnimatePresence>
                            {links.map((link) => (
                              <div
                                style={{
                                  backgroundColor: link ? link.color : "white",
                                }}
                                key={link._id}
                                className="createdLinks w-[100%] h-[50px] p-4 rounded-lg flex justify-between items-center mb-4"
                              >
                                <div className=" flex justify-between items-center">
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
                                    className="invert sepia brightness-0 hue-rotate-180 mr-4"
                                  />
                                  <Image
                                    src={`/images/icon-arrow-right.svg`}
                                    onClick={() =>
                                      window.open(link.url, "_blank")
                                    }
                                    alt="arrow right"
                                    className="cursor-pointer"
                                  />
                                </div>
                                <p className="text-white">{link.platform}</p>
                                <AnimatedButton
                                  onClick={() => removeLink(link._id)}
                                  className="text-white w-[60px] h-[25px]"
                                >
                                  {loadingRemoveLink ? (
                                    <span className="w-5 h-5 border-4 border-solid border-white border-t-transparent rounded-full animate-spin inline-block"></span>
                                  ) : (
                                    "Remove"
                                  )}
                                </AnimatedButton>
                              </div>
                            ))}
                            {newLinks.map((link, index) => (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                key={link.id}
                                className="linksAndPlatform items-center gap-2 mt-4"
                              >
                                <div className="flex justify-between number">
                                  <div className="flex items-center justify-center">
                                    <Image
                                      src="/images/icon-drag-and-drop.svg"
                                      alt="logo"
                                      width={12}
                                      height={6}
                                    />
                                    <span>Link #{index + 1}</span>
                                  </div>{" "}
                                  <AnimatedButton
                                    onClick={() => removeLink(link.id)}
                                    className="text-white w-[60px] h-[25px]"
                                  >
                                    {loadingRemoveLink ? (
                                      <span className="w-5 h-5 border-4 border-solid border-[rgb(51, 51, 51)] border-t-transparent rounded-full animate-spin inline-block"></span>
                                    ) : (
                                      "Remove"
                                    )}
                                  </AnimatedButton>
                                </div>
                                <CustomSelect
                                  selected={link.platform}
                                  setSelected={(platform) =>
                                    handlePlatformChange(platform, link.id)
                                  }
                                  setSelectedColor={(color) => {
                                    setNewLinks((prevLinks) =>
                                      prevLinks.map((l) =>
                                        l.id === link.id ? { ...l, color } : l
                                      )
                                    );
                                  }}
                                />

                                <div>
                                  <p className="lpt">Link</p>
                                  <div className="flex items-center border rounded-lg  w-100 px-4">
                                    <Image
                                      src="/images/icon-links-header.svg"
                                      alt="logo"
                                      width={20}
                                      height={20}
                                      className="mr-2 "
                                    />
                                    <input
                                      type="text"
                                      className="flex-1 py-3 linkUrl overflow-hidden text-ellipsis whitespace-nowrap bg-white placeholder-opacity-50"
                                      placeholder="e.g. https://www.github.com/johnappleseed"
                                      value={link.url}
                                      onChange={(e) => {
                                        const updatedLinks = newLinks.map((l) =>
                                          l.id === link.id
                                            ? { ...l, url: e.target.value }
                                            : l
                                        );
                                        setNewLinks(updatedLinks);
                                      }}
                                    />
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        )}
                      </div>
                      {errorMessageLinks && (
                        <div className="text-red-600 bg-red-100 border border-red-400 px-4 py-2 rounded-md text-sm mt-2 animate-fadeIn">
                          {errorMessageLinks}
                        </div>
                      )}
                      {successLinks && (
                        <motion.div
                          className="w-full bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg flex items-center gap-2"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          Links created successfully!
                        </motion.div>
                      )}

                      <div className="flex justify-end ">
                        <AnimatedButton
                          onClick={handleSaveLinks}
                          className="saveBtn  flex justify-center items-center gap-2 cursor-pointer"
                        >
                          {loadingLinks ? (
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          ) : (
                            "Save"
                          )}
                        </AnimatedButton>
                      </div>
                    </>
                  ) : (
                    <form className="detailsForm" onSubmit={handleSaveProfile}>
                      <h1>Profile Details</h1>
                      <p>
                        Add your details to create a personal touch to your
                        profile.
                      </p>
                      <div className="addLinkSection">
                        <div className="imageUploadSection">
                          <div className="flex mt-16 ">
                            <p>Profile picture</p>
                            <label
                              htmlFor="profileImage"
                              className=" cursor-pointer"
                            >
                              {previewImage || user?.profilePicture ? (
                                <div
                                  style={{
                                    backgroundImage: `url(${
                                      previewImage || user?.profilePicture
                                    })`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                    borderRadius: "12px",
                                    width: "193px",
                                    height: "193px",
                                  }}
                                  className="flex items-center flex-col justify-center"
                                >
                                  <Image
                                    src={"/images/icon-upload-image.svg"}
                                    alt="Upload"
                                    width={40}
                                    height={40}
                                    className="rounded-xl invert sepia brightness-0 hue-rotate-180"
                                  />
                                  <span>+ Change Image</span>
                                </div>
                              ) : (
                                <>
                                  <Image
                                    src="/images/icon-upload-image.svg"
                                    alt="Upload"
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                  />
                                  + Upload Image
                                </>
                              )}
                            </label>
                            <p>
                              Image must be below 1024x1024px. Use PNG or JPG
                              format.
                            </p>
                          </div>

                          <input
                            type="file"
                            id="profileImage"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden "
                          />
                        </div>
                        <div className="descriptions">
                          <label htmlFor="name">
                            <p>First name*</p>
                            <input
                              type="text"
                              id="name"
                              placeholder="e.g. John"
                              className="overflow-hidden text-ellipsis whitespace-nowrap placeholder-opacity-50"
                            />
                          </label>
                          <label htmlFor="lastName">
                            <p>Last name*</p>
                            <input
                              type="text"
                              id="lastName"
                              placeholder="e.g. Appleseed"
                              className="overflow-hidden text-ellipsis whitespace-nowrap placeholder-opacity-50"
                            />
                          </label>
                          <label htmlFor="email">
                            <p>Email</p>
                            <input
                              type="email"
                              id="email"
                              placeholder="e.g. email@example.com"
                              className="overflow-hidden text-ellipsis whitespace-nowrap placeholder-opacity-50"
                            />
                          </label>
                        </div>
                      </div>
                      {(errorMessageProfile || errorMessageImg) && (
                        <div className="flex justify-center text-red-600 bg-red-100 border border-red-400 px-4 py-2 rounded-md text-sm mt-2 animate-fadeIn">
                          {errorMessageProfile || errorMessageImg}
                        </div>
                      )}
                      {successProfile && (
                        <motion.div
                          className="w-full bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg flex items-center gap-2"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          Profile created successfully!
                        </motion.div>
                      )}

                      <div className="flex justify-end ">
                        <AnimatedButton
                          type="submit"
                          className="saveBtn flex justify-center items-center gap-2 cursor-pointer"
                        >
                          {loadingProfile ? (
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          ) : (
                            "Save"
                          )}
                        </AnimatedButton>
                      </div>
                    </form>
                  )}
                </motion.div>
              </AnimatePresence>
            </section>
          </main>
        </>
      )}
    </div>
  );
}
