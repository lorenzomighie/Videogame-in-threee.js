export function dumpGltf(obj, lines = [], isLast = true, prefix = '') {
  const localPrefix = isLast ? '└─' : '├─';
  lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
  const newPrefix = prefix + (isLast ? '  ' : '│ ');
  const lastNdx = obj.children.length - 1;
  obj.children.forEach((child, ndx) => {
    const isLast = ndx === lastNdx;
    dumpGltf(child, lines, isLast, newPrefix);
  });
  return lines;
}

export function addToPx (px, delta) {
  return (parseInt(px, 10) + delta).toString() + 'px';
}

export function divPx (px, div) {
  return (parseInt(px, 10) / div).toString() + 'px';
}