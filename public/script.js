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
			calculate: function () {
				axios
					.post("/", {
						data: this.equation,
						rangeX: this.rangeX,
						rangeY: this.rangeY,
						step: this.stepX
					})
					.then((res) => {
						this.coordinates = res.data
						this.error = ""
					})
					.catch((e) => {
						console.log(e)
						this.coordinates = []
						this.error = e.response.data
						snackbar.open()
					})
			}
		},
		computed: {
			stepX: function () {
				return (this.rangeX.high - this.rangeX.low) / 500
			},
			stepY: function () {
				return (this.rangeY.high - this.rangeY.low) / 500
			}
		}
	})

	const snackbar = new mdc.snackbar.MDCSnackbar(
		document.querySelector(".error")
	)
	new mdc.textField.MDCTextField(document.querySelector(".equation"))
}
