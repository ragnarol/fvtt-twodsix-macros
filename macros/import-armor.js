const ITEM_COMPENDIUM_PACK = "world.mgt2-csc";

function GetArmorTypes(armorType) {
  let types = [];
  const armorString = armorType.toLowerCase();

  // types sometimes come in plural so a contains is enough to treat lasers/laser psionic/psionics the same

  if (armorString.indexOf("ballistic") >= 0) {
    types.push("ballistic");
  }

  if (armorString.indexOf("bludgeoning") >= 0) {
    types.push("bludgeoning");
  }
  if (armorString.indexOf("emp") >= 0) {
    types.push("emp");
  }
  if (armorString.indexOf("energy") >= 0) {
    types.push("energy");
  }
  if (armorString.indexOf("fire") >= 0) {
    types.push("fire");
  }
  if (armorString.indexOf("laser") >= 0) {
    types.push("laser");
  }
  if (armorString.indexOf("piercing") >= 0) {
    types.push("piercing");
  }
  if (armorString.indexOf("poison") >= 0) {
    types.push("poison");
  }
  if (armorString.indexOf("plasma") >= 0) {
    types.push("plasma");
  }
  if (armorString.indexOf("psionic") >= 0) {
    types.push("psionic");
  }
  if (armorString.indexOf("rad") >= 0) {
    types.push("rad");
  }
  if (armorString.indexOf("slashing") >= 0) {
    types.push("slashing");
  }
  if (armorString.indexOf("smoke") >= 0) {
    types.push("smoke");
  }
  if (armorString.indexOf("stun") >= 0) {
    types.push("stun");
  }
  return types;
}


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

function ParseArmor(armor) {
  return Number(armor.replace(/\D/g, ''));
}

function ParseSkillName(skill) {
  return skill;
}

function FromSouceArmorToFoundryArmor(armorData) {

  const rad = Number(armorData.rad) ? {
    "value": Number(armorData.rad)
  } : null;

  const secondaryArmor = armorData.secondary && Number(armorData.secondary.protection) ? {
    value: Number(armorData.secondary.protection),
    protectionTypes: GetArmorTypes(armorData.secondary.protectionType)
  } : null;

  debugger;
  
  return {
    // if the name already exists we should add TL to the name
    "name": pascalize(armorData.name),
    "type": "armor",
    "system": {
      "type": "armor",
      "techLevel": armorData.tl,
      "quantity": 1,
      "armor": ParseArmor(armorData.protection),
      "weight": armorData.kg,
      "price": ParseAmount(armorData.cost),
      "traits": [],
      "associatedSkillName": ParseSkillName(armorData.requiredSkill),
      "armorType": "nothing",
      // TODO ispowered and nonstackable
      "isPowered": false,
      "nonstackable": false,
      "radiationProtection": rad,
      "secondaryArmor": secondaryArmor
    }
  }
}


async function CreateArmor(armordata) {
  const armor = await FromSouceArmorToFoundryArmor(armordata);
  const result = await Item.create(armor, { pack: ITEM_COMPENDIUM_PACK })
  return result;

}

const data = [
  
];

for (let index = 0; index < data.length; index++) {
  const element = data[index];
  CreateArmor(element);
}