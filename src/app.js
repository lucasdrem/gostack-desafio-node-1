const express = require("express");
const cors = require("cors");
const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  
  const repositoriesIndex = repositories.findIndex(repository => repository.id === id);

  //Case you dont have this id in your database
  if (repositoriesIndex < 0){
    return response.status(400).json({
      error: "Repository not found!"
    });
  } 

  repositories[repositoriesIndex] = {
    id,
    title,
    url, 
    techs,
    likes: repositories[repositoriesIndex].likes
  };

  return response.json(repositories[repositoriesIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoriesIndex = repositories.findIndex(repository => repository.id === id);

  //Case you dont have this id in your database
  if (repositoriesIndex < 0){
    return response.status(400).json({
      error: "Repository not found!"
    });
  } 

  repositories.splice(repositoriesIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoriesIndex = repositories.findIndex(repository => repository.id === id);

  //Case you dont have this id in your database
  if (repositoriesIndex < 0){
    return response.status(400).json({
      error: "Repository not found!"
    });
  } 

  let repository = {
    ...repositories[repositoriesIndex],
    likes: repositories[repositoriesIndex].likes + 1
  }

  repositories[repositoriesIndex] = repository;

  return response.json(repository);
});

// app.listen(3334, () => {
//   console.log('Back-end started!');
// })

module.exports = app;
