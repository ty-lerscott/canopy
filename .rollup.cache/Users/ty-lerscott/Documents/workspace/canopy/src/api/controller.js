var Controller = (logger) => (req, res, next) => {
		var _a = req.originalUrl.replace(/^\//, "").split("/"),
			base = _a[0],
			pathname = _a.slice(1);
		switch (base) {
			case "download":
				res.send("HELLO WORLD POOP");
				break;
			default:
				res.send("HELLO WORLD");
				break;
		}
		next();
	};
export default Controller;
//# sourceMappingURL=controller.js.map
