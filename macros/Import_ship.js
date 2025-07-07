const ITEM_COMPENDIUM_PACK = "world.mgt2-ship-components";
const SHIP_COMPENDIUM_PACK = "world.mgt2-ships";

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

async function FromSourceShipToFoundryShip(source) {
    let ss = source.system;

    return {
        name: source.name,
        type: "ship",
        system: {
            name: source.name,
            techLevel: ss.techLevel,
            maintenanceCost: ss.maintenanceCost,
            shipValue: ss.shipValue,
            reqPower: {
                systems: ss.reqPower.systems,
                "m-drive": ss.reqPower["m-drive"],
                "j-drive": ss.reqPower["j-drive"],
                sensors: ss.reqPower.sensors,
            },
            "shipStats": {
                "hull": {
                    "value": ss.shipStats.hull.value,
                    "max": ss.shipStats.hull.max,
                    "min": ss.shipStats.hull.min,
                    "label": ss.shipStats.hull.label
                },
                "power": {
                    "value": ss.shipStats.power.value,
                    "max": ss.shipStats.power.max,
                    "min": ss.shipStats.power.min
                },
                "armor": {
                    // TODO get the armor name
                    "value": ss.shipStats.armor.value,
                    "max": ss.shipStats.armor.max,
                    "min": ss.shipStats.armor.min
                },
                "mass": {
                    "value": ss.shipStats.mass.value,
                    "max": ss.shipStats.mass.max,
                    "min": ss.shipStats.mass.min,
                },
                "drives": {
                    "overdrive": false,
                    "jDrive": {
                        "rating": ss.shipStats.drives.jDrive.rating
                    },
                    "mDrive": {
                        "rating": ss.shipStats.drives.mDrive.rating
                    }
                },
                "bandwidth": {
                    "value": ss.shipStats.bandwith.value,
                    "max": ss.shipStats.bandwith.max,
                    "min": ss.shipStats.bandwith.min
                },
               "fuel": {
               "value": ss.shipStats.fuel.value,
               "max": ss.shipStats.fuel.max,
               "min": ss.shipStats.fuel.min,
               "isRefined": true
                }
            }
        }
    }
}

async function CreateShip(shipData) {
    const ship = await FromSourceShipToFoundryShip(shipData);
    const theShip = await Actor.create(ship, { pack: SHIP_COMPENDIUM_PACK })

    for (let i = 0; i < shipData.items.length; i++) {
        const element = shipData.items[i];
        const item = await GetOrCreateItem(element);
        await theShip.createEmbeddedDocuments('Item', [item.toObject()])
    }

}

// The output from the llm
const shipData = {
}


CreateShip(shipData);