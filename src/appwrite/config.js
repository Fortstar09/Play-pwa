
import { Client, Databases } from "appwrite";

const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('6737dfd30013ac9e25e7');

const databases = new Databases(client);

export { client, databases };
