
export class ArrayHelper {
  public static getArrayChunks(inputArray: any = [], chunkSize: number = 4) {
    const resultArray: any = [];
    for (let i = 0; i < inputArray.length; i += chunkSize) {
      const chunk = inputArray.slice(i, i + chunkSize);
      resultArray.push(chunk);
    }
    return resultArray;
  }
}

