> Please check unit test to see what this module can do

Improve backbone event enhancement

# Model
```
var propagation = require('bower_components/src/index')
var MyModel = propagation.mixin(Backbone.Model.extend({
    propagation: function() {
        return ...
    }
}))
```