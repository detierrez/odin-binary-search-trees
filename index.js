console.log("hello world");

class Queue {
  constructor(length) {
    this.array = Array(length + 1).fill(null);
    this.first = 0;
    this.last = 0;
  }

  enqueue(value) {
    if (this.isFull) throw new Error("Queue is full");

    this.array[this.last] = value;
    this.last = (this.last + 1) % this.array.length;
  }

  dequeue() {
    if (this.isEmpty) return null;

    const dequeued = this.array[this.first];
    this.array[this.first] = null;
    this.first = (this.first + 1) % this.array.length;
    return dequeued;
  }

  get isEmpty() {
    return this.first === this.last;
  }

  get isFull() {
    return this.first === (this.last + 1) % this.array.length;
  }
}

class Node {
  constructor(data, left = null, right = null) {
    this.data = data;
    this.left = left;
    this.right = right;
  }

  get isLeaf() {
    return this.left === null && this.right === null;
  }
}

class Tree {
  static prettyPrint = (node, prefix = "", isLeft = true) => {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      this.prettyPrint(
        node.right,
        `${prefix}${isLeft ? "│   " : "    "}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  };

  constructor(array) {
    const noDuplicates = [...new Set(array)];
    const sorted = noDuplicates.sort((a, b) => a - b);
    this.root = this.buildTree(sorted);
    this.length = sorted.length;
  }

  print() {
    Tree.prettyPrint(this.root);
  }

  buildTree(array, start = 0, end = array.length - 1) {
    if (start > end) return null;
    const mid = Math.floor((start + end) / 2);
    return new Node(
      array[mid],
      this.buildTree(array, start, mid - 1),
      this.buildTree(array, mid + 1, end)
    );
  }

  insert(value, node = this.root) {
    if (node === null) {
      this.length++;
      return new Node(value);
    }

    if (value < node.data) {
      node.left = this.insert(value, node.left);
    } else if (value > node.data) {
      node.right = this.insert(value, node.right);
    }
    return node;
  }

  delete(value, node = this.root) {
    if (node === null) return node;
    if (value < node.data) {
      node.left = this.delete(value, node.left);
    } else if (value > node.data) {
      node.right = this.delete(value, node.right);
    } else {
      if (node.left === null) {
        this.length--;
        return node.right;
      }
      if (node.right === null) {
        this.length--;
        return node.left;
      }
      const successor = this.getSuccessor(node);
      node.data = successor;
      node.right = this.delete(successor, node.right);
    }
    return node;
  }

  getSuccessor(node) {
    let successor = node.right;
    while (successor.left) {
      successor = successor.left;
    }
    return successor.data;
  }

  find(value, node = this.root) {
    if (node === null || value === node.data) return node;
    const nextNode = value < node.data ? node.left : node.right;
    return this.find(value, nextNode);
  }

  levelOrderForEach(callback) {
    const queue = new Queue(this.length);
    queue.enqueue(this.root);
    let node = queue.dequeue();
    while (node) {
      if (node.left) queue.enqueue(node.left);
      if (node.right) queue.enqueue(node.right);
      callback(node);

      node = queue.dequeue();
    }
  }

  inOrderForEach(callback, node = this.root) {
    if (node === null) return;
    this.inOrderForEach(callback, node.left);
    callback(node);
    this.inOrderForEach(callback, node.right);
  }

  preOrderForEach(callback, node = this.root) {
    if (node === null) return;
    callback(node);
    this.preOrderForEach(callback, node.left);
    this.preOrderForEach(callback, node.right);
  }

  postOrderForEach(callback, node = this.root) {
    if (node === null) return;
    this.postOrderForEach(callback, node.left);
    this.postOrderForEach(callback, node.right);
    callback(node);
  }

  height(value) {
    const node = this.find(value);
    return node === null ? null : this.maxHeight(node);
  }

  maxHeight(node) {
    if (node === null) return -1;
    return Math.max(this.maxHeight(node.left), this.maxHeight(node.right)) + 1;
  }

  depth(value, node = this.root, count = 0) {
    if (node === null) return null;
    if (node.data === value) return count;

    const nextNode = value < node.data ? node.left : node.right;
    return this.depth(value, nextNode, count + 1);
  }

  isBalanced(node = this.root) {
    if (node === null) return -1;

    const leftHeight = this.isBalanced(node.left);
    if (leftHeight === false) return false;
    const rightHeight = this.isBalanced(node.right);
    if (rightHeight === false) return false;

    if (Math.abs(leftHeight - rightHeight) > 1) return false;

    return node === this.root ? true : Math.max(leftHeight, rightHeight) + 1;
  }

  rebalance() {
    const array = [];
    this.inOrderForEach((node) => array.push(node.data));
    this.root = this.buildTree(array);
  }
}

const array = [];
for (let i = 0; i < 20; i++) {
  array.push(Math.floor(Math.random() * 100));
}

const tree = new Tree(array);

console.log(tree.isBalanced());
const printNode = (node) => console.log(node.data);

console.log("Level Order");
tree.levelOrderForEach(printNode);

console.log("Pre Order");
tree.preOrderForEach(printNode);

console.log("In Order");
tree.inOrderForEach(printNode);

console.log("Post Order");
tree.postOrderForEach(printNode);

console.log("Inserting 20 random numbers >= 100");
for (let i = 0; i < 20; i++) {
  const randomMoreThan100 = 100 + Math.floor(Math.random() * 100);
  tree.insert(randomMoreThan100);
}

console.log("Is Balanced: " + tree.isBalanced());

console.log("Balancing the tree");
tree.rebalance();
console.log("Is Balanced: " + tree.isBalanced());

console.log("Level Order");
tree.levelOrderForEach(printNode);

console.log("Pre Order");
tree.preOrderForEach(printNode);

console.log("In Order");
tree.inOrderForEach(printNode);

console.log("Post Order");
tree.postOrderForEach(printNode);

tree.print();
