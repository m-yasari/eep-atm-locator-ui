/**
* @param num The number to round
* @param precision The number of decimal places to preserve
*/
export const roundUp = (num, precision) => {
    precision = Math.pow(10, precision)
    return Math.ceil(num * precision) / precision
}

