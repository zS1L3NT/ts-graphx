import MathParser from "./MathParser"

class EquationParser {
	private devmode: boolean = false
	private text: string

	private highX: number
	private lowX: number
	private highY: number
	private lowY: number
	private step: number

	constructor(text: string, devmode?: boolean) {
		const openCount = (text.match(/\(/g) || []).length
		const closeCount = (text.match(/\)/g) || []).length
		if (openCount !== closeCount)
			throw new Error(`[${text}] Bracket not closed properly`)

		this.text = text.replace(/ /g, "")

		if (!this.text.startsWith("y=")) {
			throw new Error(`[${text}] A graphical equation must start with "y = ..."`)
		}

		if (devmode !== undefined) this.devmode = devmode
		this.text = this.text.slice(2).replace(/(-?(\d+)(\.\d+)?)x/g, `(x*$1)`)
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

class Coordinate {
	private x: number
	private y: number

	constructor(x: number, y: number) {
		this.x = x
		this.y = y
	}
}

console.log(
	new EquationParser("y = sin(cos(x))", true).setRangeX(0, 360).setStep(30).calc()
)
