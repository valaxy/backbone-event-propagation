define(function (require, exports) {
	var propagationify = require('src/index')

	var ParentModel = Backbone.Model.extend({})

	var MyModel = Backbone.Model.extend({
		propagation: 'parent'
	})

	propagationify(MyModel)

	exports.init = function () {
		module('index')

		test('index', function (assert) {
			var parent = new ParentModel
			var model = new MyModel({
				parent: parent
			})
			var count = 0

			parent.listenTo(parent, 'my-event', function () {
				count++
			})

			model.listenTo(model, 'my-event', function () {
				count++
			})


			model.trigger('my-event')
			assert.equal(count, 2)
		})
	}
})