window.onload = () => {
	const app = new Vue({
		el: "#app",
		data: {
			equation: "",
			coordinates: [],
			error: "",
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
						rangeY: this.rangeY
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
			coordinateStyle: function (c) {
				const { x, y } = c

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
				const percentX = (centeredX / rangeX) * 100
				const percentY = (centeredY / rangeY) * 100

				return {
					left: percentX + '%',
					top: percentY + '%'
				}
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
