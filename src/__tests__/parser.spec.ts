import MathParser from "../MathParser"

const _equals = (expression: string, value?: number) => {
	if (value !== undefined) {
		expect(new MathParser(expression).calc()).toBe(value)
	} else {
		expect(() => new MathParser(expression).calc()).toThrowError()
	}
}

describe("Mathematical expressions", () => {
	test("Expressions", () => {
		_equals("")
		_equals("5", 5)
		_equals("-5", -5)
		_equals("(5)", 5)
		_equals("(((((((-3)))))))", -3)
	})

	test("Syntax Errors", () => {
		_equals("2 + (5 * 2")
		_equals("(((((4))))")
		_equals("((2)) * ((3")
		_equals("((9)) * ((1)")
	})

	test("Decimal Operations", () => {
		_equals("2.5", 2.5)
		_equals("4*2.5 + 8.5+1.5 / 3.0", 19)
		_equals("5.0005 + 0.0095", 5.01)
	})

	describe("Positive Operations", () => {
		test("Simple Operations", () => {
			_equals("1 + 1", 2)
			_equals("10 - 9", 1)
			_equals("3 * 2", 6)
			_equals("6 / 3", 2)
			_equals("4 ^ 3", 64)
		})

		test("Bracker and Number Operations", () => {
			_equals("(3 * 2) + 1", 7)
			_equals("(3 * 2) - 4", 2)
			_equals("(3 * 2) * 3", 18)
			_equals("(3 * 2) / 6", 1)
			_equals("(3 * 2) ^ 4", 1296)
		})
	})

	test("Zero Operations", () => {
		_equals("0 / 1", 0)
		_equals("0/0")
	})

	describe("Negative Operations", () => {
		test("Simple Operations", () => {
			_equals("-1 + 1", 0)
			_equals("-1 - 1", -2)
			_equals("-1 * 3", -3)
			_equals("-1 / -1", 1)
			_equals("4 ^ -1", 0.25)
		})

		test("Double Negative Sign Operations", () => {
			_equals("0 + -1", -1)
			_equals("0 - -1", 1)
			_equals("5 * -1", -5)
			_equals("-6 / -2", 3)
			_equals("64 ^ -0.5", 0.125)
		})
	})

	describe("Bracket Operations", () => {
		test("Bracket and Bracket Operations", () => {
			_equals("(4 / 2) + (5 * 2)", 12)
			_equals("(3 - 1) - (3 + 2)", -3)
			_equals("(2 + 8) * (7 - 3)", 40)
			_equals("(8 * 0.5) / (5 - 3)", 2)
			_equals("(4 ^ 3) ^ (1 / 3)", 4)
		})

		test("Operating on Negative Brackets", () => {
			_equals("1 * -(5 - 3)", -2)
			_equals("-(-6)", 6)
		})
	})

	test("Long BEDMAS Operations", () => {
		_equals("2 -4 +6 -1 -1- 0 +8", 10)
		_equals("1 -1   + 2   - 2   +  4 - 4 +    6", 6)
		_equals("2*3 - 4*5 + 6/3", -12)
		_equals("2*3*4/8 -   5/2*4 +  6 + 0/3   ", -1)
		_equals("(5 + 2*3 - 1 + 7 * 8)", 66)
		_equals("(67 + 2 * 3 - 67 + 2/1 - 7)", 1)
		_equals("(2) + (17*2-30) * (5)+2 - (8/2)*4", 8)
		_equals("(5*7/5) + (23) - 5 * (98-4)/(6*7-42)")
	})
})
