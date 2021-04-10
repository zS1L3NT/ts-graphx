import MathParser from "./MathParser"

const checkEqual = (val: string, ans: number) => {
	try {
		if (new MathParser(val).calc() !== ans) {
			console.log(val, `!==`, ans)
			new MathParser(val, true).calc()
		}
	} catch {
		new MathParser(val, true).calc()
		process.exit()
	}
}

const checkFail = (val: string) => {
	try {
		new MathParser(val).calc()

		console.log(val, `doesn't raise an error`)
		new MathParser(val, true).calc()
		process.exit()
	} catch {}
}

console.log("Starting test 🎡")

// Expressions
checkFail("")
checkEqual("5", 5)
checkEqual("-5", -5)
checkEqual("(5)", 5)
checkEqual("(((((((-3)))))))", -3)
console.log("Weird object tests ✔️")

// Syntax errors
checkFail("2 + (5 * 2")
checkFail("(((((4))))")
checkFail("((2)) * ((3")
checkFail("((9)) * ((1)")
console.log("Syntax errors ✔️")

// Decimal operations
checkEqual("2.5", 2.5)
checkEqual("4*2.5 + 8.5+1.5 / 3.0", 19)
checkEqual("5.0005 + 0.0095", 5.01)
console.log("Decimal operations ✔️")

// Positive operations
{
	// Simple operations
	checkEqual("1 + 1", 2)
	checkEqual("10 - 9", 1)
	checkEqual("3 * 2", 6)
	checkEqual("6 / 3", 2)
	checkEqual("4 ^ 3", 64)
	console.log("Simple operations ✔️")

	// Bracket and number operations
	checkEqual("(3 * 2) + 1", 7)
	checkEqual("(3 * 2) - 4", 2)
	checkEqual("(3 * 2) * 3", 18)
	checkEqual("(3 * 2) / 6", 1)
	checkEqual("(3 * 2) ^ 4", 1296)
	console.log("Bracket and number operations ✔️")
}

// Zero exceptions
checkEqual("0 / 1", 0)
checkFail("0/0")
console.log("Zero exceptions ✔️")

// Nagative operations
{
	checkEqual("-1 + 1", 0)
	checkEqual("-1 - 1", -2)
	checkEqual("-1 * 3", -3)
	checkEqual("-1 / -1", 1)
	checkEqual("4 ^ -1", 0.25)
	console.log("Simple starting negative operations ✔️")

	checkEqual("0 + -1", -1)
	checkEqual("0 - -1", 1)
	checkEqual("5 * -1", -5)
	checkEqual("-6 / -2", 3)
	checkEqual("64 ^ -0.5", 0.125)
	console.log("Double-sign negative operations ✔️")
}

// Bracket operations
{
	// Bracket and bracket operations
	checkEqual("(4 / 2) + (5 * 2)", 12)
	checkEqual("(3 - 1) - (3 + 2)", -3)
	checkEqual("(2 + 8) * (7 - 3)", 40)
	checkEqual("(8 * 0.5) / (5 - 3)", 2)
	checkEqual("(4 ^ 3) ^ (1 / 3)", 4)
	console.log("Bracket and bracket operations ✔️")

	// Operating on negative brackets
	checkEqual("1 * -(5 - 3)", -2)
	checkEqual("-(-6)", 6)
	console.log("Operating on negative brackets ✔️")
}

// Trigonometric operations
{
	// Simple trigonometric operations
	checkEqual("sin(40 - 10)", 0.5)
	checkEqual("cos((3 ^ 2) * 10)", 0)
	checkEqual("tan(60) ^ 2", 3)
	console.log("Simple trigonometric operations ✔️")
}

// Long BEDMAS operations
checkEqual("2 -4 +6 -1 -1- 0 +8", 10)
checkEqual("1 -1   + 2   - 2   +  4 - 4 +    6", 6)
checkEqual("2*3 - 4*5 + 6/3", -12)
checkEqual("2*3*4/8 -   5/2*4 +  6 + 0/3   ", -1)
checkEqual("(5 + 2*3 - 1 + 7 * 8)", 66)
checkEqual("(67 + 2 * 3 - 67 + 2/1 - 7)", 1)
checkEqual("(2) + (17*2-30) * (5)+2 - (8/2)*4", 8)
checkFail("(5*7/5) + (23) - 5 * (98-4)/(6*7-42)")
console.log("Long BEDMAS operations ✔️")

console.log("Passed all tests 🎉")
