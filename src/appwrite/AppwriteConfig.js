import { Client, Account, Databases, Storage } from 'appwrite';

export const client = new Client();

client.setEndpoint("https://cloud.otoscopia.tech/v1").setProject("66fe8fcf003912f96289");

export const account = new Account(client);

// Database
export const databases = new Databases(client, "673b418100295c788a93");

// Storage
export const storage = new Storage(client);

// Subscribe to real-time events for document changes in the User collection
export const subscribeToUserCollection = (callback) => {
  const channel = "databases.673b418100295c788a93.collections.673b41c1003840fb1cd8.documents";
  
  // Subscribe to changes on the User collection
  client.subscribe(channel, (response) => {
    console.log("Real-time event:", response);
    
    if (callback && typeof callback === 'function') {
      callback(response);
    }
  });
};

// Initialize real-time subscription (can be triggered elsewhere in your app)
subscribeToUserCollection((response) => {
  // Handle the real-time event (new document created, etc.)
  if (response.events.includes('databases.*.collections.*.documents.*.create')) {
    // This means a new user was added
    console.log("New user added:", response.payload);
  } else if (response.events.includes('databases.*.collections.*.documents.*.delete')) {
    // Handle deletion event
    console.log("User deleted:", response.payload);
  }
});
