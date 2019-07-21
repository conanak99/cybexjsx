/**
    Convert 12.34 with a precision of 3 into 12340

    @arg {number|string} number - Use strings for large numbers.  This may contain one decimal but no sign
    @arg {number} precision - number of implied decimal places (usually causes right zero padding)
    @return {string} -
*/
declare const NumberUtils: {
    toImpliedDecimal: (number: any, precision: any) => any;
};
export default NumberUtils;
