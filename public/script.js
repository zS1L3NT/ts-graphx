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
						snackbar.open()
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

				const cv = document.getElementById("display")
				const ctx = cv.getContext("2d")
				ctx.beginPath()

				for (let i = 0; i < coords.length; i++) {
					const { pixelX, pixelY } = this.getPixels(coords[i])

					if (i === 0) {
						ctx.moveTo(pixelX, pixelY)
					} else {
						const { pixelY: ppixelY } = this.getPixels(coords[i - 1])
						
						if ((ppixelY > this.P95 && pixelY < this.P05) || (ppixelY < this.P05 && pixelY > this.P95)) {
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

	/**
	 * * Material UI
	 */
	new mdc.textField.MDCTextField(document.querySelector(".equation"))
	const snackbar = new mdc.snackbar.MDCSnackbar(
		document.querySelector(".error")
	)
}
