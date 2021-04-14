window.onload = () => {
	const app = new Vue({
		el: "#app",
		data: {
			equation: ""
		},
		methods: {
			calculate: function () {
				axios
					.post("/", { data: this.equation })
					.then(console.log)
					.catch(console.error)
			}
		}
	})
}
