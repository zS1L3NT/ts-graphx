import express from "express"
import path from "path"
import EquationParser from "./EquationParser"
import {
	Tnumber,
	Tobject,
	Tor,
	Tstring,
	Tundefined,
	ValidateRequest
} from "validate-all-types"

const app = express()
const PORT = 9999

app.use(express.json())
app.use(express.static(path.join(__dirname, "..", "public")))

app.post(
	"/",
	ValidateRequest(
		"body",
		Tobject({
			data: Tstring(),
			rangeX: Tor(
				Tobject({
					low: Tnumber(),
					high: Tnumber()
				}),
				Tundefined()
			),
			rangeY: Tor(
				Tobject({
					low: Tnumber(),
					high: Tnumber()
				}),
				Tundefined()
			),
			step: Tor(Tnumber(), Tundefined())
		})
	),
	(req, res) => {
		const { data, rangeX, rangeY, step } = req.body as {
			data: string
			rangeX:
				| {
						low: number
						high: number
				  }
				| undefined
			rangeY:
				| {
						low: number
						high: number
				  }
				| undefined
			step: number | undefined
		}

		try {
			const parser = new EquationParser(data)

			if (rangeX) {
				parser.setRangeX(rangeX.low, rangeX.high)
			}

			if (rangeY) {
				parser.setRangeY(rangeY.low, rangeY.high)
			}

			if (step) {
				parser.setStep(step)
			}

			res.status(200).send(parser.calc())
		} catch (e) {
			res.status(400).send(e.message)
		}
	}
)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
