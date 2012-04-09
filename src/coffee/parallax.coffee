$win = $(window)
log = (args...) -> console?.log.apply console, args

class FreeBlock
  constructor: (@$el, initialScrollTop) ->

    o = @options =
      prop: $el.data('freeitem-prop')
      val_min: $el.data('freeitem-val-min')
      val_max: $el.data('freeitem-val-max')
      st_start: $el.data('freeitem-st-start')
      st_end: $el.data('freeitem-st-end')

    # calc speed
    distance = o.val_max - o.val_min
    time = o.st_end - o.st_start
    @_speed = distance / time

    @update initialScrollTop
    $el.css 'opacity', .5

  update: (scrollTop) ->
    st = scrollTop
    o = @options
    if @_isAbove st
      @$el.css o.prop, o.val_min
    else if @_isBelow st
      @$el.css o.prop, o.val_max
    else
      @$el.css o.prop, (o.val_min + ((st - o.st_start) * @_speed))
    @

  _isAbove: (st) -> st < @options.st_start
  _isBelow: (st) -> st > @options.st_end

class FreeBlockManager
  constructor: ->
    @_callbacks = $.Callbacks()
    @_items = []
    @_eventify()
    @_initItems()

  _eventify: ->
    $win.scroll =>
      st = $win.scrollTop()
      @_callbacks.fire st
    @

  _initItems: ->
    $('.item').each (i, el) =>
      @add($(el))
    @

  add: ($el) ->
    setTimeout ( =>
      item = new FreeBlock $el, $win.scrollTop()
      @_items.push item
      @_callbacks.add (scrollTop) ->
        item.update(scrollTop)
    ), 500
    @

$ ->
  new FreeBlockManager

