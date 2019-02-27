const toyContainer = document.querySelector('#toy-collection')
const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
let addToy = false

// YOUR CODE HERE
document.addEventListener("DOMContentLoaded", function(event) {
    console.log("DOM fully loaded and parsed");
    getData()

  });

function getData() {
  fetch('http://localhost:3000/toys')
  .then(res => res.json())
  .then(toysArr => {
    console.log(toysArr);
    renderToys(toysArr)
  })
}

function renderToys(toysArr) {
  toysArr.forEach(toy => {
    toyContainer.append(renderOneToy(toy))
  })
}

function renderOneToy(toy) {
  const toyCard = document.createElement('div')
  toyCard.className = 'card'
  toyCard.addEventListener('click', (event) => handleClick(event, toy))
  toyCard.innerHTML += `
              <h2>${toy.name}</h2>
              <img src=${toy.image} class="toy-avatar" />
              <p>${toy.likes} Likes </p>
              <button class="like-btn">Like <3</button>
              <button class="delete-btn">DELETE SHIT</button>
              `
  return toyCard
}

function handleClick(e, toy) {
  console.log(e.target);
  // debugger
  if (e.target.className === 'like-btn') {
    let newLikeCount = parseInt(e.target.parentElement.querySelector('p').innerText.split(' ')[0]) + 1
    e.target.parentElement.querySelector('p').innerText = `${newLikeCount} Likes`
    patchLikes(toy.id, newLikeCount)
  } else if (e.target.className === 'delete-btn') {
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    }).then(res => {
      res.json()
      // debugger
    })
    .then(deletedToy => {
      e.target.parentElement.remove()
    })
  }
}

function patchLikes(toyId, newLikeCount) {
  fetch(`http://localhost:3000/toys/${toyId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      'likes': newLikeCount
    })
  }).then(res => res.json())
  .then(editedToy => console.log(editedToy))
}

addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
    // submit listener here
    const ourForm = document.querySelector('.add-toy-form')
    ourForm.addEventListener('submit', handleSubmit)
  } else {
    toyForm.style.display = 'none'
  }
})

function handleSubmit(e) {
  e.preventDefault()
  console.log('in submit handler');
  const toyName = e.target.name.value
  const toyImage = e.target.image.value
  const toyObj = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: toyName,
      image: toyImage,
      likes: 0
    })
  }
  postNewToy(toyObj).then(newToy => {
    toyContainer.append(renderOneToy(newToy))
  })
}

function postNewToy(toy) {
  return fetch('http://localhost:3000/toys', toy)
  .then(resp => resp.json())
}

// OR HERE!
