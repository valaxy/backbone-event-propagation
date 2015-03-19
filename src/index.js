define(function (require, exports) {

	var propagationify = function (Model) {

		// override tigger()
		var oldTrigger = Model.prototype.trigger

		var newTrigger = function (/** name* */) {
			var model = this
			while (model) {
				oldTrigger.apply(model, arguments)
				if (typeof model.propagation == 'function') {
					model = model.get(model.propagation())
				} else { // string
					model = model.get(String(model.propagation))
				}
			}
		}

		Model.prototype.trigger = newTrigger


		// override initialize() (no need)
		//var oldInitialize = Model.prototype.initialize

		//var newInitialize = function (options) {
		//	oldInitialize.apply(this, arguments)
		//	if (options) {
		//		if (typeof options.propagation == 'function') {
		//			this.propagation = options.propagation
		//		} else {
		//			this.propagation = String(options.propagation)
		//		}
		//	}
		//}


		//Model.prototype.initialize = newInitialize
	}

	return propagationify
})