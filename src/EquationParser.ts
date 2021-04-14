import MathParser from "./MathParser"

export default class EquationParser {
	private devmode: boolean = false
	private text: string

	private highX: number
	private lowX: number
	private highY: number
	private lowY: number
	private step: number

	constructor(text: string, devmode?: boolean) {
		if (!text) throw new Error("No text provided")
		const openCount = (text.match(/\(/g) || []).length
		const closeCount = (text.match(/\)/g) || []).length
		if (openCount !== closeCount)
			throw new Error(`[${text}] Bracket not closed properly`)

		this.text = text.replace(/ /g, "")

		if (!this.text.match(/y=.*/)) {
			throw new Error(`[${text}] An equation must start with "y = ..."`)
		}

		const equalCount = (text.match(/=/g) || []).length
		if (equalCount !== 1) {
			throw new Error(`[${text}] An equation must have 1 equal sign`)
		}

		if (devmode !== undefined) this.devmode = devmode
		this.text = this.text.slice(2).replace(/(-?(\d+)(\.\d+)?)x/g, `(x*$1)`)
		this.text = this.text.replace(/x((\d+)(\.\d+)?)/g, "(x*$1)")
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

			const y = this.round(new MathParser(value, this.devmode).calc())

			if (y < this.highY && y > this.lowY)
				result.push(new Coordinate(x, y))

			x = this.round(x + this.step)
		}

		return result
	}

	/**
	 * Rounds value to 6sf
	 * @param value Value to round
	 * @returns Rounded Value
	 */
	private round(value: number): number {
		return Math.round(value * 1000000) / 1000000
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

	public setStep(step: number): EquationParser {
		if (step <= 0) {
			throw new Error("Step value must be greater than 0")
		}

		this.step = step

		return this
	}
}

export class Coordinate {
	public x: number
	public y: number

	constructor(x: number, y: number) {
		this.x = x
		this.y = y
	}
}

