$win = $(window)
log = (args...) -> console?.log.apply console, args
ns = {}

# ============================================================
# event module

class ns.Event
  constructor: ->
    @_callbacks = {}

  bind: (ev, callback) ->
    evs = ev.split(' ')
    for name in evs
      @_callbacks[name] or= []
      @_callbacks[name].push(callback)
    @

  one: (ev, callback) ->
    @bind ev, ->
      @unbind(ev, arguments.callee)
      callback.apply(@, arguments)

  trigger: (args...) ->
    ev = args.shift()
    list = @_callbacks?[ev]
    return unless list
    for callback in list
      if callback.apply(@, args) is false
        break
    @

  unbind: (ev, callback) ->
    unless ev
      @_callbacks = {}
      return @

    list = @_callbacks?[ev]
    return this unless list

    unless callback
      delete @_callbacks[ev]
      return this

    for cb, i in list when cb is callback
      list = list.slice()
      list.splice(i, 1)
      @_callbacks[ev] = list
      break
    @


# ============================================================
# ParallaxerItem

class ns.ParallaxerItem
  constructor: (@$el, @options) ->
    o = @options

    # calc speed
    distance = o.val_end - o.val_start
    time = o.st_end - o.st_start
    @_speed = distance / time

  update: (scrollTop) ->
    st = scrollTop
    o = @options
    if @_isAbove st
      @$el.css o.prop, o.val_start
    else if @_isBelow st
      @$el.css o.prop, o.val_end
    else
      @$el.css o.prop, (o.val_start + ((st - o.st_start) * @_speed))
    @

  _isAbove: (st) -> st < @options.st_start
  _isBelow: (st) -> st > @options.st_end


# ============================================================
# ParallaxerManager

class ns.ParallaxerManager extends ns.Event
  constructor: ->
    super
    @_items = []
    @_eventify()

  _eventify: ->
    $win.scroll =>
      st = $win.scrollTop()
      @trigger 'scroll', st
    @

  #_hasItemWhoseElIs: ($el) ->
  #  found = false
  #  $.each @_items, (i, item) ->
  #    if item.$el[0] isnt $el[0] then return true
  #    found = true
  #    false
  #  found

  add: ($el, options) ->
    unless $el.size() then return @
    item = new ns.ParallaxerItem $el, options
    @bind 'scroll', (scrollTop) ->
      item.update scrollTop
    #unless @_hasItemWhoseElIs $el
    item.update $win.scrollTop()
    @_items.push item
    @


# ============================================================

$.tinyscroller.live()

$ ->
  mgr = new ns.ParallaxerManager

  mgr.add $('#item-a'),
    prop: 'left'
    val_start: 100
    val_end: 1000
    st_start: 200
    st_end: 800
  mgr.add $('#item-a'),
    prop: 'top'
    val_start: 200
    val_end: 800
    st_start: 200
    st_end: 800

  mgr.add $('#item-b'),
    prop: 'left'
    val_start: 200
    val_end: 600
    st_start: 400
    st_end: 1200

  mgr.add $('#item-c'),
    prop: 'left'
    val_start: 400
    val_end: 1200
    st_start: 700
    st_end: 2000
  mgr.add $('#item-d'),
    prop: 'top'
    val_start: -1000
    val_end: 2000
    st_start: 0
    st_end: 3000


  #mgr.add $('#page1'),
  #  prop: 'margin-top'
  #  val_start: 0
  #  val_end: -500
  #  st_start: 0
  #  st_end: 1000
  
  mgr.add $('#page1 .a'),
    prop: 'left'
    val_start: -600
    val_end: 300
    st_start: 0
    st_end: 100
  mgr.add $('#page1 .b'),
    prop: 'left'
    val_start: 0
    val_end: 1200
    st_start: 400
    st_end: 600

  mgr.add $('#overlayer1 div'),
    prop: 'top'
    val_start: 800
    val_end: 0
    st_start: 400
    st_end: 2000
  mgr.add $('#overlayer1 div'),
    prop: 'height'
    val_start: 300
    val_end: 500
    st_start: 800
    st_end: 2000
    
  mgr.add $('#page2'),
    prop: 'margin-top'
    val_start: 0
    val_end: -500
    st_start: 0
    st_end: 1000
  mgr.add $('#page2 .a'),
    prop: 'left'
    val_start: 100
    val_end: 2000
    st_start: 680
    st_end: 2000
    
  mgr.add $('#page3'),
    prop: 'margin-top'
    val_start: 0
    val_end: -500
    st_start: 1000
    st_end: 2000
  mgr.add $('#page3 .a'),
    prop: 'left'
    val_start: -400
    val_end: 2000
    st_start:1200
    st_end: 2800
  mgr.add $('#page3 .b'),
    prop: 'top'
    val_start: -100
    val_end: 800
    st_start: 1200
    st_end: 2100
    
  mgr.add $('#page4'),
    prop: 'margin-top'
    val_start: 0
    val_end: -500
    st_start: 2000
    st_end: 3000
  mgr.add $('#page4 .a'),
    prop: 'left'
    val_start: 700
    val_end: 300
    st_start:2000
    st_end: 3300
  mgr.add $('#page4 .b'),
    prop: 'top'
    val_start: -600
    val_end: 1000
    st_start: 2000
    st_end: 3300

  
  mgr.add $('#xpage1 .xpage-bg'),
    prop: 'top'
    val_start: 0
    val_end: -2000
    st_start: 0
    st_end: 800
  mgr.add $('#xpage2 .xpage-bg'),
    prop: 'top'
    val_start: 0
    val_end: -4000
    st_start: 0
    st_end: 1600
  mgr.add $('#xpage3 .xpage-bg'),
    prop: 'top'
    val_start: 0
    val_end: -4000
    st_start: 800
    st_end: 2400
  mgr.add $('#xpage4 .xpage-bg'),
    prop: 'top'
    val_start: 0
    val_end: -4000
    st_start: 1600
    st_end: 3200
  mgr.add $('#xpage5 .xpage-bg'),
    prop: 'top'
    val_start: 0
    val_end: -4000
    st_start: 2400
    st_end: 4000

    
