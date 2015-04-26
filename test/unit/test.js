define(function (require) {
	var propagation = require('index')
	var sinon = require('sinon')
	var _ = require('underscore')

	QUnit.module('index')

	var createSimpleCase = function () {
		var ParentModel = propagation.mixin(Backbone.Model.extend({}))
		var ChildModel = propagation.mixin(Backbone.Model.extend({
			propagation: {
				name   : 'child',
				targets: 'parent'
			}
		}))


		var parent = new ParentModel({
			name: 'p'
		})
		var child = new ChildModel({
			parent: parent,
			name  : 'c'
		})


		return [child, parent]
	}

	QUnit.test('propagation: string', function (assert) {
		var case0 = createSimpleCase()

		var child = case0[0]
		var parent = case0[1]

		var parentProSpy = sinon.spy()
		var parentSpy = sinon.spy()
		var childSpy = sinon.spy()
		parent.listenToPro(parent, 'child', 'my-event', function (e) {
			parentProSpy()
			assert.equal(e.child, child)
		})

		parent.listenTo(parent, 'my-event', function (e) {
			parentSpy()
			assert.equal(e.child, child)
		})


		child.listenTo(child, 'my-event', function () {
			childSpy()
			assert.equal(arguments.length, 0)
		})


		child.trigger('my-event')
		assert.ok(parentProSpy.calledOnce)
		assert.ok(parentSpy.calledOnce)
		assert.ok(childSpy.calledOnce)
	})


	QUnit.test('propagation: function', function (assert) {
		var ChildModel = propagation.mixin(Backbone.Model.extend({
			initialize : function () {
				this._parent = new (propagation.mixin(Backbone.Model.extend({})))()
			},
			propagation: {
				name   : 'child',
				targets: function () {
					return this._parent
				}
			}
		}))

		var child = new ChildModel
		var parent = child._parent
		var spy = sinon.spy()

		parent.listenToPro(parent, 'child', 'event', function (str) {
			spy()
			assert.equal(str, 'str')
		})
		child.trigger('event', 'str')

		assert.ok(spy.calledOnce)
	})


	QUnit.test('mixinObject', function (assert) {
		var event = _.extend(Backbone.Events, propagation.mixin())
		var case0 = createSimpleCase()
		var child = case0[0]
		var parent = case0[1]

		event.listenToPro(parent, 'child', 'event', function () {
			assert.ok(true)
		})
		child.trigger('event')
	})

})