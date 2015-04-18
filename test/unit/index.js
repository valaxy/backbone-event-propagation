define(function (require) {
	var propagation = require('src/index')
	var sinon = require('sinon')


	QUnit.module('index')

	QUnit.test('propagation: string', function (assert) {
		var ParentModel = Backbone.Model.extend({})
		var MyModel = propagation.mixin(Backbone.Model.extend({
			propagation: 'parent'
		}))


		var parent = new ParentModel
		var model = new MyModel({
			parent: parent
		})
		var count = 0

		parent.listenTo(parent, 'my-event', function (target) {
			count++
			assert.equal(target, model)
		})

		model.listenTo(model, 'my-event', function (target) {
			count++
			assert.equal(target, undefined)
		})


		model.trigger('my-event')
		assert.equal(count, 2)
	})


	QUnit.test('propagation: function', function (assert) {
		var ChildModel = propagation.mixin(Backbone.Model.extend({
			initialize: function () {
				this._parent = new (Backbone.Model)
			},
			propagation: function () {
				return this._parent
			}
		}))

		var child = new ChildModel
		var spy = sinon.spy()

		child._parent.on('event', function (str) {
			spy()
			assert.equal(str, 'str')
		})
		child.trigger('event', 'str')

		assert.ok(spy.calledOnce)
	})

})