const ITEM_COMPENDIUM_PACK = "world.mgt2-csc";


function ParseAmount(cost) {
  cost = cost || "";
  let multiplier = 1
  if (cost.toUpperCase().indexOf("MCR") >= 0) {
    multiplier = 1000000;
  } else if (cost.toUpperCase().indexOf("KCR") >= 0) {
    multiplier = 1000;
  }

  const strippedOfLetters = cost.replace(/\D/g,'');
  return Number(strippedOfLetters) * multiplier;
}

function ParseDamage(damage) {
  if (damage.indexOf("DD") < 0) {
    return damage.replace("D", "d6");
  }

  return damage;
}

function GetWeaponAuto(traits) {

  const array = traits.split(",");
  const auto = array.filter(x => x.toUpperCase().indexOf("AUTO") >= 0);

  if (auto.length > 0) {
    return Number(auto[0].replace(/\D/g,''))
  }
  
  return null;
}

function GetHandlingModifier(traits) {
  const array = traits.split(",");
  const veryBulky = array.filter(x => x.toUpperCase().indexOf("VERY BULKY") >= 0);
  if (!!veryBulky) {
    return "STR 11/@characteristics.strength.mod - 2 12/0"
  }

  const bulky = array.filter(x => x.toUpperCase().indexOf("BULKY") >= 0);
  if (!!bulky) {
    return "STR 8/@characteristics.strength.mod - 1 9/0"
  }
  return null;
}

function GetWeaponAP(traits) {

  const array = traits.split(",");
  const auto = array.filter(x => x.toUpperCase().indexOf("AP") >= 0);

  if (auto.length > 0) {
    return Number(auto[0].replace(/\D/g,''))
  }
  
  return null;
}

function pascalize(str) {
  return str.replace(/(\w)(\w*)/g,
        function(g0,g1,g2){return g1.toUpperCase() + g2.toLowerCase();});
}

function FromSouceWeaponToFoundryWeapon(weaponData, skill) {
  
  return {
      "name": pascalize(weaponData.name),
      "type": "weapon",
      "system": {
        "techLevel": weaponData.tl,
        "quantity": 1,
        "weight": weaponData.weight,
        "price": ParseAmount(weaponData.cost),
        "traits": weaponData.traits.split(","),
        "associatedSkillName": skill,
        "range": weaponData.range,
        "damage": ParseDamage(weaponData.damage),
        "damageBonus": 0,
        "magazineSize": weaponData.magazine,
        "ammo":  weaponData.magazine,
        "magazineCost": ParseAmount(weaponData.magazineCost),
        "damageType": "NONE",
        "rateOfFire": GetWeaponAuto(weaponData.traits),
        "armorPiercing": GetWeaponAP(weaponData.traits),
        "description": weaponData.description,
        "handlingModifiers": GetHandlingModifier(weaponData.traits)
    }
  }
}


async function CreateWeapon(weaponData, skill) {
    const weapon = await FromSouceWeaponToFoundryWeapon(weaponData, skill);
    const result = await Item.create(weapon, { pack: ITEM_COMPENDIUM_PACK })
    return result;

}


const data = [] // Replace emppty array with array withe the output from the LLM



for (let index = 0; index < data.length; index++) {
  const element = data[index];
  CreateWeapon(element, "Gun Combat: Slug");  
}
