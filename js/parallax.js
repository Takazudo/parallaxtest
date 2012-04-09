(function() {
  var $win, log, ns,
    __slice = Array.prototype.slice,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  $win = $(window);

  log = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return typeof console !== "undefined" && console !== null ? console.log.apply(console, args) : void 0;
  };

  ns = {};

  ns.Event = (function() {

    function Event() {
      this._callbacks = {};
    }

    Event.prototype.bind = function(ev, callback) {
      var evs, name, _base, _i, _len;
      evs = ev.split(' ');
      for (_i = 0, _len = evs.length; _i < _len; _i++) {
        name = evs[_i];
        (_base = this._callbacks)[name] || (_base[name] = []);
        this._callbacks[name].push(callback);
      }
      return this;
    };

    Event.prototype.one = function(ev, callback) {
      return this.bind(ev, function() {
        this.unbind(ev, arguments.callee);
        return callback.apply(this, arguments);
      });
    };

    Event.prototype.trigger = function() {
      var args, callback, ev, list, _i, _len, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      ev = args.shift();
      list = (_ref = this._callbacks) != null ? _ref[ev] : void 0;
      if (!list) return;
      for (_i = 0, _len = list.length; _i < _len; _i++) {
        callback = list[_i];
        if (callback.apply(this, args) === false) break;
      }
      return this;
    };

    Event.prototype.unbind = function(ev, callback) {
      var cb, i, list, _len, _ref;
      if (!ev) {
        this._callbacks = {};
        return this;
      }
      list = (_ref = this._callbacks) != null ? _ref[ev] : void 0;
      if (!list) return this;
      if (!callback) {
        delete this._callbacks[ev];
        return this;
      }
      for (i = 0, _len = list.length; i < _len; i++) {
        cb = list[i];
        if (!(cb === callback)) continue;
        list = list.slice();
        list.splice(i, 1);
        this._callbacks[ev] = list;
        break;
      }
      return this;
    };

    return Event;

  })();

  ns.ParallaxerItem = (function() {

    function ParallaxerItem($el, options) {
      var distance, o, time;
      this.$el = $el;
      this.options = options;
      o = this.options;
      distance = o.val_end - o.val_start;
      time = o.st_end - o.st_start;
      this._speed = distance / time;
    }

    ParallaxerItem.prototype.update = function(scrollTop) {
      var o, st;
      st = scrollTop;
      o = this.options;
      if (this._isAbove(st)) {
        this.$el.css(o.prop, o.val_start);
      } else if (this._isBelow(st)) {
        this.$el.css(o.prop, o.val_end);
      } else {
        this.$el.css(o.prop, o.val_start + ((st - o.st_start) * this._speed));
      }
      return this;
    };

    ParallaxerItem.prototype._isAbove = function(st) {
      return st < this.options.st_start;
    };

    ParallaxerItem.prototype._isBelow = function(st) {
      return st > this.options.st_end;
    };

    return ParallaxerItem;

  })();

  ns.ParallaxerManager = (function(_super) {

    __extends(ParallaxerManager, _super);

    function ParallaxerManager() {
      ParallaxerManager.__super__.constructor.apply(this, arguments);
      this._items = [];
      this._eventify();
    }

    ParallaxerManager.prototype._eventify = function() {
      var _this = this;
      $win.scroll(function() {
        var st;
        st = $win.scrollTop();
        return _this.trigger('scroll', st);
      });
      return this;
    };

    ParallaxerManager.prototype._hasItemWhoseElIs = function($el) {
      var found;
      found = false;
      $.each(this._items, function(i, item) {
        if (item.$el[0] !== $el[0]) return true;
        found = true;
        return false;
      });
      return found;
    };

    ParallaxerManager.prototype.add = function($el, options) {
      var item;
      if (!$el.size()) return this;
      item = new ns.ParallaxerItem($el, options);
      this.bind('scroll', function(scrollTop) {
        return item.update(scrollTop);
      });
      if (!this._hasItemWhoseElIs($el)) item.update($win.scrollTop());
      this._items.push(item);
      return this;
    };

    return ParallaxerManager;

  })(ns.Event);

  $(function() {
    var mgr;
    mgr = new ns.ParallaxerManager;
    mgr.add($('#item-a'), {
      prop: 'left',
      val_start: 100,
      val_end: 1000,
      st_start: 200,
      st_end: 800
    });
    mgr.add($('#item-a'), {
      prop: 'top',
      val_start: 200,
      val_end: 800,
      st_start: 200,
      st_end: 800
    });
    mgr.add($('#item-b'), {
      prop: 'left',
      val_start: 200,
      val_end: 600,
      st_start: 400,
      st_end: 1200
    });
    mgr.add($('#item-c'), {
      prop: 'left',
      val_start: 400,
      val_end: 1200,
      st_start: 700,
      st_end: 2000
    });
    mgr.add($('#item-d'), {
      prop: 'top',
      val_start: -1000,
      val_end: 2000,
      st_start: 0,
      st_end: 3000
    });
    mgr.add($('#page1 .a'), {
      prop: 'left',
      val_start: -600,
      val_end: 100,
      st_start: 0,
      st_end: 100
    });
    mgr.add($('#page1 .b'), {
      prop: 'left',
      val_start: 0,
      val_end: 1200,
      st_start: 200,
      st_end: 500
    });
    mgr.add($('#page2'), {
      prop: 'margin-top',
      val_start: 0,
      val_end: -500,
      st_start: 0,
      st_end: 1000
    });
    mgr.add($('#page2 .a'), {
      prop: 'left',
      val_start: 100,
      val_end: 2000,
      st_start: 680,
      st_end: 2000
    });
    mgr.add($('#page3'), {
      prop: 'margin-top',
      val_start: 0,
      val_end: -500,
      st_start: 1000,
      st_end: 2000
    });
    mgr.add($('#page3 .a'), {
      prop: 'left',
      val_start: -400,
      val_end: 2000,
      st_start: 1200,
      st_end: 2800
    });
    mgr.add($('#page3 .b'), {
      prop: 'top',
      val_start: -100,
      val_end: 800,
      st_start: 1200,
      st_end: 2100
    });
    return mgr.add($('#page4'), {
      prop: 'margin-top',
      val_start: 0,
      val_end: -500,
      st_start: 2000,
      st_end: 3000
    });
  });

}).call(this);
