export function toCsv<T extends Record<string, any>>(rows: T[]): string {
  if (rows.length === 0) return '';
  
  const headers = Object.keys(rows[0]);
  
  const esc = (v: any) => {
    if (v == null) return '';
    const s = String(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  
  const out = [headers.join(',')];
  
  for (const r of rows) {
    out.push(headers.map((h) => esc(r[h])).join(','));
  }
  
  return out.join('\n');
}