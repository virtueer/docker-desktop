export const text2json = <T>(text: string): T[] => {
  const lines = text.trim().split(/\r?\n/);
  const arr = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    arr.push(JSON.parse(line));
  }

  return arr;
};

export const parseLabels = <T>(item: any): T => {
  const labels = item.Labels.split(',');
  const parsed_labels = {};

  for (const label of labels) {
    const [key, value] = label.split('=');
    parsed_labels[key] = value;
  }

  item.Labels = parsed_labels;

  return item;
};
