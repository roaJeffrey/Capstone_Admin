import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client();

client.setEndpoint("https://cloud.appwrite.io/v1").setProject("67270b84003bb9ab93a1");

export const account = new Account(client);

// Database
export const databases = new Databases(client, "67270ce0001ca47b2525");

// Storage
export const storage = new Storage(client);
