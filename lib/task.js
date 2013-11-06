/*global exports */
/*!
 * Define the node-task library.
 * @author <a href="mailto:yangdemo@gmail.com">dmyang</a>
 * @version 0.1.1
 * @usage:
 * ``` js
 * require('node-task')
 *   .register('foo')
 *     .step('bar', fn, *args)
 *     .step('biz', *args)
 *     .biz(*args)
 *     .err(fn)
 *     .end() // optional
 *   .register('foo2')
 *     .step('bar2', fn)
 *     .step('biz2', fn)
 *   .register('foo3')
 *     .step('biz2', fn)
 *   .biz2(*args)
 *   .run('foo', 'foo2', 'foo3');
 * ```
 */
var Task = module.exports = function() {
    if(!this instanceof Task) return new Task();
};
var _proto = Task.prototype;
var _tasksQueue = Object.create({});
var _currTask;

/*
 * Add some asynchronous methods to extend `Step` Class.
 * @class Step
 */
var Step = _proto._Step = function() {
    this.async = function() {};
};

/*
 * Register a task
 * @public
 * @param taskName {String}
 * @return this
 * @example
 */
_proto.register = _proto.add = function(taskName) {
    if(_tasksQueue[taskName]) throw Error('This task was registered, please try another taskName.');

    _currTask = _taskQueue;
};

/*
 * Add a asynchronous method to current task.
 * @public
 * @param stepName {String} the name of this step
 * @param stepHandler {function} optional step handler method
 * @param args {Mix} optional the data access to stepHandler
 * @return this
 * @example:
 * ``` js
 * Task().add('foo').step('bar', fn, *args)
 * Task().add('foo').step('bar').bar(fn, *args)
 * ```
 */
_proto.step = function(stepName) {
    ;
};

_proto.prev = function() {};

_proto.next = function() {};

_proto.jump = function() {};

_proto.end = function() {};

_proto.error = function() {};

_proto.timeout = function() {};

_proto.run = function() {};
