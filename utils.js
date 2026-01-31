// Weighted random
function distribute(ranges) {
  let values = [];
  for(let range of ranges) {
    for(let w = 0; w < range.weight; w++) {
      values.push(randRange(range.min, range.max));
    }
  }
  return randArr(values);
}

// Get random value from array
function randArr(array) {
    let i = Math.floor(Math.random() * array.length);
    console.log(array, array[i]);
    return array[i];
}

// Get random value from range
function randRange(min, max) {
    return (Math.random() * (max-min)) + min;
}