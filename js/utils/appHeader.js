export function createAppHeader(onClose, onMaximize) {
  const header = document.createElement("div");
  header.className = "modal-header";

  const red = document.createElement("span");
  red.className = "traffic-light red";
  red.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent any accidental bubbling
    if (onClose) onClose();
  });
  header.addEventListener("mousedown", (e) => {
    e.preventDefault(); // prevent text selection while dragging
  });
  const yellow = document.createElement("span");
  yellow.className = "traffic-light yellow";

  const green = document.createElement("span");
  green.className = "traffic-light green";
  green.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent dragging when clicking
    if (onMaximize) onMaximize();
  });

  header.appendChild(red);
  header.appendChild(yellow);
  header.appendChild(green);

  return header;
}
