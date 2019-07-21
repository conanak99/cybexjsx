/**
 * 根据含精度资产价值转换为整数形式资产数量
 *
 * @export
 * @param {number} value 资产价值浮点数value
 * @param {number} precision 资产精度
 * @returns 整数形式资产数量
 */
export declare function calcAmount(value: number, precision: number): number;
/**
 * 根据资产数量于精度生成含精度价值
 *
 * @export
 * @param {number} amount
 * @param {number} precision
 * @returns 含精度资产价值
 */
export declare function calcValue(amount: number, precision: number): number;
