
import { Client, Account } from 'appwrite';

const client = new Client();
client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6818f9510020aa62488b');

const account = new Account(client);

export { account };
