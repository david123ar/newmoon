/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://animoon.netlify.app/", // Replace with your actual site URL
  generateRobotsTxt: true, // Generate a robots.txt file
  sitemapSize: 5000, // (Optional) Limit the number of URLs per sitemap file
  exclude: ["/sign-in", "/sign-up", "/working"], // Exclude unwanted pages
  changefreq: "daily", // (Optional) Change frequency of URLs
  priority: 0.7, // (Optional) Default priority of pages
};
