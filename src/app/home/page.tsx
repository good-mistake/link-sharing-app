"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CustomSelect from "../customselect/Customselect";
import { motion, AnimatePresence } from "framer-motion";
import { updateProfile, getProfile } from "../../services/services.js";
type UserType = {
  _id: string;
  firstName: string;
  lastName: string;
  profileEmail: string;
  accountEmail: string;
  profilePicture?: string;
  links: { _id: string; url: string; platform: string }[];
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
  const [links, setLinks] = useState<
    { _id: string; url: string; platform: string }[]
  >([]);
  const [showIntro, setShowIntro] = useState(true);
  const [newLinks, setNewLinks] = useState<
    { id: number; url: string; platform: string }[]
  >([]);
  const [linkOrProfile, setLinksOrProfile] = useState<boolean>(false);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [errorMessageImg, setErrorMessageIMG] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); //add /login after changes in UI
      return;
    }

    const fetchUser = async () => {
      try {
        const data = await getProfile();

        setUser(data.profile);
        setLinks(data.profile.links);
      } catch (error) {
        console.error(error);
        localStorage.removeItem("token");
        router.push("/login"); //add /login after changes in UI
      }
    };

    fetchUser();
  }, [router]);

  const addNewLink = () => {
    setShowIntro(false);
    setNewLinks([
      ...newLinks,
      { id: newLinks.length + 1, url: "", platform: selectedPlatform },
    ]);
  };
  const removeLink = (id: number) => {
    setNewLinks(newLinks.filter((link) => link.id !== id));
    if (newLinks.length === 1) {
      setShowIntro(true);
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

    setErrorMessageIMG(null);
    setSelectedImage(file);
  };
  const isValidPlatformUrl = (url: string, platform: string) => {
    try {
      const domain = new URL(url).hostname.replace("www.", "");
      return domain.includes(platformDomains[platform]);
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  const handleSaveLinks = async () => {
    console.log("User:", user);
    console.log("Save button clicked");
    console.log("New Links:", newLinks);
    if (!user) {
      console.log("No user found!");
      return;
    }

    for (const link of newLinks) {
      if (!link.url || !link.platform) {
        setErrorMessage("Please fill out all links before saving.");
        return;
      }

      if (!isValidPlatformUrl(link.url, link.platform)) {
        setErrorMessage(`Invalid URL for ${link.platform}.`);
        return;
      }
    }

    try {
      const formattedNewLinks = newLinks.map((link) => ({
        _id: String(link.id),
        url: link.url,
        platform: link.platform || selectedPlatform,
      }));

      const updatedProfile = {
        ...user,
        links: [...links, ...formattedNewLinks],
      };

      console.log("Updated Profile Data:", updatedProfile);
      await updateProfile(updatedProfile);
      setUser(updatedProfile);
      setLinks(updatedProfile.links);
      console.log("saved");
      setNewLinks([]);
    } catch (error) {
      console.error("Failed to save links:", error);
      setErrorMessage("Error saving links. Please try again.");
    }
  };

  const handleSaveProfile = async () => {
    console.log("Save button clicked");
    if (!user) return;

    const firstName = (document.getElementById("name") as HTMLInputElement)
      .value;
    const lastName = (document.getElementById("lastName") as HTMLInputElement)
      .value;

    if (!firstName || !lastName) {
      setErrorMessage("First name and last name are required.");
      return;
    }

    try {
      const profileData: Partial<UserType> = { ...user, firstName, lastName };

      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Image upload failed.");
        }

        console.log("Saving");
        const uploadData = await uploadResponse.json();
        profileData.profilePicture = uploadData.imageUrl;
      }

      await updateProfile(profileData);
      setUser({ ...user, ...profileData });
      setErrorMessage(null);
      console.log("Saved");
    } catch (error) {
      console.error("Failed to update profile:", error);
      setErrorMessage("Error saving profile. Please try again.");
    }
  };
  console.log("selected platform", selectedPlatform);
  return (
    <div className="p-4">
      <header className="flex justify-between items-center">
        <div className="">
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
              className={`w-4 h-4 ${
                !linkOrProfile ? "bg-[#633CFF]" : "bg-[#737373]"
              }`}
              style={{
                maskImage: `${"url(/images/icon-link.svg)"}`,
                WebkitMaskImage: `${"url(/images/icon-link.svg)"}`,
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
              className={`w-5 h-5 ${
                linkOrProfile ? "bg-[#633CFF]" : "bg-[#737373]"
              }`}
              style={{
                maskImage: `${"url(/images/icon-profile-details-header.svg)"}`,
                WebkitMaskImage: `${"url(/images/icon-profile-details-header.svg)"}`,
              }}
            />
            <p className={`${linkOrProfile ? "active" : "notActive"}`}>
              Profile Details
            </p>
          </div>
        </div>
        <button className="previewBtn">Preview</button>
      </header>
      <main className="maincontent flex">
        <section className="preview">
          <Image
            src="/images/illustration-phone-mockup.svg"
            alt="logo"
            width={300}
            height={618}
          />
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
                    Add/edit/remove links below and then share all your profiles
                    with the world!
                  </p>
                  <div className="addLinkSection">
                    <button onClick={addNewLink} className="addLinkBtn">
                      + Add new link
                    </button>

                    {showIntro ? (
                      <div className="flex flex-col justify-center items-center start">
                        <Image
                          src="/images/illustration-empty.svg"
                          alt="logo"
                          width={250}
                          height={818}
                        />
                        <h2>Let’s get you started</h2>
                        <p className="text-center px-20">
                          Use the “Add new link” button to get started. Once you
                          have more than one link, you can reorder and edit
                          them. We’re here to help you share your profiles with
                          everyone!
                        </p>
                      </div>
                    ) : (
                      <AnimatePresence>
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
                              <div className="flex ">
                                <Image
                                  src="/images/icon-drag-and-drop.svg"
                                  alt="logo"
                                  width={12}
                                  height={6}
                                />
                                <span>Link #{index + 1}</span>
                              </div>{" "}
                              <button
                                onClick={() => removeLink(link.id)}
                                className=""
                              >
                                Remove
                              </button>
                            </div>

                            <CustomSelect
                              selected={selectedPlatform}
                              setSelected={setSelectedPlatform}
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
                                  className="flex-1 py-3 linkUrl"
                                  placeholder="Enter URL"
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
                  <div className="flex justify-end ">
                    <button
                      className="saveBtn cursor-pointer"
                      onClick={handleSaveLinks}
                    >
                      Save
                    </button>
                  </div>
                </>
              ) : (
                <form className="detailsForm">
                  <h1>Profile Details</h1>
                  <p>
                    Add your details to create a personal touch to your profile.
                  </p>
                  <div className="addLinkSection">
                    <div className="imageUploadSection">
                      <div className="flex mt-16 ">
                        <p>Profile picture</p>
                        <label
                          htmlFor="profileImage"
                          className=" cursor-pointer"
                        >
                          <Image
                            src={
                              user?.profilePicture ||
                              "/images/icon-upload-image.svg"
                            }
                            alt="Profile"
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                          + Upload Image
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
                        className="hidden"
                      />
                    </div>
                    <div className="descriptions">
                      <label htmlFor="name">
                        <p>First name*</p>
                        <input type="text" id="name" placeholder="e.g. John" />
                      </label>{" "}
                      <label htmlFor="lastName">
                        <p>Last name*</p>
                        <input
                          type="text"
                          id="lastName"
                          placeholder="e.g. Appleseed"
                        />
                      </label>
                      <label htmlFor="email">
                        <p>Email</p>
                        <input
                          type="email"
                          id="email"
                          placeholder="e.g. email@example.com"
                        />
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    {errorMessage ||
                      (errorMessageImg && (
                        <p className="text-red-600 bg-red-100 border border-red-400 px-4 py-2 rounded-md text-sm mt-2 animate-fadeIn">
                          {errorMessage}
                        </p>
                      ))}
                  </div>

                  <div className="flex justify-end ">
                    <button
                      className="saveBtn cursor-pointer"
                      onClick={handleSaveProfile}
                    >
                      Save
                    </button>
                  </div>
                </form>
              )}{" "}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}
