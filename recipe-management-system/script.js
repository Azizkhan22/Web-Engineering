let recipes = JSON.parse(localStorage.getItem('recipes')) || [];

const recipeForm = document.getElementById('recipeForm');
const recipeList = document.getElementById('recipeList');
const searchInput = document.getElementById('search');


function displayRecipes(filter = "") {
  recipeList.innerHTML = "";

  const filtered = recipes.filter(r =>
    r.title.toLowerCase().includes(filter.toLowerCase()) ||
    r.ingredients.toLowerCase().includes(filter.toLowerCase())
  );

  if (filtered.length === 0) {
    recipeList.innerHTML = `<p style="color:white;font-size:18px;">No recipes found.</p>`;
    return;
  }

  filtered.forEach((recipe, index) => {
    const card = document.createElement('div');
    card.className = 'recipe-card';

    card.innerHTML = `
      <img src="${recipe.image || 'https://via.placeholder.com/270x160'}" alt="Recipe Image" />
      <h3>${recipe.title}</h3>
      <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
      <p><strong>Instructions:</strong> ${recipe.instructions}</p>
      <div style="text-align:center;">
        <button onclick="editRecipe(${index})">✏️ Edit</button>
        <button onclick="deleteRecipe(${index})">🗑️ Delete</button>
      </div>
    `;
    recipeList.appendChild(card);
  });
}

recipeForm.addEventListener('submit', e => {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const ingredients = document.getElementById('ingredients').value.trim();
  const instructions = document.getElementById('instructions').value.trim();
  const imageFile = document.getElementById('image').files[0];

  if (!title || !ingredients || !instructions) {
    alert("Please fill in all required fields!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function() {
    const image = reader.result;
    addRecipe(title, ingredients, instructions, image);
  };

  if (imageFile) reader.readAsDataURL(imageFile);
  else addRecipe(title, ingredients, instructions, "");
});

function addRecipe(title, ingredients, instructions, image) {
  recipes.push({ title, ingredients, instructions, image });
  localStorage.setItem('recipes', JSON.stringify(recipes));
  recipeForm.reset();
  displayRecipes();
}

function editRecipe(index) {
  const recipe = recipes[index];
  document.getElementById('title').value = recipe.title;
  document.getElementById('ingredients').value = recipe.ingredients;
  document.getElementById('instructions').value = recipe.instructions;

  recipes.splice(index, 1);
  localStorage.setItem('recipes', JSON.stringify(recipes));
  displayRecipes();
}

function deleteRecipe(index) {
  if (confirm("Are you sure you want to delete this recipe?")) {
    recipes.splice(index, 1);
    localStorage.setItem('recipes', JSON.stringify(recipes));
    displayRecipes();
  }
}

searchInput.addEventListener('input', e => displayRecipes(e.target.value));

displayRecipes();
