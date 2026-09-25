export function el<K extends keyof HTMLElementTagNameMap>(tag: K, text = '', className = '') { const node = document.createElement(tag); if (text) node.textContent = text; if (className) node.className = className; return node; }
export function button(text: string, onClick: () => void, className = '') { const node = el('button', text, className); node.type = 'button'; node.onclick = () => { node.focus({ preventScroll: true }); onClick(); }; return node; }
export function paragraph(text: string) { return el('p', text); }
export function section(title: string, ...children: Node[]) { const node = el('section', '', 'panel'); node.append(el('h2', title), ...children); return node; }
export function art(name: string, className = 'illustration') { const img = el('img', '', className); img.src = `${import.meta.env.BASE_URL}art/${name}.svg`; img.alt = ''; img.setAttribute('aria-hidden', 'true'); return img; }
export function detail(title: string, ...children: Node[]) { const node = el('details'); node.append(el('summary', title), ...children); return node; }
export function download(name: string, value: unknown) { const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' })); const a = el('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
export function dialog(title: string, content: Node[], accept: string, action: () => void) {
  const origin = document.activeElement as HTMLElement | null;
  const node = el('dialog'); const heading = el('h2', title); heading.id = 'dialog-title'; node.setAttribute('aria-labelledby', heading.id);
  const close = () => { node.close(); node.remove(); if (origin?.isConnected) origin.focus(); };
  node.append(heading, ...content, button(accept, () => { close(); action(); }, 'primary'), button('Cancelar', close, 'secondary'));
  node.addEventListener('cancel', e => { e.preventDefault(); close(); });
  document.body.append(node); node.showModal(); return { node, close };
}

