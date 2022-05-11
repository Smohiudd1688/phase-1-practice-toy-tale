let addToy = false;
let globalId = 9;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  
  addCards();
  addNewToy();
});

//adds all the toys for db.json to the dom
function addCards () {
  const cardCollection = document.querySelector("#toy-collection");

  fetch ("http://localhost:3000/toys")
  .then (response => response.json())
  .then (toyObject => {
    for (const toy of toyObject) {
      createCard(toy.name, toy.image, toy.id, toy.likes);
    }
  });
}

function addNewToy () {
  const toyForm = document.querySelector('.add-toy-form');
  
  toyForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const inputs = document.querySelectorAll('.input-text');
    const toyName = inputs[0].value;
    const toyImage = inputs[1].value;

    handlePosts(toyName, toyImage);
    createCard(toyName, toyImage, globalId);

    toyForm.reset();
    ++globalId;
  })
}

function handlePosts (toyName, toyImage) {
  fetch('http://localhost:3000/toys', {
      method: "POST",
      headers:
      {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        'name': toyName,
        'image': toyImage,
        'likes': 0
      })
    })
    .then (response => response.json());
}

function createCard (name, image, id, likes = 0) {
  const cardCollection = document.querySelector("#toy-collection");

  //create all the needed dom elements for each toy card
  const card = document.createElement('div');
  const toyName = document.createElement('h2');
  const toyImage = document.createElement('img');
  const toyLikes = document.createElement('p');
  const likeButton = document.createElement('button');
  
  //add text and attributes to the toy cards
  card.classList.add('card');
  toyName.textContent = name;
  toyImage.src = image;
  toyImage.classList.add('toy-avatar');
  toyLikes.textContent = `${likes} Likes`;
  likeButton.classList.add('like-btn');
  likeButton.setAttribute('id', `${id}`);
  likeButton.textContent = 'Like ❤️';


  //append the cards on the dom
  card.appendChild(toyName);
  card.appendChild(toyImage);
  card.appendChild(toyLikes);
  card.appendChild(likeButton);
  cardCollection.appendChild(card);
  updateLikes();
}

function updateLikes () {
  let buttonList = document.querySelectorAll(".like-btn");
  
  for (const button of buttonList) {
    button.addEventListener('click', handleLikes);
  }
}

function handleLikes(event) {
  const card = event.target.parentElement;
  const likes = card.querySelector('p').textContent;
  likes.split('');
  let num = '';
  for (const letter of likes) {
    if (typeof(parseInt(letter)) === 'number') {
      num = num + letter;
    }
  }
  const newLike = parseInt(num) + 1;
  card.querySelector('p').textContent = `${newLike} Likes`;

  fetch(`http://localhost:3000/toys/${event.target.id}`, {
      method: "PATCH",
      headers:
      {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        'likes': newLike
      })
    })
    .then (response => response.json());
}