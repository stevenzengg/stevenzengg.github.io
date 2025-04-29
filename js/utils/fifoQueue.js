class FIFOManager {
    constructor(limit = 2000) {
      this.limit = limit;
    }
  
    checkQueue(terminalDiv) {
      const children = terminalDiv.children;
      while (children.length > this.limit) {
        terminalDiv.removeChild(children[0]);
      }
    }
  }
  
  export const fifoManager = new FIFOManager();
  