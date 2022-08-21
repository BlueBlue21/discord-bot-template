import { BetterClient } from "./Client";

import { token } from "./config.json";

export const client = new BetterClient();

client.once("ready", () => {
    // Ready here!
});

client.start(token);
