import MathParser from "./MathParser"

export default class EquationParser {
	private devmode: boolean = false
	private text: string

	private pixels: number
	private highX: number
	private lowX: number
	private highY: number
	private lowY: number

	constructor(text: string, devmode?: boolean) {
		if (!text) throw new Error("No equation provided")
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

		this.text = this.text.slice(2)
		const lazyMultiplyRegex = /(((\d+)(\.\d+)?)x)|(x((\d+)(\.\d+)?))|x\(|\)x|\)((\d+)(\.\d+)?)|((\d+)(\.\d+)?)\(/g
		const lazyMultiply = this.text.match(lazyMultiplyRegex)

		if (lazyMultiply) {
			throw new Error(
				`[${lazyMultiply[0]}] Lazy multiplication found, instead use "*" to multiply`
			)
		}

		if (devmode !== undefined) this.devmode = devmode
		this.pixels = 5000
		this.highX = 5
		this.lowX = -5
		this.highY = Infinity
		this.lowY = -Infinity
	}

	public calc(): Coordinate[] {
		let result: Coordinate[] = []
		let above = 0
		let below = 0

		for (let i = 0; i < this.pixels; i++) {
			const x = this.lowX + ((this.highX - this.lowX) / this.pixels) * i
			let value = this.text
			value = value.replace(/x/g, x.toString())

			const y = this.round(new MathParser(value, this.devmode).calc())

			if (y < this.highY && y > this.lowY) {
				above = 0
				below = 0
				result.push(new Coordinate(x, y))
			} else if (y > this.highY && ++above === 1) {
				result.push(new Coordinate(x, y))
			} else if (y < this.lowY && ++below === 1) {
				result.push(new Coordinate(x, y))
			}
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

	public setPixels(pixels: number): EquationParser {
		if (pixels < 1) {
			throw new Error("Must have at least 1 pixel")
		}

		this.pixels = pixels

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
