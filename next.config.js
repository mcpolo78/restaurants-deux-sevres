/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  images: {
    domains: [
      "res.cloudinary.com",
      "lh5.googleusercontent.com",
      "media-cdn.tripadvisor.com",
      "c.tfstatic.com",
      "lh3.googleusercontent.com",
    ],
  },
  env: {
    RAPID_API_KEY: process.env.RAPID_API_KEY,
  },
};
