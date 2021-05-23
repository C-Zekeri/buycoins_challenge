const dotenv = require('../node_modules/dotenv');
dotenv.config();

const avatar = document.getElementById('avatar');
const user = document.querySelector('.user');
const username = document.querySelector('.username');
const bio = document.querySelector('.bio');
const repoCount = document.querySelector('.repo-count');
const repoContainer = document.querySelector('.repositories');

const info = [];

const displayData = () => {
    const data = info.viewer;
    console.log(info);

    const src = avatar.getAttribute('src');
    src = data.avatarUrl;
    user.innerText(data.name);
    username.innerText(data.login);
    bio.innerText(data.bio);
    repoCount.innerText(`${data.repositories.totalCount} reults for public repositories`);
}

const url = 'https://api.github.com/graphql';
const query = `query { 
    viewer {
        name
        login
        avatarUrl
        bio
        repositories(affiliations: [OWNER, COLLABORATOR], first: 20) {
            totalCount
            nodes {
                description
                forkCount
                name
                stargazerCount
                updatedAt
                url
            }
        }
    }       
}`;

const opts = {
    method: "POST",
    headers: {
        "Authorization": ` bearer ${process.env.AUTH_TOKEN}`,
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ query })
};

fetch(url, opts)
    .then(res => res.json())
    .then(res => {
        info.push(res.data)
        console.log(info)
    })
    .then(displayData())
    .catch(console.error);


//window.onload = () => { displayData() };