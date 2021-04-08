/**
 * FOLLOW BEDMAS
 *
 * Bracket
 * Exponential
 * Division
 * Multiplication
 * Addition
 * Subtraction
 */

type operator = "+" | "-" | "*" | "/" | "^"

export default class MathParser {
	private devmode: boolean = false
	private text: string

	private skip = 0
	public history: operator[]

	constructor(text: string, devmode?: boolean) {
		const openCount = (text.match(/\(/g) || []).length
		const closeCount = (text.match(/\)/g) || []).length
		if (openCount !== closeCount)
			throw new Error(`[${text}] Bracket not closed properly`)

		this.history = []

		this.text = text.replace(/ /g, "")
		this.text = this.text.replace(/^-((\d+)(\.\d+)?)/, "(0-$1)")
		this.text = this.text.replace(
			/([\(\+\-*\/\^])-((\d+)(\.\d+)?)/,
			"$1(0-$2)"
		)
		this.text = this.strip(this.text)

		if (devmode !== undefined) this.devmode = devmode
	}

	/**
	 * Calculate the result of the math
	 * @returns {number} result
	 */
	public calc(): number {
		let product: number

		if (this.isNumber(this.text)) {
			product = parseFloat(this.text)
		} else {
			product = this.nextOperator(this.text, 0)
		}

		if (product === undefined || isNaN(product)) this.unparsable(this.text)

		if (product === -0) product = 0

		if (this.devmode) console.log(this.text, "=", product, "✔️")
		return Math.round(product * 1000000) / 1000000
	}

	private nextOperator(part: string, depth: number): number {
		const prevprevious = this.history[this.history.length - 2]
		const previous = this.history[this.history.length - 1]
		const len = this.history.length

		const highOps = [..."*/"].sort()
		const lowOps = [..."+-"].sort()

		// If []
		// If [..., (^)]
		if (len === 0 || previous === "^") {
			const [addition] = this.split(part, "+")
			const [subtraction] = this.split(part, "-")

			if (addition.length < subtraction.length) {
				return this.addition(part, depth)
			} else {
				return this.subtraction(part, depth)
			}
		}

		// If [(+)(-)]
		if (len === 1) {
			// If [(+)]
			if (previous === "+") {
				return this.subtraction(part, depth)
			}

			// If [(-)]
			else {
				return this.addition(part, depth)
			}
		}

		if (this.history.length >= 4) {
			const previousFour = JSON.stringify(
				this.history.slice(len - 4, len).sort()
			)

			// If [..., (+)(-)(*)(/), (+)(-)(*)(/), (+)(-)(*)(/), (+)(-)(*)(/)]
			if (previousFour === JSON.stringify([..."+-*/"].sort())) {
				return this.exponential(part, depth)
			}
		}

		// If [..., (*)(/)]
		if (highOps.indexOf(previous) >= 0) {
			// If [..., (*)(/), (*)(/)]
			if (highOps.indexOf(prevprevious) >= 0) {
				const [addition] = this.split(part, "+")
				const [subtraction] = this.split(part, "-")

				if (addition.length < subtraction.length) {
					return this.addition(part, depth)
				} else {
					return this.subtraction(part, depth)
				}
			}

			// If [..., (+)(-), (*)(/)]
			else {
				// If [..., (+)(-), (*)]
				if (previous === "*") {
					return this.division(part, depth)
				}

				// If [..., (+)(-), (/)]
				else {
					return this.multiplication(part, depth)
				}
			}
		}

		// If [..., (+)(-)]
		if (lowOps.indexOf(previous) >= 0) {
			// If [..., (+)(-), (+)(-)]
			if (lowOps.indexOf(prevprevious) >= 0) {
				const [multiplication] = this.split(part, "*")
				const [division] = this.split(part, "/")

				if (multiplication.length < division.length) {
					return this.multiplication(part, depth)
				} else {
					return this.division(part, depth)
				}
			}

			// If [..., (*)(/), (+)(-)]
			else {
				// If [..., (*)(/), (+)]
				if (previous === "+") {
					return this.subtraction(part, depth)
				}

				// If [..., (*)(/), (-)]
				else {
					return this.addition(part, depth)
				}
			}
		}

		throw new Error("No next operator")
	}

	private addition(part: string, depth: number): number {
		const op = "+"
		let product = 0
		const terms = this.split(part, op)

		this.history.push(op)

		if (terms.length === 1) {
			this.skip++
			if (this.skip === 5) this.unparsable(part)

			this.log(depth, `(+) {ABSENT} [${part}]`)
			return this.nextOperator(part, depth)
		}

		this.skip = 0
		this.log(depth, `(+) {FOUND}:`, ...terms)
		for (let i = 0, il = terms.length; i < il; i++) {
			const term = this.strip(terms[i])
			if (this.isNumber(term)) {
				product += parseFloat(term)
			} else {
				product += this.nextOperator(term, depth + 1)
			}
		}

		this.log(depth, `(+) {FINISH}: [${part}] -> [${product}]`)
		return product
	}

	private subtraction(part: string, depth: number): number {
		const op = "-"
		let product: undefined | number
		const terms = this.split(part, op)

		this.history.push(op)

		if (terms.length === 1) {
			this.skip++
			if (this.skip === 5) this.unparsable(part)

			this.log(depth, `(-) {ABSENT} [${part}]`)
			return this.nextOperator(part, depth)
		}

		// Negative start case
		if (terms[0] === "") {
			this.log(depth, `(-) [${part}] -ve start case, returning product`)
			return this.nextOperator(part, depth)
		}

		this.skip = 0
		this.log(depth, `(-) {FOUND}:`, ...terms)
		for (let i = 0, il = terms.length; i < il; i++) {
			const term = this.strip(terms[i])
			if (this.isNumber(term)) {
				if (product !== undefined) product -= parseFloat(term)
				else product = parseFloat(term)
			} else {
				if (product !== undefined)
					product -= this.nextOperator(term, depth + 1)
				else product = this.nextOperator(term, depth + 1)
			}
		}

		this.log(depth, `(-) {FINISH}: [${part}] -> [${product}]`)
		return product!
	}

	private multiplication(part: string, depth: number): number {
		const op = "*"
		let product = 1
		const terms = this.split(part, op)

		this.history.push(op)

		if (terms.length === 1) {
			this.skip++
			if (this.skip === 5) this.unparsable(part)

			this.log(depth, `(*) {ABSENT} [${part}]`)
			return this.nextOperator(part, depth)
		}

		this.skip = 0
		this.log(depth, `(*) {FOUND}:`, ...terms)
		for (let i = 0, il = terms.length; i < il; i++) {
			const term = this.strip(terms[i])
			if (this.isNumber(term)) {
				product *= parseFloat(term)
			} else {
				product *= this.nextOperator(term, depth + 1)
			}
		}

		this.log(depth, `(*) {FINISH}: [${part}] -> [${product}]`)
		return product
	}

	private division(part: string, depth: number): number {
		const op = "/"
		let product: undefined | number
		const terms = this.split(part, op)

		this.history.push(op)

		if (terms.length === 1) {
			this.skip++
			if (this.skip === 5) this.unparsable(part)

			this.log(depth, `(/) {ABSENT} [${part}]`)
			return this.nextOperator(part, depth)
		}

		this.skip = 0
		this.log(depth, `(/) {FOUND}:`, ...terms)
		for (let i = 0, il = terms.length; i < il; i++) {
			const term = this.strip(terms[i])
			if (this.isNumber(term)) {
				if (product !== undefined) product /= parseFloat(term)
				else product = parseFloat(term)
			} else {
				if (product !== undefined)
					product /= this.nextOperator(term, depth + 1)
				else product = this.nextOperator(term, depth + 1)
			}
		}

		this.log(depth, `(/) {FINISH}: [${part}] -> [${product}]`)
		return product!
	}

	private exponential(part: string, depth: number) {
		const op = "^"
		let product: undefined | number
		const terms = this.split(part, op)

		this.history.push(op)

		if (terms.length === 1) {
			this.skip++
			if (this.skip === 5) this.unparsable(part)

			this.log(depth, `(^) {ABSENT} [${part}]`)
			return this.nextOperator(part, depth)
		}

		this.skip = 0
		this.log(depth, `(^) {FOUND}:`, ...terms)
		for (let i = 0, il = terms.length; i < il; i++) {
			const term = this.strip(terms[i])
			if (this.isNumber(term)) {
				if (product !== undefined)
					product = Math.pow(product, parseFloat(term))
				else product = parseFloat(term)
			} else {
				if (product !== undefined)
					product = Math.pow(
						product,
						this.nextOperator(term, depth + 1)
					)
				else product = this.nextOperator(term, depth + 1)
			}
		}

		this.log(depth, `(^) {FINISH}: [${part}] -> [${product}]`)
		return product!
	}

	/**
	 * Shallow split of terms
	 * @param text Text to split
	 * @returns {string[]} Terms split up
	 */
	private split(text: string, operator?: operator): string[] {
		const operators: string[] = operator ? [operator] : [..."+-*/^"]
		const terms: string[] = []
		let chunk = ""
		let depth = 0

		for (let i = 0, il = text.length; i < il; i++) {
			const char = text[i]

			if (char === "(") {
				depth++
			} else if (char === ")") {
				depth--
			}

			if (depth === 0 && operators.includes(char)) {
				terms.push(chunk)
				chunk = ""
			} else {
				chunk += char
			}
		}

		if (chunk !== "") {
			terms.push(chunk)
		}

		return terms.map(i => i.trim())
	}

	/**
	 * Strips brackets if they exist
	 * @param value Term
	 * @returns {string} Stripped term
	 */
	private strip(value: string): string {
		let depth = 0

		if (value[0] !== "(") return value

		for (let i = 0, il = value.length; i < il; i++) {
			const char = value[i]

			if (char === "(") {
				depth++
			}

			if (char === ")") {
				depth--

				if (depth === 0 && i !== value.length - 1) {
					// Bracket closed before end of string
					return value
				}
			}
		}

		const result = value.slice(1, value.length - 1)
		const deeperResult = this.strip(result)
		if (deeperResult === result) {
			return result
		} else {
			return deeperResult
		}
	}

	/**
	 * Check if a term is a number
	 * @param value Value to check
	 * @returns {boolean} (TRUE) if is a number
	 */
	private isNumber(value: string) {
		const numbers = [..."0123456789."]
		let hasDot = false

		if (value === "") {
			throw new Error(`[${this.text}] Empty parenthesis must be filled`)
		}

		for (let i = 0, il = value.length; i < il; i++) {
			const char = value[i]
			if (i === 0 && char === "-") continue
			if (numbers.indexOf(char) === -1) return false
			if (char === ".") {
				if (hasDot) return false
				hasDot = true
			}
		}

		return true
	}

	private log(depth: number, ...message: any) {
		if (this.devmode) console.log(`${"    ".repeat(depth)}`, message)
	}

	private unparsable(text: string) {
		if (text.match(/(sin|cos|tan)[^\(]/g))
			throw new Error(
				`[${text}] Trigonometric functions must have their children wrapped in brackets`
			)
		if (text.match(/^(.*[+\-\*\/\^]|[+\-\*\/\^].*)$/))
				throw new Error(`[${text}] One of the mathematical operators are left hanging`)
		throw new Error(`[${text}] Couldn't parse expression`)
	}
}

// console.log(new MathParser("4 ^ -1", true).calc())
