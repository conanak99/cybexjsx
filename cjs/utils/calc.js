"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = __importDefault(require("bignumber.js"));
/**
 * 根据含精度资产价值转换为整数形式资产数量
 *
 * @export
 * @param {number} value 资产价值浮点数value
 * @param {number} precision 资产精度
 * @returns 整数形式资产数量
 */
function calcAmount(value, precision) {
    return Math.floor(new bignumber_js_1.default(value).multipliedBy(Math.pow(10, precision)).toNumber());
}
exports.calcAmount = calcAmount;
/**
 * 根据资产数量于精度生成含精度价值
 *
 * @export
 * @param {number} amount
 * @param {number} precision
 * @returns 含精度资产价值
 */
function calcValue(amount, precision) {
    return new bignumber_js_1.default(amount).dividedBy(Math.pow(10, precision)).toNumber();
}
exports.calcValue = calcValue;
