// This file can also be used to store other user data or a list of users
// This file simulates a simple data store. In a real app, this would be an API call.
import profilePic from "../assets/profile.png";
export let user = {
  name: "Shivi Traveler",
  tagline: "Preserving emotions, one memory at a time.",
  profilePic: profilePic,
  stats: {
    memories: 24,
    countries: 8,
    favorites: 15,
  },
  latestMemories: [
    { title: "Varanasi Chai", description: "A soulful evening by the Ganga..." },
    { title: "Chennai Night", description: "Heard folk tales under the stars..." },
    { title: "Manali Snow", description: "First snowball fight of my life..." },
  ],
};

export const updateUserProfile = (newProfileData) => {
  // Update the user object with the new data
  user = { ...user, ...newProfileData };
  // Log the new data to confirm the update
  console.log("User profile updated:", user);
};