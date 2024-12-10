import { databases } from "../appwrite/AppwriteConfig";

export const userResponse = await databases.listDocuments(
  "673b418100295c788a93",
  "673b41c1003840fb1cd8"
);

export const userRoleResponse = await databases.listDocuments(
  "673b418100295c788a93",
  "673b41cc002db95aabfc"
);

export const roleResponse = await databases.listDocuments(
  "673b418100295c788a93",
  "673b41d00018b34a286f"
);

// Admin role ID (the role we want to hide)
export const adminRoleId = "673ee7be0020a2298fd1";

// ! TBD
export const userCollectionId = "673b41c1003840fb1cd8"; // User ID

