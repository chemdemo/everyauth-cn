/**
 * Define the node-tasks library.
 * @author <a href="mailto:yangdemo@gmail.com">dmyang</a>
 * @version 0.0.1
 * @usage:
 * ``` js
 * require('node-tasks')
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
var events = require('event');
var util = require('./util');

var Tasks = module.exports = function(debug) {
    if(!this instanceof Task) return new Task(debug);

    this.debug = debug || false;
    this._taskQueue = [];
    this._currTask = null;
    this._runStack = [];
};
var _proto = Tasks.prototype;

/*
 * Add some asynchronous methods to extend `Task` Class.
 * @class Task
 */
var Task = _proto.Task = function(taskName) {
    this.taskName = taskName;
    this._steps = []; // [new Step(), new Step()]
};

Object.defineProperty(Task.prototype, 'steps', {
    get: function() {
        var key = arguments[0];
        if(key !== undefined) {
            return typeof key === 'string' ?
                this._steps.some(function(step) {return step.taskName === key}) :
                this._steps[key];
        } else {
            return this._steps;
        }
    }
});

Task.prototype.addStep = function(stepName, handler) {
    this._steps.push(new Step(this.taskName, stepName, handler));

    Object.defineProperty(Task.prototype, stepName, {
        value: handler
        /*get: function() {
            return this.value;
        },
        set: function(fn) {
            this.value = fn;
        }*/
    });
};

Task.prototype.end = function() {
    ;
};

/*
 * Add some asynchronous methods to extend `Step` Class.
 * @class Step
 * @example:
 * ``` js
 * new Task()
 *   .step('readDir', function() {
 *       var root = this;
 *       fs.readDir(arguments[0], function(files) {
 *       files = files.map(function(file) {return path.basename;});
 *       root.next(files); // root.done(files);
 *   }, '/foo/bar')
 *   .step('listDir', function(files) {
 *       var root = this;
 *       var result = [];
 *       this.repeat(files, function(file) {}, next);
 *       async.each(files, function(file) {}, next);
 *       files.forEach(function(file) {
 *          fs.stat(file, function(err, stats) {
 *             if(stats.isFile()) result.push(file);
 *             if(stats.isDirectory()) result.cancat(root.handler(root.prev(file)));
 *          });
 *       });
 *   });
 * ```
 */
var Step = _proto.Step = function(taskName, stepName, stepHandler) {
    this.taskName = taskName;
    this.stepName = stepName;
};

Step.prototype.__proto__ = events.EventEmitter.prototype;
// nutil.inherits(Step.prototype, events.EventEmitter.prototype);

Step.prototype.prev = function() {};
Step.prototype.next = function() {};

/*
 * Register a task
 * @public
 * @param taskName {String}
 * @return this
 * @example
 */
_proto.register = _proto.add = function(taskName, desc) {
    var tasks = this._taskQueue;

    if(tasks.some(function(task) {return task['taskName'] === taskName})) {
        throw new Error('This task was registered, please try another taskName.');
    }

    var task = function() {};

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
    var step = new this._Step();

    if(typeof stepName !== 'string') throw new Error('Step name must be assigned.');
    if(!this._currTask) throw new Error('You did not declare task for the step: ' + stepName);

    if(args[0] && typeof args[0] === 'function') stepHandler = args.shift();
};

_proto.jump = function() {};

_proto.end = function() {
    this._currTask = null;
};

_proto.error = function() {};

_proto.timeout = function() {};

_proto.run = function() {};
