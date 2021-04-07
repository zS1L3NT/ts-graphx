import MathParser from "./MathParser"

class EquationParser {
	private text: string

	private highX: number
	private lowX: number
	private highY: number
	private lowY: number
	private step: number

	constructor(text: string) {
		this.text = text
			.replace(/ /g, "")
			.replace(/(-?(\d+)(\.\d+)?)x/g, `(x*$1)`)
		this.highX = 5
		this.lowX = -5
		this.highY = Infinity
		this.lowY = -Infinity
		this.step = 1
	}

	public calc(): Coordinate[] {
		let result: Coordinate[] = []
		let x = this.round(this.lowX)

		while (x <= this.highX) {
			let value = this.text
			value = value.replace(/x/g, x.toString())
			value = this.replaceSin(value)
			value = this.replaceCos(value)
			value = this.replaceTan(value)

			const y = this.round(new MathParser(value, true).calc())

			if (y < this.highY && y > this.lowY)
				result.push(new Coordinate(x, y))

			x = this.round(x + this.step)
		}

		return result
	}

	public replaceSin(text: string): string {
		let str = ""
		let cache = ""
		let depth = 0

		for (let i = 0, il = text.length; i < il; i++) {
			const char = text[i]
			if (char === "s" && str === "") {
				str = "s"
				continue
			}

			if (char === "i" && str === "s") {
				str = "si"
				continue
			}

			if (char === "n" && str === "si") {
				str = "sin"
				continue
			}

			if (str === "sin") {
				cache += char
				if (char === "(") depth++
				if (char === ")") {
					depth--

					if (depth === 0) {
						break
					}
				}
			}
		}

		const parsed = new MathParser(cache, true).calc()
		const sin = Math.sin(parsed)

		return text.replace(
			`sin${cache}`,
			sin < 0 ? `(0 - ${sin})` : sin.toString()
		)
	}

	private replaceCos(text: string): string {
		return text
	}

	private replaceTan(text: string): string {
		return text
	}

	public setRangeX(lowX: number, highX: number): EquationParser {
		if (lowX > highX) {
			throw new Error("Lowest value cannot be greater than Highest value")
		}

		if (lowX === highX) {
			throw new Error("Highest value and Lowest value cannot be equal")
		}

		if (
			lowX === Infinity ||
			lowX === -Infinity ||
			highX === Infinity ||
			highX === -Infinity
		) {
			throw new Error("Highest value and Lowest value cannot be infinity")
		}

		this.lowX = lowX
		this.highX = highX

		return this
	}

	public setRangeY(lowY: number, highY: number): EquationParser {
		if (lowY > highY) {
			throw new Error("Lowest value cannot be greater than Highest value")
		}

		if (lowY === highY) {
			throw new Error("Highest value and Lowest value cannot be equal")
		}

		this.lowY = lowY
		this.highY = highY

		return this
	}

	/**
	 * Rounds value to 6sf
	 * @param value Value to round
	 * @returns Rounded Value
	 */
	private round(value: number): number {
		return Math.round(value * 1000000) / 1000000
	}
}

class Coordinate {
	private x: number
	private y: number

	constructor(x: number, y: number) {
		this.x = x
		this.y = y
	}
}

console.log(new EquationParser("sin(x)").calc())
