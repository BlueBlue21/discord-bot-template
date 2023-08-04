import { BetterClient } from "./Client";

import dotenv from 'dotenv';
dotenv.config()

export const client = new BetterClient();

client.once("ready", () => {
    console.log("Successfully logged into discord!");
    client.listen();
    // Ready here!
});

client.start(process.env.token!);
