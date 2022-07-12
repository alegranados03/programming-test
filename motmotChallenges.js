//motmotChallenges.js

/**
     * Ejercicio 1:
    Dado una cadena de texto S de tamaño N, se considera correctamente anidada si se cumple las siguientes condiciones:

    La cadena esta vacia.
    Tiene la forma (U), [U] o {U} donde U es otra cadena de texto correctamente anidada.
    Tiene la forma VM, donde V y M son cadenas de texto correctamente anidadas.
    Por ejemplo:

    Dada la cadena: S = "{[()()]}", esta correctamente anidada.
    Dada la cadena: S = "([)()]", no esta correctamente anidada.
    Escriba una funcion que dado una cadena texto S, retorne 1 si esta correctamente anidada o 0 si no lo esta.
 */

function checkIfCorrectlyNested(strToCheck) {
  const openBrackets = ["(", "{", "["],
    closeBrackets = [")", "}", "]"],
    validCloses = ["()", "[]", "{}"],
    bracketStackIndexes = [];
  for (let i = 0; i < strToCheck.length; i++) {
    if (openBrackets.includes(strToCheck[i])) bracketStackIndexes.push(i);
    if (closeBrackets.includes(strToCheck[i])) {
      const openIndex = bracketStackIndexes[bracketStackIndexes.length - 1];
      const closeBracket = strToCheck[openIndex] + strToCheck[i];
      if (validCloses.includes(closeBracket)) {
        bracketStackIndexes.pop();
      } else {
        return false;
      }
    }
  }
  return true;
}

// console.log(checkIfCorrectlyNested("{[()()]}"));
// console.log(checkIfCorrectlyNested("([)()]"));
// console.log(checkIfCorrectlyNested("[{}][{]}"));
// console.log(checkIfCorrectlyNested("[](){}"));
// console.log(checkIfCorrectlyNested("](){}"));

/**
 * 
    Ejercicio 2:
    Dada las siguientes conexiones entre ciudades y sus distancias en kilómetros.
    Realice una función que obtenga el camino más corto para trasladarse de una ciudad a otra dada una ciudad de origen y otra de destino.

    Narnia - 8 km - Mordor
    Hogwarts - 6 km - Invernalia 
    Mordor - 5 km - Tatooine
    Mordor - 3 km - Hogwarts
    Kokiri Forest - 6 km Tatooine
    Kokiri Forest - 2 km Hogwarts
    Invernalia - 3 km - Springfield
    Invernalia - 2 km - Tatooine
    Springfield - 4 km - Kokiri Forest
    Springfield - 7 km - Tatooine
    Tatooine - 3 km - Narnia
 */

class Node {
  constructor(name) {
    this.name = name;
    this.relations = [];
  }

  addRelation(node, distance) {
    if (this.relations.find((relation) => relation.node === node)) return;
    this.relations.push({ node, distance });
  }
}

class Graph {
  constructor(nodes) {
    this.nodes = [...nodes];
    this.pathTable = undefined;
    this.bestPath = [];
  }
  addNewNode(node) {
    this.nodes.push(node);
  }

  getNodeByName(name) {
    return this.nodes.find((node) => node.name === name);
  }

  addNewRelation(nodeName1, nodeName2, distance) {
    const firstNode = this.getNodeByName(nodeName1);
    const secondNode = this.getNodeByName(nodeName2);
    if (firstNode && secondNode) {
      firstNode.addRelation(secondNode, distance);
      secondNode.addRelation(firstNode, distance);
    }
  }

  createPathTable() {
    // |node | shortest distance | parent|
    this.pathTable = this.nodes.map((node) => ({
      node,
      shortestDistance: Number.POSITIVE_INFINITY,
      parent: null,
    }));
  }

  getTablePathRow(node) {
    return this.pathTable.find((row) => row.node === node);
  }

  shortestPath(origin, destiny) {
    this.createPathTable();
    const startNode = this.getNodeByName(origin),
      endNode = this.getNodeByName(destiny);

    const tableRow = this.getTablePathRow(startNode);
    tableRow.shortestDistance = 0;
    const visited = [startNode];

    while (visited.length <= this.nodes.length) {
      const currentNode = visited[visited.length - 1],
        currentNodeTableRow = this.getTablePathRow(currentNode);
      if (currentNode === startNode) {
        currentNodeTableRow.shortestDistance = 0;
      }

      currentNode.relations.forEach((relation) => {
        // verificar las conexiones que tienen contra el mejor tiempo de llegada y modificar la tabla
        if (!visited.includes(relation.node)) {
          const baseDistance = currentNodeTableRow.shortestDistance,
            distanceFromCurrentNode = relation.distance,
            nextNodeTableRow = this.getTablePathRow(relation.node),
            newDistance = baseDistance + distanceFromCurrentNode;

          if (newDistance < nextNodeTableRow.shortestDistance) {
            nextNodeTableRow.shortestDistance = newDistance;
            nextNodeTableRow.parent = currentNode;
          }
        }
      });

      //seleccionar el mejor camino a elegir de la tabla
      let bestRow = {
        node: {},
        shortestDistance: Number.POSITIVE_INFINITY,
        parent: null,
      };
      this.pathTable.forEach((row) => {
        if (
          row.shortestDistance > 0 &&
          !visited.includes(row.node) &&
          row.shortestDistance < bestRow.shortestDistance
        ) {
          bestRow = row;
        }
      });

      visited.push(bestRow.node);

      if (visited.length === this.nodes.length) break;
    }

    this.printShortestPath(endNode);
  }

  printShortestPath(node) {
    this.bestPath = [];
    while (node) {
      const row = this.pathTable.find((r) => r.node === node);
      this.bestPath.push(row.node.name);
      if (row.parent === null) node = null;
      else node = row.parent;
    }
    console.table(this.bestPath.reverse());
  }
}

//flujo ejercicio 2
const graph = new Graph(
  [
    "Narnia",
    "Mordor",
    "Hogwarts",
    "Invernalia",
    "Tatooine",
    "Springfield",
    "Kokiri Forest",
  ].map((name) => new Node(name))
);

graph.addNewRelation("Narnia", "Mordor", 8);
graph.addNewRelation("Hogwarts", "Invernalia", 6);
graph.addNewRelation("Mordor", "Tatooine", 5);
graph.addNewRelation("Mordor", "Hogwarts", 3);
graph.addNewRelation("Kokiri Forest", "Tatooine", 6);
graph.addNewRelation("Kokiri Forest", "Hogwarts", 2);
graph.addNewRelation("Invernalia", "Springfield", 3);
graph.addNewRelation("Invernalia", "Tatooine", 2);
graph.addNewRelation("Springfield", "Kokiri Forest", 4);
graph.addNewRelation("Springfield", "Tatooine", 7);
graph.addNewRelation("Tatooine", "Narnia", 3);

graph.shortestPath("Narnia", "Springfield");
graph.shortestPath("Tatooine", "Kokiri Forest");
graph.shortestPath("Invernalia", "Tatooine");
graph.shortestPath("Mordor", "Springfield");

/**
 * 
 Ejercicio 3:
Escriba un programa que identifique el estado de un Juego.
Dada una matriz de N*M representando el campo de juego. La identificación de cada fila son números de 1 a N y la de cada columna son las letras del alfabeto. 
De modo que cada celda es posible identificarla uniendo su identificador de fila y columna. Por ejemplo 1A, 4B, 5K.

Dentro del campo de juego hay barcos rectagulares los cuales se representan por 2 coordenadas, la esquina superior izquierda y la esquina superior derecha. 
En cada turno es possible definir varios disparos en coordenadas específicas, estos disparos se representan por un arreglos de coordenadas.
Si un disparo coincide en un barco, el barco se considera dañado. Si el barco es impactado en todas sus coordenadas se considera destruido.

Escriba una función que reciba el tamaño del campo de juego, N y M. Un arreglo de barcos, cada barco se representan por 2 coordenadas.
 Y un arreglos de disparos donde cada disparo es una coordenada. La función debe retornar,
  la cantidad de barcos sin daños, cantidad de barcos dañados, y cantidad de barcos destruidos.

Se asume que todos los disparos realizados seran validos y que pueden repetirse coordenadas de disparos.
Utilice el tipo de datos que mas sea conveniente para cada tipo de entidad (campo de juego, coordenadas, barcos, disparos).
 */

class Boat {
  constructor(coordinates) {
    this.healthyCoordinates = coordinates;
    this.totalCoordinates = coordinates.length;
  }

  destroyCoordinate(x, y) {
    this.healthyCoordinates = this.healthyCoordinates.filter(
      (coordinate) => coordinate[0] === x && coordinate[1] === y
    );
  }
}

function playBattleships(rows, columns, boats, shots) {
  boatsDamagedSet = new Set();
  const matrix = Array(rows)
    .fill(0)
    .map((space) => Array(columns).fill(space));

  boats.forEach((boat) => {
    boat.healthyCoordinates.forEach((coordinate) => {
      matrix[coordinate[0]][coordinate[1]] = boat;
    });
  });

  shots.forEach((shot) => {
    const x = shot.charCodeAt(0) - 65,
      y = +shot[1] - 1,
      cellContent = matrix[x][y];

    if (cellContent !== 0) {
      // si no es 0, es un barco
      const boat = cellContent;
      boat.destroyCoordinate(x, y);
      boatsDamagedSet.add(boat);
    }
  });

  let damagedBoats = 0,
    destroyedBoats = 0;

  Array.from(boatsDamagedSet.values()).forEach((boat) => {
    if (boat.healthyCoordinates.length === 0) destroyedBoats++;
    else if (boat.healthyCoordinates.length !== boat.totalCoordinates)
      damagedBoats++;
  });

  return {
    notDamagedBoats: boats.length - damagedBoats - destroyedBoats,
    damagedBoats,
    destroyedBoats,
  };
}

const boats = [
  [
    [0, 0],
    [0, 1],
  ],
  [
    [1, 2],
    [1, 3],
  ],
  [
    [3, 1],
    [4, 1],
  ],
  [
    [4, 2],
    [5, 2],
  ],
].map((coordinates) => new Boat(coordinates));

const shots = ["A1", "B3", "B4", "C3", "D4"];

// console.log(playBattleships(6, 6, boats, shots));
