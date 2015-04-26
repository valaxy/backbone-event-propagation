define(function (require, exports) {
	var _ = require('underscore')

	var PropagationEvent = function () {
		this.path = ''
	}

	var clone = function (e) {
		var newE = new PropagationEvent
		for (var key in e) {
			newE[key] = e[key]
		}
		return newE
	}


	// different event name
	exports.mixin = function (Class) {
		var oldTrigger = Class.prototype.trigger

		var triggerPropagationEvent = function () {
			var options = this.propagation
			var name = options.name
			var e = arguments[arguments.length - 1]

			if (!Array.isArray(options.targets)) {
				options.targets = [options.targets]
			}

			for (var i in options.targets) {
				var targetName = options.targets[i], target

				if (typeof targetName == 'function') {
					target = targetName.call(this)
				} else { // string
					target = this.get(String(targetName)) // model.get
				}

				if (target) { // todo 真的需要判断吗?
					var newE = clone(e)
					newE.path = e.path == '' ? name : e.path + ' ' + name
					newE[name] = this // todo 名称可能会重复导致对象被覆盖
					var paras = Array.prototype.slice.call(arguments)
					paras.splice(paras.length - 1, 1)
					paras.push(newE)
					target.triggerPro.apply(target, paras)
				}
			}
		}


		// override trigger(), add a para to the last todo: 总是添加一个参数到监听函数上的话, API就不兼容了
		Class.prototype.trigger = function () {
			this.triggerPro.apply(this, arguments)
		}


		/** Trigger event propagation
		 */
		Class.prototype.triggerPro = function () {
			oldTrigger.apply(this, arguments)

			if (this.propagation) { // need be propagate
				var e
				if (arguments.length == 0 || !((e = arguments[arguments.length - 1]) instanceof PropagationEvent)) { // first propagate
					e = new PropagationEvent
					Array.prototype.push.call(arguments, e)
				}
				triggerPropagationEvent.apply(this, arguments)
			}
		}

		/** Listen to event propagation
		 */
		Class.prototype.listenToPro = function (other, target, event, callback) {
			var callbackWrap = function () {
				var e
				e = arguments[arguments.length - 1]
				if (arguments.length > 0 && ((e = arguments[arguments.length - 1]) instanceof PropagationEvent)) {
					// last arg is propagation event needed
					if (e.path == target) {
						callback.apply(this, arguments)
					}
				}
			}

			this.listenTo(other, event, callbackWrap)
		}

		return Class
	}

})