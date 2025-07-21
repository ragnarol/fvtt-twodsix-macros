const ITEM_COMPENDIUM_PACK = "world.mgt2-vehicle-components";
const VEHICLE_COMPENDIUM_PACK = "world.mgt2-vehicles";

function GetTwoDSixSubtypeFromSource(sourceSubtype) {
    switch (sourceSubtype) {
        case "program":
            return "software";
        case "sensors":
            return "sensor";
        case "systems":
            return "other";
        case "staterooms":
            return "accomodations";
        case "commonAreas":
            return "accomodations";
    }
}

function GetImageForComponentSubtype(subtype) {
    let fileName = null;

    switch (subtype) {
        default:
            fileName = subtype;
    }

    return fileName ? `systems/twodsix/assets/icons/components/${fileName}.svg` : null;
}


function FromSourceItemToFoundryItem(source) {
    const subtype = GetTwoDSixSubtypeFromSource(source.subtype);
    const img = GetImageForComponentSubtype(subtype);
    // todo set the right icon
    return {
        name: source.name,
        type: "component",
        system: {
            subtype: subtype,
            name: source.name,
            type: "component",
            quantity: source.quantity,
        },
        img: img
    }
}

async function GetDocumentIfExistsInPack(documentName, packName) {
    const collection = await game.packs.get(packName)
    const matches = await collection.getDocuments({ name: documentName })

    if (matches.length == 0) {
        console.error(`Document ${documentName} not found in pack ${packName}`);
    } else if (matches.length > 1) {
        console.error(`Multiple Document ${documentName} found in pack ${packName}`, matches);
    } else {
        return matches[0];
    }

    return null;
}

async function GetOrCreateItem(source) {
    const existing = await GetDocumentIfExistsInPack(source.name, ITEM_COMPENDIUM_PACK);
    if (existing != null) {
        return existing;
    }
    const fttItem = FromSourceItemToFoundryItem(source);
    const result = await Item.create(fttItem, { pack: ITEM_COMPENDIUM_PACK })
    return result;
}

async function FromSourceVehicleToFoundryVehicle(source) {
    let ss = source.system;
    return {
        name: source.name,
        type: "vehicle",
        system: {
            name: source.name,
            techLevel: ss.techLevel,
            cost: ss.cost,
            description: ss.description,
            cargoCapacity: ss.cargoCapacity,
            shippingSize: ss.shippingSize,
            crew: {
                operators: ss.crew.operators,
                passengers: ss.crew.passengers
            },
            features: "",
            maneuver: {
                speed: ss.maneuver.speed,
                range: ss.maneuver.range,
                agility: ss.maneuver.agility
            },
            damageStats: {
                armor: {
                    value: ss.damageStats.armor.value,
                    max: ss.damageStats.armor.max,
                    min: ss.damageStats.armor.min,
                    label: ""
                },
                armorLabel: ss.damageStats.armor.label,
                hull: {
                    value: ss.damageStats.hull.value,
                    max: ss.damageStats.hull.max,
                    min: ss.damageStats.hull.min,
                    label: ss.damageStats.hull.label
                },
                detailedArmor: {
                    front: { 
                        value: ss.damageStats.detailedArmor.front.value, 
                        max: ss.damageStats.detailedArmor.front.max,  
                        min: ss.damageStats.detailedArmor.front.min, 
                        label: ss.damageStats.detailedArmor.front.label 
                    },
                    rear: { 
                        value: ss.damageStats.detailedArmor.rear.value, 
                        max: ss.damageStats.detailedArmor.rear.max,  
                        min: ss.damageStats.detailedArmor.rear.min, 
                        label: ss.damageStats.detailedArmor.rear.label 
                    },
                 sides:{ 
                        value: ss.damageStats.detailedArmor.sides.value, 
                        max: ss.damageStats.detailedArmor.sides.max,  
                        min: ss.damageStats.detailedArmor.sides.min, 
                        label: ss.damageStats.detailedArmor.sides.label
                    } 
                }
            },    
            skillToOperate: ss.skillToOperate,
            traits: ss.traits // "Autopilot (skill level) 0\nCommunication Range 500km"
        }
    }
}

async function CreateVehicle(vehicleData) {
    const vehicle = await FromSourceVehicleToFoundryVehicle(vehicleData);
    const theVehicle = await Actor.create(vehicle, { pack: VEHICLE_COMPENDIUM_PACK })

    for (let i = 0; i < vehicleData.items.length; i++) {
        const element = vehicleData.items[i];
        const item = await GetOrCreateItem(element);
        await theVehicle.createEmbeddedDocuments('Item', [item.toObject()])
    }

}

// The output from the llm
const vehicleData = {
}


CreateVehicle(vehicleData);