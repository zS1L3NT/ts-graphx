window.onload = () => {
	const app = new Vue({
		el: "#app",
		data: {
			equation: "y=tan(x)",
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
						console.log(e)
						this.coordinates = []
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
				const pixelY = 1000 - ((centeredY / rangeY) * this.pixels)

				return { pixelX, pixelY }
			}
		},
		watch: {
			coordinates: function (coords) {
				if (coords.length === 0) return undefined

				const cv = document.getElementById("canvas")
				const ctx = cv.getContext("2d")
				ctx.clearRect(0, 0, this.pixels, this.pixels)
				ctx.beginPath()

				for (let i = 0; i < coords.length; i++) {
					const { pixelX, pixelY } = this.getPixels(coords[i])

					if (i === 0) {
						ctx.moveTo(pixelX, pixelY)
					} else {
						const { pixelY: ppixelY } = this.getPixels(coords[i - 1])
						
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
		},
		computed: {
			P95: function () {
				return 0.95 * this.pixels
			},
			P05: function () {
				return 0.05  * this.pixels
			}
		}
	})
}
