const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL + "/api/profile";

export const getProfile = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(API_BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch profile");
  return await response.json();
};

export const updateProfile = async (profileData) => {
  const token = localStorage.getItem("token");
  const response = await fetch(API_BASE_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });
  if (!response.ok) throw new Error("Failed to update profile");
  return await response.json();
};

export const addLink = async (linkData) => {
  const token = localStorage.getItem("token");
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(linkData),
  });
  if (!response.ok) throw new Error("Failed to add link");
  return await response.json();
};

export const deleteLink = async (linkId) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}?linkId=${linkId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to delete link");
  return await response.json();
};

export const deleteProfile = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(API_BASE_URL, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to delete profile");
  return await response.json();
};
