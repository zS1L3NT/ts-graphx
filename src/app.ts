import EquationParser from "./EquationParser"
import express from "express"
import path from "path"
import {
	NUMBER,
	OBJECT,
	OR,
	STRING,
	UNDEFINED,
	withValidBody
} from "validate-any"

const app = express()
const PORT = 9999

//@ts-ignore
app.use(express.json())
app.use(express.static(path.join(__dirname, "..", "public")))

app.post(
	"/",
	withValidBody(
		OBJECT({
			data: STRING(),
			rangeX: OR(
				OBJECT({
					low: NUMBER(),
					high: NUMBER()
				}),
				UNDEFINED()
			),
			rangeY: OR(
				OBJECT({
					low: NUMBER(),
					high: NUMBER()
				}),
				UNDEFINED()
			),
			pixels: OR(NUMBER(), UNDEFINED())
		}),
		(req, res) => {
			const { data, rangeX, rangeY, pixels } = req.body

			try {
				const parser = new EquationParser(data)

				if (rangeX) {
					parser.setRangeX(rangeX.low, rangeX.high)
				}

				if (rangeY) {
					parser.setRangeY(rangeY.low, rangeY.high)
				}

				if (pixels) {
					parser.setPixels(pixels)
				}

				res.status(200).send(parser.calc())
			} catch (e) {
				res.status(400).send((e as Error).message)
			}
		}
	)
)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
