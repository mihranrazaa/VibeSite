import readline from "readline";

const redirect_uri = "https://mihranrazaa.info/callback";
const scope = "user-read-currently-playing user-read-playback-state";

console.log("\n🎵 Spotify Refresh Token Generator\n");
console.log("Before running this:");
console.log("1. Go to https://developer.spotify.com/dashboard");
console.log("2. Create an App");
console.log(`3. In your App settings, add this exact Redirect URI: ${redirect_uri}`);
console.log("4. Copy your Client ID and Client Secret\n");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question("Enter your Client ID: ", (client_id) => {
    rl.question("Enter your Client Secret: ", async (client_secret) => {
        const authUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
            response_type: "code",
            client_id: client_id.trim(),
            scope,
            redirect_uri,
        })}`;

        console.log("\n==================================");
        console.log("Step 1: Open this URL in your browser:\n");
        console.log(authUrl);
        console.log(`\nStep 2: After authorizing, you will be redirected to your site (${redirect_uri})`);
        console.log("Look at the URL in your browser. It will look like:");
        console.log(`${redirect_uri}?code=AQBx...\n`);

        rl.question("Step 3: Copy the 'code=' value from the URL and paste it here: ", async (code) => {
            try {
                const basic = Buffer.from(`${client_id.trim()}:${client_secret.trim()}`).toString("base64");

                const response = await fetch("https://accounts.spotify.com/api/token", {
                    method: "POST",
                    headers: {
                        Authorization: `Basic ${basic}`,
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams({
                        grant_type: "authorization_code",
                        code: code.trim(),
                        redirect_uri,
                    }),
                });

                const data = await response.json();

                if (data.error) {
                    console.error("\n❌ Error:", data.error_description || data.error);
                } else {
                    console.log("\n✅ Success! Here is your refresh token:\n");
                    console.log("==================================");
                    console.log(data.refresh_token);
                    console.log("==================================\n");
                    console.log("Add this to your .env file at the root of your project:");
                    console.log(`SPOTIFY_CLIENT_ID=${client_id.trim()}`);
                    console.log(`SPOTIFY_CLIENT_SECRET=${client_secret.trim()}`);
                    console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}`);
                }
            } catch (error) {
                console.error("\n❌ Error:", error);
            }

            rl.close();
        });
    });
});
