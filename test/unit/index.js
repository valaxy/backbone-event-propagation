define(function (require) {
	var propagation = require('src/index')


	QUnit.module('index')

	QUnit.test('index', function (assert) {
		var ParentModel = Backbone.Model.extend({})
		var MyModel = Backbone.Model.extend({
			propagation: 'parent'
		})
		propagation.mixin(MyModel)


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

})