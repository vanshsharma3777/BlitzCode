export const verificationQuery = `
  query VerifyLeetCodeUser($username: String!) {
    matchedUser(username: $username) {
      username

      profile {
        aboutMe
      }
    }
  }
`;

