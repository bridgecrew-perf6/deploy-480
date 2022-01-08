module.exports = {
  createAutoComplete: function (data) {
    const answerArrMemory = {};
    return function (str) {
      if (str) {
        if (answerArrMemory[str] !== undefined) {
          return answerArrMemory[str];
        } else {
          let tempArr = [];
          const subStr = str.toLowerCase();
          if (data.length < 10) {
            data.forEach((element) => {
              if (element.toLowerCase().startsWith(subStr)) {
                tempArr.push(element);
              }
            });
          } else {
            const left = binarySearch(data, subStr, leftPosition, "left");
            const right = binarySearch(data, subStr, rightPosition, "right");
            tempArr = data.slice(left, right + 1);
          }
          answerArrMemory[str] = tempArr;
          return tempArr;
        }
      } else return [];
    };
  },
};

const leftPosition = (arrElement, searchValue) => {
  return arrElement.toLowerCase().slice(0, searchValue.length) < searchValue;
};
const rightPosition = (arrElement, searchValue) => {
  return arrElement.toLowerCase().slice(0, searchValue.length) <= searchValue;
};

const binarySearch = (arr, val, searchCallBack, searchPosition) => {
  let leftIndex = 0;
  let rightIndex = arr.length - 1;
  while (rightIndex - leftIndex > 1) {
    let currentIndex = Math.floor((rightIndex + leftIndex) / 2);
    if (searchCallBack(arr[currentIndex], val)) {
      leftIndex = currentIndex;
    } else {
      rightIndex = currentIndex;
    }
  }
  if (searchPosition === "left") return rightIndex;
  if (searchPosition === "right") return leftIndex;
  return -1;
};
