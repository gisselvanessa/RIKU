
export function validCedulaPrefix(value: string) {
  const prefix = parseInt(value.substr(0, 2), 10);
  if (prefix === 0 || prefix > 24 || prefix === 30 || prefix === 50) {
    // Invalid province
    return false;
  }
  return true;
}

export function isValidSSN(ssnNo: any) {
  if (!ssnNo) return false;
  const regex = new RegExp(/^(?!666|000|9\d{2})\d{3}-(?!00)\d{2}-(?!0{4})\d{4}$/);
  return regex.test(ssnNo);
}


export function validPrefix(value: any) {
  const prefix = parseInt(value.substr(0, 2), 10);
  if (prefix < 0 || prefix > 30) {
      // Invalid province
      return false;
  }

  return true;
}

export function splitAt(value: any, ...points: any) {
  const parts = [0, ...points].map((p, idx) => {
      const nvalue = idx >= points.length ? value.length : points[idx];
      const np = nvalue < 0 ? value.length + nvalue : nvalue;
      const pp = p < 0 ? value.length + p : p;

      return value.substr(pp, np - pp);
  });
  return parts.filter((v) => v.length !== 0);
}


export function sumAllDigits(value: any) {
  let localValue = value;
  let sum = 0;

  while (localValue) {
      sum += localValue % 10;
      localValue = Math.floor(localValue / 10);
  }
  return sum;
}


export function weightedSum(input: any, { weights = [1], sumByDigit = true, reverse = false }) {
  const noOfWeights = weights.length;
  const numbers = input.split('').map((number: any) => parseInt(number, 10));
  const weighted = (reverse ? numbers.reverse() : numbers).map((v: any, idx: any) => v * weights[idx % noOfWeights]);
  const defaultSum = 0;
  const weightedSum = weighted.reduce((currentSum: any, value: any) => {
      if (sumByDigit && value > 9) {
          return currentSum + sumAllDigits(value);
      }
      return currentSum + value;
  }, defaultSum);
  return weightedSum;
}


export function  isValidCedulaId(identifier: any) {
  if (typeof identifier !== 'string') return false;
  // if (identifier.length !== 13) {
  //  return false;
  // }
  if (!validPrefix(identifier))
      return false;

  if (parseInt(identifier[2], 10) > 6) {
      return false;
  }
  const [front, end] = splitAt(identifier, 9, 10);
  const weightedSumResult = weightedSum(front, {
      weights: [2, 1, 2, 1, 2, 1, 2, 1, 2],
      sumByDigit: true,
  });
  if (10 - (weightedSumResult % 10) !== parseInt(end, 10)) return false;
  return true;
}


