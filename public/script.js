window.onload = () => {
	const app = new Vue({
		el: "#app",
		data: {
			equation: "",
			coordinates: [],
			error: "",
			pixels: 1000,
			rangeX: {
				low: -5,
				high: 5
			},
			rangeY: {
				low: -5,
				high: 5
			}
		},
		mounted: function () {
			this.$nextTick(function () {
				this.resetCanvas()
			})
		},
		methods: {
			fetch: function () {
				axios
					.post("/", {
						data: this.equation,
						rangeX: this.rangeX,
						rangeY: this.rangeY,
						pixels: this.pixels
					})
					.then(res => {
						this.coordinates = res.data
						this.error = ""
					})
					.catch(e => {
						this.coordinates = []

						if (!e.response) {
							this.error = "Unknown error... Check logs"
							console.log(e)
							return
						}

						if (Array.isArray(e.response.data)) {
							this.error = e.response.data[0]
							return
						}

						this.error = e.response.data
					})
			},
			getPixels: function ({ x, y }) {
				/**
				 * * Centre the pixels
				 */
				const rangeX = this.rangeX.high - this.rangeX.low
				const rangeY = this.rangeY.high - this.rangeY.low
				const centeredX = x + rangeX / 2
				const centeredY = y + rangeY / 2

				/**
				 * * Increase the scale of the pixels
				 */
				const pixelX = (centeredX / rangeX) * this.pixels
				const pixelY = 1000 - (centeredY / rangeY) * this.pixels

				return { pixelX, pixelY }
			},
			resetCanvas: function () {
				const midX =
					(this.rangeX.high - this.rangeX.low) / 2 + this.rangeX.low
				const midY =
					(this.rangeY.high - this.rangeY.low) / 2 + this.rangeY.low
				const { pixelX, pixelY } = this.getPixels({ x: midX, y: -midY })

				ctx.strokeStyle = "black"
				ctx.clearRect(0, 0, this.pixels, this.pixels)
				ctx.beginPath()

				ctx.moveTo(pixelX, 0)
				ctx.lineTo(pixelX, this.pixels)
				ctx.stroke()

				ctx.moveTo(0, pixelY)
				ctx.lineTo(this.pixels, pixelY)
				ctx.stroke()
			},
			inputX: function (e) {
				const val = e.target.valueAsNumber
				if (val <= 0) {
					this.error = "Range must be positive"
				} else {
					this.rangeX.low = -val
					this.rangeX.high = val
				}
			},
			inputY: function (e) {
				const val = e.target.valueAsNumber
				if (val <= 0) {
					this.error = "Range must be positive"
				} else {
					this.rangeY.low = -val
					this.rangeY.high = val
				}
			}
		},
		watch: {
			coordinates: function (coords) {
				if (coords.length === 0) return undefined

				this.resetCanvas()
				ctx.beginPath()
				ctx.strokeStyle = "red"

				for (let i = 0; i < coords.length; i++) {
					const { pixelX, pixelY } = this.getPixels(coords[i])

					if (i === 0) {
						ctx.moveTo(pixelX, pixelY)
					} else {
						const { pixelY: ppixelY } = this.getPixels(
							coords[i - 1]
						)

						if (
							(ppixelY > this.pixels && pixelY < 0) ||
							(ppixelY < 0 && pixelY > this.pixels) ||
							(ppixelY > this.pixels && pixelY > this.pixels) ||
							(ppixelY < 0 && pixelY < 0)
						) {
							ctx.stroke()
							ctx.moveTo(pixelX, pixelY)
						} else {
							ctx.lineTo(pixelX, pixelY)
						}
					}
				}

				ctx.stroke()
			}
		}
	})

	const cv = document.getElementById("canvas")
	const ctx = cv.getContext("2d")
}
