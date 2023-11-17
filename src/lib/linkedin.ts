// Define your LinkedIn API credentials
const clientId = "78n732q9wfr265";
const clientSecret = "Xc4EUXvF34jJE5bQ";
const redirectUri = "http://localhost:3000";

// Define the required LinkedIn API scopes
const scope = "r_liteprofile r_emailaddress";

// Redirect the user to the LinkedIn authorization URL
const authorizationUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}`;
window.location.href = authorizationUrl;

// Upon successful user authorization, LinkedIn will redirect back to your redirect URI with an authorization code

// Extract the authorization code from the URL
const urlParams = new URLSearchParams(window.location.search);
const authorizationCode = urlParams.get("code");

// Now, exchange the authorization code for an access token
const tokenUrl = "https://www.linkedin.com/oauth/v2/accessToken";
const requestBody = new URLSearchParams({
  client_id: clientId,
  redirect_uri: redirectUri,
  client_secret: clientSecret,
  code: authorizationCode || "",
  grant_type: "authorization_code",
});

fetch(tokenUrl, {
  method: "POST",
  body: requestBody,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
})
  .then((response) => response.json())
  .then((data) => {
    const accessToken = data.access_token;

    // Make an API request to fetch the user's profile
    fetch("https://api.linkedin.com/v2/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((profileData) => {
        console.log("LinkedIn Profile Data:", profileData);
        // Handle the user's LinkedIn profile data here
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
      });
  })
  .catch((error) => {
    console.error("Error getting access token:", error);
  });
