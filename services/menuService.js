//require the menu repository
const menuRepository = require("../repositories/menuRepository");

// return all the meals items
let getMenu = async () => {
  const products = await menuRepository.getMenu();
  return products;
};

//create a new meal
let createMeal = async (meal) => {
  newlyInsertedMeal = await menuRepository.createMeal(meal);
  return meal;
};
//exports
module.exports = {
  getMenu,
  createMeal,
};
