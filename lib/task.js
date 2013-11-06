/*
 * @description
 * @class Task
 */
var Task = module.exports = function() {};
var _proto = Task.prototype;
var _taskQueue = Object.create({});
var _currTask;

/*
 * @description register a task
 * @public
 * @param taskName {String}
 * @return this
 * @example
 */
_proto.register = function(taskName) {
    if(_taskQueue[taskName]) throw Error('This task was registered, please try another taskName.');

    _currTask = _taskQueue
};

_proto.step = function() {};

_proto.next = function() {};

_proto.jump = function() {};

_proto.end = function() {};

_proto.stop = function() {};

_proto.error = function() {};

_proto.timeout = function() {};

_proto.run = function() {};
