const ITEM_COMPENDIUM_PACK = "world.mgt2-csc-2";


function ParseAmount(cost) {
  let multiplier = 1
  if (cost.toUpperCase().indexOf("MCR") >= 0) {
    multiplier = 1000000;
  } else if (cost.toUpperCase().indexOf("KCR") >= 0) {
    multiplier = 1000;
  }

  const strippedOfLetters = cost.replace(/\D/g, '');
  return Number(strippedOfLetters) * multiplier;
}


function pascalize(str) {
  return str.replace(/(\w)(\w*)/g,
    function (g0, g1, g2) { return g1.toUpperCase() + g2.toLowerCase(); });
}

function FromSouceItemToFoundryItem(itemData) {
  return {
    "name": pascalize(itemData.name),
    "type": "equipment",
    "system": {
      "techLevel": itemData.tl,
      "description": itemData.description,
      "quantity": 1,
      "weight": itemData.kg,
      "price": ParseAmount(itemData.cost),
      "equipped": "equipped",
      "type": "equipment"
    }
  }
}


async function CreateItem(itemData) {
  const item = await FromSouceItemToFoundryItem(itemData);
  const result = await Item.create(item, { pack: ITEM_COMPENDIUM_PACK })
  return result;

}

const data = [
  
];

for (let index = 0; index < data.length; index++) {
  const element = data[index];
  CreateItem(element);
}