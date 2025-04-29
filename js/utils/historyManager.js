class HistoryManager {
  constructor(limit = 2000) {
    this.limit = limit;
    this.history = new DoublyLinkedList();
    this.currentNode = null; // for navigation
  }

  add(command) {
    if (command.trim() === "") return;

    this.history.push(command);

    if (this.history.size() > this.limit) {
      this.history.shift();
    }

    this.resetNavigation();
  }

  getPrevious() {
    if (!this.currentNode) {
      this.currentNode = this.history.tail;
    } else if (this.currentNode.prev) {
      this.currentNode = this.currentNode.prev;
    }
    return this.currentNode?.value ?? "";
  }

  getNext() {
    if (this.currentNode && this.currentNode.next) {
      this.currentNode = this.currentNode.next;
      return this.currentNode.value;
    } else {
      this.currentNode = null; // at end
      return "";
    }
  }

  resetNavigation() {
    this.currentNode = null;
  }
}
class ListNode {
  constructor(value) {
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}
class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  push(value) {
    const node = new ListNode(value);

    if (!this.head) {
      this.head = this.tail = node;
    } else {
      node.prev = this.tail;
      this.tail.next = node;
      this.tail = node;
    }
    this.length++;
  }

  shift() {
    if (!this.head) return undefined;

    const value = this.head.value;
    this.head = this.head.next;

    if (this.head) {
      this.head.prev = null;
    } else {
      this.tail = null; // list became empty
    }

    this.length--;
    return value;
  }

  size() {
    return this.length;
  }
}

export const historyManager = new HistoryManager();
