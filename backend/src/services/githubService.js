const axios = require('axios');

const GITHUB_API = 'https://api.github.com';

const getHeaders = () => {
  const headers = { Accept: 'application/vnd.github.v3+json' };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
};

/**
 * Fetch basic GitHub user profile info.
 */
const getUserProfile = async (username) => {
  const { data } = await axios.get(`${GITHUB_API}/users/${username}`, { headers: getHeaders() });
  return {
    login: data.login,
    name: data.name,
    avatar_url: data.avatar_url,
    bio: data.bio,
    public_repos: data.public_repos,
    followers: data.followers,
    following: data.following,
    html_url: data.html_url,
  };
};

/**
 * Fetch user's public repositories (top 6 by stars).
 */
const getUserRepos = async (username) => {
  const { data } = await axios.get(
    `${GITHUB_API}/users/${username}/repos?sort=stars&per_page=6`,
    { headers: getHeaders() }
  );
  return data.map((repo) => ({
    id: repo.id,
    name: repo.name,
    description: repo.description,
    html_url: repo.html_url,
    language: repo.language,
    stargazers_count: repo.stargazers_count,
    forks_count: repo.forks_count,
    updated_at: repo.updated_at,
  }));
};

/**
 * Fetch languages used across user repos.
 */
const getUserLanguages = async (username) => {
  const repos = await getUserRepos(username);
  const langCount = {};
  for (const repo of repos) {
    if (repo.language) {
      langCount[repo.language] = (langCount[repo.language] || 0) + 1;
    }
  }
  return langCount;
};

module.exports = { getUserProfile, getUserRepos, getUserLanguages };
