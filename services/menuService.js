// return all the menu items
let getMenu = async () => {
  const products = await menuRepository.getMenu();
  return products;
};

//exports
module.exports = {
  getMenu,
};
