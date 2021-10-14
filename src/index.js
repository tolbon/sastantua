"use strict";

const FIRST_ARGS_INDEX = 2;
const NB_LEAF_FIRST_LINE = 1;
const NB_LINE_FIRST_FLOOR = 3;
const NB_LEAF_ADDED_BY_LINE = 2;

/**
 * 
 * @param {Array<string>} argv 
 */
function main(argv) {

    // argv look like '[node, /path/scriptName.js, arg1, arg2, ...]'
    if (argv.length !== 3) {
        console.error('Need 1 argument');
        process.exit(1);
    }
    const nb_floor = parseInt(argv[FIRST_ARGS_INDEX], 10);

    if (isNaN(nb_floor) || nb_floor < 1) {
        console.error('Nb floor is not a positive number');
        process.exit(1);
    }

    const nb_line_first_floor = NB_LINE_FIRST_FLOOR;
    const nb_leaf_first_line = NB_LEAF_FIRST_LINE;
    const nb_leaf_last_line = getMaxNbLeafMath(nb_leaf_first_line, nb_line_first_floor, nb_floor);
    const nb_char_middle = Math.floor(nb_leaf_last_line / 2);
    drawLeaf(nb_floor, nb_line_first_floor, nb_leaf_first_line, nb_char_middle);
    drawTrunk(nb_floor, nb_char_middle);
}

function drawLeaf(nb_floor, nb_line_first_floor, nb_leaf_first_line, nb_char_middle) {

    let nb_leaf = nb_leaf_first_line;
    let nb_space = nb_char_middle;

    for (let floor = 0; floor < nb_floor; floor++) {
        const nb_line_by_floor = nb_line_first_floor + floor;

        for (let line = 0; line < nb_line_by_floor; line++) {
            const leaf_line = ' '.repeat(nb_space) + '/' + '*'.repeat(nb_leaf) + '\\';

            console.log(leaf_line);
            nb_leaf += NB_LEAF_ADDED_BY_LINE;
            nb_space -= (NB_LEAF_ADDED_BY_LINE / 2);
        }
        nb_leaf -= (2 * NB_LEAF_ADDED_BY_LINE);
        nb_space += 2 * (NB_LEAF_ADDED_BY_LINE / 2);
    }
}


function drawTrunk(nb_floor, nb_char_middle) {
    const nb_space = nb_char_middle - Math.floor(nb_floor / 2);
    const trunk_line = ' '.repeat(nb_space) + '|'.repeat(nb_floor);

    for (let line = 0; line < nb_floor; line++) {
        console.log(trunk_line);
    }
}

/**
 * 
 * @param {number} nb_leaf 
 * @param {number} nb_line 
 * @param {number} nb_floor 
 * @returns 
 */
function getMaxNbLeafSimple(nb_leaf_start, nb_line_first_floor, nb_floor) {

    let nb_leaf = nb_leaf_start;
    let nb_leaf_sub = 0;

    for (let floor = 0; floor < nb_floor; floor++) {
        const nb_line_by_floor = nb_line_first_floor + floor;

        for (let line = 0; line < nb_line_by_floor; line++) {
            nb_leaf += NB_LEAF_ADDED_BY_LINE;
        }
        if (floor !== 0) {
            nb_leaf += (3 * NB_LEAF_ADDED_BY_LINE);
        }
    }

    /*
     We add X leaf by line but the first line have already a defined number
     that's why we sub NB_LEAD_ADDED_BY_LINE;
    */
    nb_leaf -= NB_LEAF_ADDED_BY_LINE;

    return nb_leaf;
}

/**
 * 
 * @param {number} nb_leaf_start 
 * @param {number} nb_line_first_floor 
 * @param {number} nb_floor 
 * @returns 
 */
function getMaxNbLeafMath(nb_leaf_start, nb_line_first_floor, nb_floor) {

    let nb_line_tot = 0;

    for (let floor = 0; floor < nb_floor; floor++) {
        nb_line_tot += (nb_line_first_floor + floor);
    }

    /*
     We add X leaf by line but the first line have already a defined number
     that's why we do (nb_line_tot - 1) and add nb leaf in first line
    */
    const nb_leaf_tmp = (NB_LEAF_ADDED_BY_LINE * (nb_line_tot - 1)) + nb_leaf_start;

    // Between 2 floor we substract Y nb of leaf but not for the first floor
    const nb_leaf_sub = (3 * NB_LEAF_ADDED_BY_LINE) * (nb_floor - 1);

    return nb_leaf_tmp + nb_leaf_sub;

}

/**
 * 
 * @param {number} floor 
 * @param {number} acc 
 * @returns {number}
 */
function nbLineMaxTerminalRecursiv(floor, acc = 0) {
    if (floor <= 0) {
        return acc;
    }
    return nbLineMaxTerminalRecursiv(floor - 1, acc + nbLineByFloor(floor));
}

/**
 * 
 * @param {number} floor 
 * @returns {number}
 */
function getNbLineMax(floor) {
    return nbLineMaxTerminalRecursiv(floor, 0);
}

/**
 * 
 * @param {number} floor 
 * @returns {number}
 */
function nbLineMaxRecursiv(floor) {
    if (floor <= 0) {
        return 0;
    }
    return nbLineMaxRecursiv(floor - 1) + nbLineByFloor(floor);
}

/**
 * 
 * @param {number} floor 
 * @returns {number}
 */
function nbLineByFloor(floor) {
    if (floor <= 0) {
        return 0;
    }

    return (NB_LINE_FIRST_FLOOR + (floor - 1));
}


/**
 * 
 * @param {number} floor 
 * @param {number} lineInFloor 
 * @returns {number}
 */
function getLine(floor, lineInFloor) {

    return nbLineMaxTerminalRecursiv(floor - 1) + lineInFloor;
}

/**
 * 
 * @param {number} floor 
 * @param {number} lineInFloor 
 * @returns {number} nb char to display
 */
function nbChar(floor, lineInFloor) {
    return NB_LEAF_FIRST_LINE + ((NB_LEAF_ADDED_BY_LINE * getLine(floor, lineInFloor))) + ((floor - 1) * (4));
}

/**
 * 
 * @param {number} floor 
 * @param {number} lineInFloor 
 * @param {number} maxFloor 
 * @param {number} maxLine 
 * @returns {string} char to display
 */
function convertString(floor, lineInFloor, maxFloor, maxLine) {
    const nbChara = nbChar(floor, lineInFloor);
    const nbLineForLastFloor = (nbLineByFloor(maxFloor) - 1);
    const nbCharaMax = nbChar(maxFloor, nbLineForLastFloor);
    const nbSpace = Math.floor((nbCharaMax - nbChara) / 2);

    //if door
    if (floor === maxFloor &&
        nbLineForLastFloor - lineInFloor < maxFloor) {

        //CALCULATE COORDINATE OF DOOR AND TAKE AVANT LAST CHARA OF MIDDLE LINE AND $ 
        if (floor >= 5) {
            return '$';
        } else {
            return '|';
        }
    } else {
        return '*';
    }
}

//main(process.argv);

console.log(getNbLineMax(1) + ' line(s)');
console.log(getNbLineMax(2) + ' line(s)');
console.log(getNbLineMax(3) + ' line(s)');

convertString(1, 0, 1, getNbLineMax(1));
convertString(1, 1, 1, getNbLineMax(1));
convertString(1, 2, 1, getNbLineMax(1));
convertString(1, 0, 2, getNbLineMax(2));
convertString(1, 1, 2, getNbLineMax(2));
convertString(1, 2, 2, getNbLineMax(2));
convertString(1, 3, 2, getNbLineMax(2));
convertString(1, 0, 3, getNbLineMax(3));

console.log(nbChar(1, 0, 1, 3) + ' char(s)');
console.log(nbChar(1, 1, 1, 3) + ' char(s)');
console.log(nbChar(1, 2, 1, 3) + ' char(s)');
console.log(nbChar(2, 0, 1, 3) + ' char(s)');
console.log(nbChar(2, 1, 1, 3) + ' char(s)');
console.log(nbChar(2, 2, 1, 3) + ' char(s)');
console.log(nbChar(2, 3, 1, 3) + ' char(s)');
console.log(nbChar(3, 0, 1, 3) + ' char(s)');



//console.log(nbChar(3, 0, 1, 3) + ' char(s)');
