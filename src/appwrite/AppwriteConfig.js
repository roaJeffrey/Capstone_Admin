import { Client, Account, Databases, Storage, Functions } from 'appwrite';

export const client = new Client();

client.setEndpoint("https://cloud.otoscopia.tech/v1").setProject("66fe8fcf003912f96289");

export const account = new Account(client);

// Database
export const databases = new Databases(client, "673b418100295c788a93");

// Storage
export const storage = new Storage(client);

// Functions
export const functions = new Functions(client)