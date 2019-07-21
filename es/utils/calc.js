import BigNumber from "bignumber.js";
/**
 * 根据含精度资产价值转换为整数形式资产数量
 *
 * @export
 * @param {number} value 资产价值浮点数value
 * @param {number} precision 资产精度
 * @returns 整数形式资产数量
 */
export function calcAmount(value, precision) {
    return Math.floor(new BigNumber(value).multipliedBy(Math.pow(10, precision)).toNumber());
}
/**
 * 根据资产数量于精度生成含精度价值
 *
 * @export
 * @param {number} amount
 * @param {number} precision
 * @returns 含精度资产价值
 */
export function calcValue(amount, precision) {
    return new BigNumber(amount).dividedBy(Math.pow(10, precision)).toNumber();
}
