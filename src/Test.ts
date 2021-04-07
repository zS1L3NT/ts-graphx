import MathParser from "./MathParser"
import assert from "assert"

const calc = (val: string, dev?: boolean): number => new MathParser(val, !!dev).calc()

// Expressions
assert(calc("5") === 5, "5 !== 5")
assert(calc("-5") === -5, "-5 !== -5")
assert(calc("(5)") === 5, "(5) !== 5")
assert(calc("(((((((-3)))))))") === -3, "(-3) !== -3")

// Positive operations
{
	// Simple operations
	assert(calc("1 + 1") === 2, "1 + 1 !== 2")
	assert(calc("10 - 9") === 1, "10 - 9 !== 1")
	assert(calc("3 * 2") === 6, "3 * 2 !== 6")
	assert(calc("6 / 3") === 2, "6 / 3 !== 2")
	assert(calc("4 ^ 3") === 64, "4 ^ 3 !== 64")
	console.log("Simple operations ✔️")

	// Bracket and number operations
	assert(calc("(3 * 2) + 1") === 7, "(3 * 2) + 1 !== 7")
	assert(calc("(3 * 2) - 4") === 2, "(3 * 2) - 4 !== 2")
	assert(calc("(3 * 2) * 3") === 18, "(3 * 2) * 3 !== 18")
	assert(calc("(3 * 2) / 6") === 1, "(3 * 2) / 6 !== 1")
	assert(calc("(3 * 2) ^ 4") === 1296, "(3 * 2) ^ 4 !== 1296")
	console.log("Bracket and number operations ✔️")
}

// Zero exceptions
assert(calc("0 / 1") === 0, "0 / 1 !== 0")
assert.throws(() => calc("0 /0"), Error, "0 / 0 !== Error")
console.log("Zero exceptions ✔️")

// Nagative operations
{
	assert(calc("-1 + 1") === 0, "-1 + 1 !== 0")
	assert(calc("-1 - 1") === -2, "-1 - 1 !== -2")
	assert(calc("-1 * 3") === -3, "-1 * 3 !== -3")
	assert(calc("-1 / -1") === 1, "-1 / -1 !== 1")
	assert(calc("4 ^ -1") === 0.25, "4 ^ -1 !== 0.25")
	console.log("Simple starting negative operations ✔️")

	assert(calc("0 + -1") === -1, "0 + -1 !== -1")
	assert(calc("0 - -1") === 1, "0 - -1 !== 1")
	assert(calc("5 * -1") === -5, "5 * -1 !== -5")
	assert(calc("-6 / -2") === 3, "-6 / -2 !== 3")
	assert(calc("64 ^ -0.5") === 0.125, "64 ^ -0.5 !== 0.125")
	console.log("Double-sign negative operations ✔️")
}

// Bracket operations
{
	// Bracket and bracket operations
	assert(calc("(4 / 2) + (5 * 2)") === 12, "(4 / 2) + (5 * 2) !== 12")
	assert(calc("(3 - 1) - (3 + 2)") === -3, "(3 - 1) - (3 + 2) !== -3")
	assert(calc("(2 + 8) * (7 - 3)") === 40, "(2 + 8) * (7 - 3) !== 40")
	assert(calc("(8 * 0.5) / (5 - 3)") === 2, "(8 * 0.5) / (5 - 3) !== 2")
	assert(calc("(4 ^ 3) ^ (1 / 3)") === 4, "(4 ^ 3) ^ (1 / 3) !== 4")
	console.log("Bracket and bracket operations ✔️")
}

console.log("Passed all tests 🎉")