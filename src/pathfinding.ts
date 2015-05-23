/// <reference path="../js/Babylon.js-master/babylon.2.1.d.ts"/>
/// <reference path="SKYScene"/>

class ASNode {
  x: number; // node X
  y: number; // node Y
  v: number; // value
  f: number; // the result of the f(x) on this node
  g: number; // the GScore of this node
  h: number; // the heuristic result on this node
  parent: ASNode;

  constructor(x:number, y:number, v:number, f:number = 0, g:number = 0, h:number = 0, parent:ASNode = null) {
    this.x = x;
    this.y = y;
    this.v = v;
    this.f = f;
    this.g = g;
    this.h = h;
    this.parent = parent;
  }
  toVector2() {
    return new BABYLON.Vector2(this.x, this.y);
  }
}

class AS {

  map:Array<Array<ASNode>>;
  path:Array<BABYLON.Vector2>;

  /*************************************************************************
  * map : the current map to go througth
  * firstNode : the current node {x, y}
  * targetNode : the target node {x, y}
  * where    x: xpos in tile
  *          y: ypos in tile
  *          f: 0 (the result of the f(x) on this node)
  *          g: 0 (the GScore of this node)
  *          h: 0 (the heuristic result on this node)
  *          parent: null (the previous node in the AStar chain)
  *
  * Return the path to the target
  */
  constructor(map:Array<Array<number>>, firstNode:BABYLON.Vector2, targetNode:BABYLON.Vector2, maxDist:number = 10) {
    let i, l,
    openList = new Array<ASNode>(),
    closedList = new Array<ASNode>();

    // copy locally the map
    this.map = [];
    for (i = 0, l = map.length; i < l; i++) {
      this.map.push([]);
      for (var j = 0, k = map[i].length; j < k; j++) {
        let o = new ASNode(i, j, map[i][j]);
        this.map[i].push(o);
      }
    }

    // add first block
    openList.push(this.map[firstNode.x][firstNode.y]);

    while (openList.length > 0) {

      // Grab the lowest f(x) to process next
      var lowInd = 0;
      for (i = 0; i < openList.length; ++i) {
        if (openList[i].f < openList[lowInd].f) {
          lowInd = i;
        }
      }
      var currentNode = openList[lowInd];

      // End case -- result has been found, return the traced path
      if (currentNode.y === targetNode.y && currentNode.x === targetNode.x) {
        var tmpNode = currentNode;
        var tmpPath = new Array<BABYLON.Vector2>();

        while (tmpNode.parent != null) {
          tmpPath.push(new BABYLON.Vector2(tmpNode.x, tmpNode.y));
          tmpNode = tmpNode.parent;
        }
        // push the first one
        tmpPath.push(new BABYLON.Vector2(tmpNode.x, tmpNode.y));

        tmpPath.reverse();
        this.path = tmpPath;
        //console.log("path: " + this.path);
        return;
      }

      // Normal case -- move currentNode from open to closed, process each of its neighbors
      openList.splice(lowInd); // remove currentNode;
      closedList.push(currentNode);
      var neighbors = this.getNeighbors(currentNode);

      for (i = 0; i < neighbors.length; ++i) {
        var neighbor = neighbors[i];
        // not a valid node to process, skip to next neighbor
        if (closedList.indexOf(neighbor) !== -1) continue;

        // g score is the shortest distance from start to current node, we need to check if
        //	 the path we have arrived at this neighbor is the shortest one we have seen yet
        var gScore = currentNode.g + 1; // 1 is the distance from a node to it's neighbor
        var gScoreIsBest = false;

        if (openList.indexOf(neighbor) === -1) {
          // This the the first time we have arrived at this node, it must be the best
          // Also, we need to take the h (heuristic) score since we haven't done so yet

          gScoreIsBest = true;
          neighbor.h = this.heuristic(neighbor.x, neighbor.y, targetNode.x, targetNode.y);
          openList.push(neighbor);
        }

        else if (gScore < neighbor.g) {
          // We have already seen the node, but last time it had a worse g (distance from start)
          gScoreIsBest = true;
        }

        if (gScoreIsBest) {
          // Found an optimal (so far) path to this node.	 Store info on how we got here and
          //	just how good it really is...
          neighbor.parent = currentNode;
          neighbor.g = gScore;
          neighbor.f = neighbor.g + neighbor.h;
        }
      }
    }

    //return [];
  }

  /******************************************************************
  * return the neighbors list of the node b
  */
  getNeighbors (node) {
    var neighbors:Array<ASNode> = [],
    l, r, t, b;

    // l&r neigbors
    if (node.z - 1 >= 0)
    l = this.map[node.x][node.z - 1];
    if (l !== undefined && l.v === 0)
    neighbors.push(l);

    if (node.z + 1 < this.map[node.x].length)
    r = this.map[node.x][node.z + 1];
    if (r !== undefined && r.v === 0)
    neighbors.push(r);


    // t&b neigbors
    if (node.x - 1 >= 0)
    b = this.map[node.x - 1][node.z];
    if (b !== undefined && b.v === 0)
    neighbors.push(b);

    if (node.x + 1 < this.map.length)
    t = this.map[node.x + 1][node.z];
    if (t !== undefined && t.v === 0)
    neighbors.push(t);

    return neighbors;
  }

  heuristic (x1, y1, x2, y2) {
    var d1 = Math.abs(x2 - x1);
    var d2 = Math.abs(y2 - y1);
    return d1 + d2; //manhattan dist
  }

  getNextMove (currentPosition: BABYLON.Vector2): BABYLON.Vector2 {
    var i, l;

    for (i = 0, l = this.path.length; i < l; ++i) {
      if (this.path[i].x === currentPosition.x &&
        this.path[i].y === currentPosition.y) {

          // not the end of path
          if (i < l - 1) {
            //console.log("move to :" + this.path[i+1].x + ", " this.path[i+1].z);
            return new BABYLON.Vector2(
              (this.path[i + 1].x - currentPosition.x),
              (this.path[i + 1].y - currentPosition.y)
            );
          }
        }
      }

      // end of path, or current position not matched
      return new BABYLON.Vector2(0, 0);
    }
  }
