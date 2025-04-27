let currentTopZIndex = 1000;

export function bringToFront(windowElement) {
  currentTopZIndex += 1;
  windowElement.style.zIndex = currentTopZIndex;
}
