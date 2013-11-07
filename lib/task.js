/*global exports */
/**
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
 **/

'use strict';

var nutil = require('util');
var util = require('./util');

var Task = module.exports = function(debug) {
    if(!this instanceof Task) return new Task(debug);

    this.debug = debug || false;
    this._tasksQueue = [];
    this._currTask = null;
    this._stack = [];
};
var _proto = Task.prototype;

/*
 * Add some asynchronous methods to extend `Step` Class.
 * @class Step
 */
var Step = _proto._Step = function() {
    this.repeat = function() {};
};

/*
 * Register a task
 * @public
 * @param taskName {String}
 * @return this
 * @example
 */
_proto.register = _proto.add = function(taskName, desc) {
    var tasks = this._tasksQueue;

    if(tasks.some(function(task) {return task['taskName'] === taskName})) {
        throw new Error('This task was registered, please try another taskName.');
    }

    this._currTask = tasks.push({
        taskName: taskName,
        index: tasks.length,
        desc: desc || 'TASK: ' + taskName + ' registered.',
        steps: []
    });

    // this._currTask['']

    this.log('Register task: ', taskName, ' done.');
    return this;
};

_proto.log = function() {
    if(this.debug) console.log.apply(null, arguments);

    return this;
};

/*
 * Add a asynchronous method to current task.
 * @public
 * @param stepName {String} the name of this step
 * @param stepHandler {Function} optional step handler method
 * @param args {Mix} optional the data access to stepHandler
 * @return this
 * @example:
 * ``` js
 * Task().add('foo').step('bar', fn, *args)
 * Task().add('foo').step('bar').bar(fn, *args)
 * ```
 */
_proto.step = function(stepName) {
    var stepName = arguments[0];
    var args = [].prototype.slice.call(arguments, 1);
    var stepHandler;

    if(typeof stepName !== 'string') throw new Error('Step name must be assigned.');
    if(!this._currTask) throw new Error('You did not declare task for the step: ' + stepName);

    if(args[0] && typeof args[0] === 'function') stepHandler = args.shift();
};

_proto.prev = function() {};

_proto.next = function() {};

_proto.jump = function() {};

_proto.end = function() {
    this._currTask = null;
};

_proto.error = function() {};

_proto.timeout = function() {};

_proto.run = function() {};
