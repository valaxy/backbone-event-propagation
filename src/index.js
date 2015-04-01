define(function (require, exports) {

	// different event name
	exports.mixin = function (Model) {
		var oldTrigger = Model.prototype.trigger

		// override trigger()
		Model.prototype.trigger = function (/** name* */) {
			oldTrigger.apply(this, arguments)
			if (this.propagation) {
				if (!Array.isArray(this.propagation)) {
					this.propagation = [this.propagation]
				}

				for (var i in this.propagation) {
					var pro = this.propagation[i]

					if (typeof pro == 'function') {
						var model = this.get(pro.call(this))
					} else { // string
						var model = this.get(String(pro))
					}

					if (model) {
						var paras = []
						for (var i = 0; i < arguments.length; i++) {
							paras.push(arguments[i])
						}
						paras.push(model)
						model.trigger.apply(model, paras)
					}
				}
			}
		}

		return Model
	}

})