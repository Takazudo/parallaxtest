(function() {
  var $win, FreeBlock, FreeBlockManager, log,
    __slice = Array.prototype.slice;

  $win = $(window);

  log = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return typeof console !== "undefined" && console !== null ? console.log.apply(console, args) : void 0;
  };

  FreeBlock = (function() {

    function FreeBlock($el, initialScrollTop) {
      var distance, o, time;
      this.$el = $el;
      o = this.options = {
        prop: $el.data('freeitem-prop'),
        val_min: $el.data('freeitem-val-min'),
        val_max: $el.data('freeitem-val-max'),
        st_start: $el.data('freeitem-st-start'),
        st_end: $el.data('freeitem-st-end')
      };
      distance = o.val_max - o.val_min;
      time = o.st_end - o.st_start;
      this._speed = distance / time;
      this.update(initialScrollTop);
      $el.css('opacity', .5);
    }

    FreeBlock.prototype.update = function(scrollTop) {
      var o, st;
      st = scrollTop;
      o = this.options;
      if (this._isAbove(st)) {
        this.$el.css(o.prop, o.val_min);
      } else if (this._isBelow(st)) {
        this.$el.css(o.prop, o.val_max);
      } else {
        this.$el.css(o.prop, o.val_min + ((st - o.st_start) * this._speed));
      }
      return this;
    };

    FreeBlock.prototype._isAbove = function(st) {
      return st < this.options.st_start;
    };

    FreeBlock.prototype._isBelow = function(st) {
      return st > this.options.st_end;
    };

    return FreeBlock;

  })();

  FreeBlockManager = (function() {

    function FreeBlockManager() {
      this._callbacks = $.Callbacks();
      this._items = [];
      this._eventify();
      this._initItems();
    }

    FreeBlockManager.prototype._eventify = function() {
      var _this = this;
      $win.scroll(function() {
        var st;
        st = $win.scrollTop();
        return _this._callbacks.fire(st);
      });
      return this;
    };

    FreeBlockManager.prototype._initItems = function() {
      var _this = this;
      $('.item').each(function(i, el) {
        return _this.add($(el));
      });
      return this;
    };

    FreeBlockManager.prototype.add = function($el) {
      var _this = this;
      setTimeout((function() {
        var item;
        item = new FreeBlock($el, $win.scrollTop());
        _this._items.push(item);
        return _this._callbacks.add(function(scrollTop) {
          return item.update(scrollTop);
        });
      }), 500);
      return this;
    };

    return FreeBlockManager;

  })();

  $(function() {
    return new FreeBlockManager;
  });

}).call(this);
