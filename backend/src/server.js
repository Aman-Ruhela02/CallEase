import env from "../src/config/env.js";
import app from "./app.js";

console.log("Clerk Publishable:", env.CLERK_PUBLISHABLE_KEY?.slice(0, 10));

console.log("Clerk Secret loaded:", !!env.CLERK_SECRET_KEY);

console.log("Supabase URL:", env.SUPABASE_URL);
console.log("Supabase server key loaded:", !!env.SUPABASE_SERVICE_ROLE_KEY);

app.listen(env.PORT, "0.0.0.0", () => {
  console.log(`Server is running on the port ${env.PORT}`);
});
