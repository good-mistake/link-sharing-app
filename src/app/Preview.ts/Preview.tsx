import React from "react";
type User = {
  _id: string;
  firstName: string;
  lastName: string;
  profileEmail: string;
  accountEmail: string;
  profilePicture?: string;
  links: { _id: string; url: string; platform: string }[];
};
const Preview: React.FC<{ user: User | null }> = ({ user }) => {
  console.log(user);
  return <>Preview</>;
};

export default Preview;
