# Yocto
The smallest UI framework in the universe.

This architecture style is described
[here](https://github.com/paldepind/functional-frontend-architecture).

It is also _fractal_, i.e. it supports components that handle their own internal state using the same architectural pattern, and publish relevant events to the parent component. The meaning of fractal in this context is borrowed from [this article](http://staltz.com/unidirectional-user-interface-architectures.html).

## ToDo
- Action events are posted to a queue and dispatched sequentially
- Develop account query app with the following subcomponents:
	- Search form
	- Result table
