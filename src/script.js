const dotenv = require('dotenv');
dotenv.config();

const avatar = document.getElementById('avatar');
const user = document.querySelector('.user');
const username = document.querySelector('.username');
const bio = document.querySelector('.bio');
const repoCount = document.querySelector('.repo-count');
const repoContainer = document.querySelector('.repositories');

const info = [];

const displayData = () => {
    const data = info[0].viewer;
    console.log(data);

    avatar.src = data.avatarUrl;
    user.innerText = data.name;
    username.innerText = data.login;
    bio.innerText = data.bio;
    repoCount.innerText = `${data.repositories.totalCount} results for public repositories`;

    displayRepos(data);
}

const displayRepos = (data) => {
    const repoData = data.repositories.nodes;
    repoData.map((repo) => {
        const newRepo = document.createElement('div');
        newRepo.classList.add('repository');

        const repoName = document.createElement('a');
        repoName.innerText = repo.name;
        repoName.href = repo.url

        const repoDescription = document.createElement('p');
        repoDescription.innerText = repo.description;

        //refactor later
        newRepo.appendChild(repoName);
        newRepo.appendChild(repoDescription);
        repoContainer.appendChild(newRepo);
    })
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
                name
                url
                description
                primaryLanguage {
                    name
                    color
                }
                stargazerCount
                forkCount
                updatedAt
            }
        }
    }       
}`;

const opts = {
    method: "POST",
    headers: {
        "Authorization": `bearer ${process.env.AUTH_TOKEN}`,
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ query })
};

fetch(url, opts)
    .then(res => res.json())
    .then(res => {
        info.push(res.data)
    })
    .then(() => displayData())
    .catch(console.error);
