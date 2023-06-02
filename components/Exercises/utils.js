export const sortByPropertyWithHighDistribution = (arr, property) => {
  const sortedArr = [...arr];

  sortedArr.sort((a, b) => {
    if (a[property] < b[property]) {
      return -1;
    }
    if (a[property] > b[property]) {
      return 1;
    }
    return 0;
  });

  const frequencies = {};
  sortedArr.forEach(obj => {
    const value = obj[property];
    frequencies[value] = (frequencies[value] || 0) + 1;
  });

  const uniqueValues = Object.keys(frequencies);

  const maxFrequency = Math.max(...Object.values(frequencies));
  const rearrangedArray = [];

  for (let i = 0; i < maxFrequency; i++) {
    for (let j = 0; j < uniqueValues.length; j++) {
      const value = uniqueValues[j];
      const subset = sortedArr.filter(obj => obj[property] === value);

      if (subset.length > i) {
        rearrangedArray.push(subset[i]);
      }
    }
  }

  return rearrangedArray;
}

export const shuffle = a => {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const muscleToColor = {
  Abdominals: "red",
  Biceps: "pink",
  Calves: "grape",
  Chest: "violet",
  Forearms: "indigo",
  Glutes: "blue",
  Hamstrings: "cyan",
  "Lower back": "teal",
  Obliques: "green",
  Quads: "lime",
  Shoulders: "yellow",
  Traps: "orange",
  Triceps: "gray",
}