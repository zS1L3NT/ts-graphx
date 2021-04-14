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

type operator = "+" | "-" | "*" | "/" | "^" | "s" | "c" | "t"

export default class MathParser {
	private devmode: boolean = false
	private text: string

	private DP = 9
	private depth = 0
	private skip_max = 8
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

		this.log(this.depth, "Parsing:", this.text)

		if (!this.text) throw new Error("Mathematical expression is empty")
		if (this.isNumber(this.text)) {
			product = parseFloat(this.text)
		} else {
			product = this.nextOperator(this.text, this.depth)
		}

		if (product === undefined || isNaN(product)) this.unparsable(this.text)

		if (product === -0) product = 0

		this.log(this.depth, this.text, "=", product, "✔️")

		const multiplier = Math.pow(10, this.DP)
		return Math.round(product * multiplier) / multiplier
	}

	public setDepth(depth: number): MathParser {
		this.depth = depth
		return this
	}

	public setDP(DP: number): MathParser {
		this.DP = DP
		return this
	}

	private nextOperator(part: string, depth: number): number {
		// (s) (c) (t) (^) (+ -) (+ -) (* /) (* /)
		const len = this.history.length
		const previous = this.history[len - 1]

		// If []
		// If [...].length % 8 === 0
		if (len % this.skip_max === 0) {
			return this.sine(part, depth)
		}

		// If [..., (s)]
		if (previous === "s") {
			return this.cosine(part, depth)
		}

		// If [..., (c)]
		if (previous === "c") {
			return this.tangent(part, depth)
		}

		const addition = this.split(part, "+")
		const subtraction = this.split(part, "-")
		const multiplication = this.split(part, "*")
		const division = this.split(part, "/")

		if (
			[
				addition.length,
				subtraction.length,
				multiplication.length,
				division.length
			].every(i => i === 1)
		) {
			return this.exponential(part, depth)
		}
		if (addition.length > 1 || subtraction.length > 1) {
			const aTerm2 = addition[1]
			const sTerm2 = subtraction[1]

			if (!aTerm2) {
				return this.subtraction(part, depth)
			}

			if (!sTerm2) {
				return this.addition(part, depth)
			}

			if (aTerm2.length < sTerm2.length) {
				return this.addition(part, depth)
			} else {
				return this.subtraction(part, depth)
			}
		} else {
			const mTerm2 = multiplication[1]
			const dTerm2 = division[1]

			if (!mTerm2) {
				return this.division(part, depth)
			}

			if (!dTerm2) {
				return this.multiplication(part, depth)
			}

			if (mTerm2.length < dTerm2.length) {
				return this.multiplication(part, depth)
			} else {
				return this.division(part, depth)
			}
		}
	}

	private addition(part: string, depth: number): number {
		const op = "+"
		let product = 0

		const sPart = this.serializeNegatives(part)
		const terms = this.split(sPart, op)

		this.history.push(op)

		if (terms.length === 1) {
			if (this.skip++ === this.skip_max) this.unparsable(part)

			this.log(depth, `(+) {ABSENT} [${part}]`)
			return this.nextOperator(sPart, depth)
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

		const sPart = this.serializeNegatives(part)
		const terms = this.split(sPart, op)

		this.history.push(op)

		if (terms.length === 1) {
			if (this.skip++ === this.skip_max) this.unparsable(part)

			this.log(depth, `(-) {ABSENT} [${part}]`)
			return this.nextOperator(sPart, depth)
		}

		// Negative start case
		if (terms[0] === "") {
			this.log(depth, `(-) [${part}] -ve start case, returning product`)
			return this.nextOperator(sPart, depth)
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

		const sPart = this.serializeNegatives(part)
		const terms = this.split(sPart, op)

		this.history.push(op)

		if (terms.length === 1) {
			if (this.skip++ === this.skip_max) this.unparsable(part)

			this.log(depth, `(*) {ABSENT} [${part}]`)
			return this.nextOperator(sPart, depth)
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

		const sPart = this.serializeNegatives(part)
		const terms = this.split(sPart, op)

		this.history.push(op)

		if (terms.length === 1) {
			if (this.skip++ === this.skip_max) this.unparsable(part)

			this.log(depth, `(/) {ABSENT} [${part}]`)
			return this.nextOperator(sPart, depth)
		}

		this.skip = 0
		this.log(depth, `(/) {FOUND}:`, ...terms)
		for (let i = 0, il = terms.length; i < il; i++) {
			const term = this.strip(terms[i])
			if (this.isNumber(term)) {
				if (product !== undefined) {
					const val = parseFloat(term)
					if (val === 0) throw new Error(`[${part}] Zero division error`)
					product /= val
				} else product = parseFloat(term)
			} else {
				if (product !== undefined) {
					const val = this.nextOperator(term, depth + 1)
					if (val === 0) throw new Error(`[${part}] Zero division error`)
					product /= val
				} else product = this.nextOperator(term, depth + 1)
			}
		}

		this.log(depth, `(/) {FINISH}: [${part}] -> [${product}]`)
		return product!
	}

	private exponential(part: string, depth: number): number {
		const op = "^"
		let product: undefined | number

		const sPart = this.serializeNegatives(part)
		const terms = this.split(sPart, op)

		this.history.push(op)

		if (terms.length === 1) {
			if (this.skip++ === this.skip_max) this.unparsable(part)

			this.log(depth, `(^) {ABSENT} [${part}]`)
			return this.nextOperator(sPart, depth)
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

	public sine(part: string, depth: number): number {
		this.history.push("s")

		if (part.startsWith("sin(") && part.endsWith(")")) {
			const sin = part.slice(4, part.length - 1)
			this.log(depth, `(s) {FOUND}:`, sin)

			const angle = new MathParser(sin, this.devmode)
				.setDepth(depth + 1)
				.calc()

			try {
				const result = Math.sin(angle)
				this.log(depth, `(s) {FINISH}: [${part}] -> [${result}]`)

				return result
			} catch {
				console.log(`(s) {ERROR} [${part}]`)
				process.exit()
			}
		} else {
			if (this.skip++ === this.skip_max) this.unparsable(part)

			this.log(depth, `(s) {ABSENT} [${part}]`)
			return this.nextOperator(part, depth)
		}
	}

	public cosine(part: string, depth: number): number {
		this.history.push("c")

		if (part.startsWith("cos(") && part.endsWith(")")) {
			const cos = part.slice(4, part.length - 1)
			this.log(depth, `(c) {FOUND}:`, cos)

			const angle = new MathParser(cos, this.devmode)
				.setDepth(depth + 1)
				.calc()

			try {
				const result = Math.cos(angle)
				this.log(depth, `(c) {FINISH}: [${part}] -> [${result}]`)

				return result
			} catch {
				console.log(`(c) {ERROR} [${part}]`)
				process.exit()
			}
		} else {
			if (this.skip++ === this.skip_max) this.unparsable(part)

			this.log(depth, `(c) {ABSENT} [${part}]`)
			return this.nextOperator(part, depth)
		}
	}

	public tangent(part: string, depth: number): number {
		this.history.push("t")

		if (part.startsWith("tan(") && part.endsWith(")")) {
			const tan = part.slice(4, part.length - 1)
			this.log(depth, `(t) {FOUND}:`, tan)

			const angle = new MathParser(tan, this.devmode)
				.setDepth(depth + 1)
				.calc()

			try {
				const result = Math.tan(angle)
				this.log(depth, `(t) {FINISH}: [${part}] -> [${result}]`)

				return result
			} catch {
				console.log(`(t) {ERROR} [${part}]`)
				process.exit()
			}
		} else {
			if (this.skip++ === this.skip_max) this.unparsable(part)

			this.log(depth, `(t) {ABSENT} [${part}]`)
			return this.nextOperator(part, depth)
		}
	}

	/**
	 * Shallow split of terms
	 * @param text Text to split
	 * @returns {string[]} Terms split up
	 */
	public split(text: string, operator?: operator): string[] {
		const operators: string[] = operator ? [operator] : [..."+-*/^"]
		const terms: string[] = []
		let chunk = ""
		let depth = 0

		for (let i = text.length - 1; i >= 0; i--) {
			const char = text[i]

			if (char === "(") {
				depth++
			} else if (char === ")") {
				depth--
			}

			if (depth === 0 && operators.includes(char)) {
				terms.push(text.slice(0, text.length - chunk.length - 1))
				terms.push(chunk)
				break
			}

			chunk = char + chunk
		}

		if (terms.length === 0) terms.push(chunk)

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

	public serializeNegatives(part: string): string {
		let result = ""
		//
		// (5-6)*
		// 7
		const terms = this.split(part, "-")

		for (let i = 0, il = terms.length; i < il; i++) {
			const term = terms[i]

			// Starting exception
			// -(5-6)*
			if (i === 0) {
				if (term === "") {
					// -(5-6)*
					const nextTerm = terms[1]
					// -(5-6)
					const bracketed = this.split(nextTerm)[0]
					// *
					const rest = nextTerm.slice(bracketed.length)

					// (0-(5-6))*
					result = `(0-${bracketed})${rest}`
					i = 1
				} else {
					result += `${term}`
				}
				continue
			}

			if (terms[i - 1].match(/[\+\-*\/^]$/)) {
				result += `(0-${term})`
				continue
			}

			result += `-${term}`

			// (0-(5-6))*-7
		}

		return this.strip(result)
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
			throw new Error(
				`[${text}] One of the mathematical operators are left hanging`
			)
		throw new Error(`[${text}] Couldn't parse expression`)
	}
}

// console.log(new MathParser("1 -1   + 2   - 2   +  4 - 4 +    6", true).calc())
