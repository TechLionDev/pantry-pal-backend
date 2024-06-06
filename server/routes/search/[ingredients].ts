import PocketBase from 'pocketbase';

const pb = new PocketBase('https://pantry-pal.pockethost.io');
pb.autoCancellation(false);

export default defineEventHandler(async event => {
  let ingredientsParam: any = getRouterParam(event, 'ingredients').split(',').map(decodeURIComponent).map(param => param.trim().toLowerCase());
  console.log('Ingredients Param:', ingredientsParam);

  // Fetch all ingredients
  const allIngredients = await pb.collection('ingredients').getFullList({ sort: '-created' });
  console.log('All Ingredients:', allIngredients);

  // Filter ingredients based on partial match with input
  const ingredients = allIngredients.filter(ingredient => 
    ingredientsParam.some(param => ingredient.name.toLowerCase().includes(param))
  );
  console.log('Filtered Ingredients:', ingredients);

  // Fetch all recipes
  const allRecipes = await pb.collection('recipes').getFullList({ expand: 'recipeIngredient, nutrition' });
  console.log('All Recipes:', allRecipes);

  // Create a set of ingredient IDs for quick lookup
  const ingredientIds = new Set(ingredients.map(ingredient => ingredient.id));
  console.log('Ingredient IDs:', ingredientIds);

  const recipes = allRecipes.filter(recipe => {
    if (recipe.recipeIngredient) {
      return recipe.recipeIngredient.some(ingredientId => ingredientIds.has(ingredientId));
    }
    return false;
  });

  console.log('Filtered Recipes:', recipes);

  return {
    recipes,
    ingredients,
  };
});
