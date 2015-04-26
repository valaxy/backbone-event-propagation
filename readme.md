> Please check unit test to see what this module can do
> Should make more test
> Should write more document

Improve backbone event enhancement

# Model
```
var propagation = require('bower_components/index')
var MyModel = propagation.mixin(Backbone.Model.extend({
    propagation: {
        name: 'my-model',
        function() {
            return ...
        }
    }
}))

var model = new MyModel
model.listenToPro(model, 'path', 'event', function() {
    // ..
})
```