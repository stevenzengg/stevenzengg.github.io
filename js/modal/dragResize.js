export function makeDraggableResizable(target) {
  const iframe = target.querySelector('iframe');

  interact(target)
    .draggable({
      allowFrom: '.app-header',
      listeners: {
        start(event) {
          if (iframe) iframe.style.pointerEvents = 'none'; // Block iframe clicks
        },
        move(event) {
          const { target, dx, dy } = event;
          const x = (parseFloat(target.getAttribute('data-x')) || 0) + dx;
          const y = (parseFloat(target.getAttribute('data-y')) || 0) + dy;

          Object.assign(target.style, {
            transform: `translate(${x}px, ${y}px)`
          });

          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
        },
        end(event) {
          if (iframe) iframe.style.pointerEvents = 'auto'; // Restore iframe clicks
        }
      }
    })
    .resizable({
      edges: { top: true, left: true, bottom: true, right: true },
      margin: 3,
      listeners: {
        move(event) {
          let { x, y } = event.target.dataset;
          x = parseFloat(x) || 0;
          y = parseFloat(y) || 0;

          Object.assign(event.target.style, {
            width: `${event.rect.width}px`,
            height: `${event.rect.height}px`,
          });

          x += event.deltaRect.left;
          y += event.deltaRect.top;

          Object.assign(event.target.style, {
            transform: `translate(${x}px, ${y}px)`
          });

          event.target.setAttribute('data-x', x)
          event.target.setAttribute('data-y', y)
        }
      }
    });
}
