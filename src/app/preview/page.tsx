"use client";
import { useRouter } from "next/router";
import Image from "next/image";

const Preview = () => {
  const router = useRouter();
  const { firstName, lastName, email, profilePicture, links } = router.query;

  const parsedLinks = links ? JSON.parse(links as string) : [];

  if (!firstName) return <p>Loading...</p>;

  return (
    <div>
      <Image
        src={profilePicture as string}
        alt="Profile"
        width={100}
        height={100}
      />
      <p>
        Name: {firstName} {lastName}
      </p>
      <p>Email: {email}</p>
      <h3>Links:</h3>
      <ul>
        {parsedLinks.map(
          (link: { _id: string; url: string; platform: string }) => (
            <li key={link._id}>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.platform}
              </a>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default Preview;
