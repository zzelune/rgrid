/*
  rtable v1.0
  author : limodou@gmail.com

  options:
    cols(Must):           column definition
    data(Optional):       data source, could be DataSet instance, or just array or empty
    height(Optional):     height of grid, if no provided, it'll use parent height, if the value is 'auto', it'll
        increase grid     height automatically, so there will be no scroll-y at all
    width(Optional):      width of grid, if no provided, it'll use parent width
    rawHeight(Optional):  single row height. Default is 24
    nameField(Optional):  Which value will be used for name of column, default is 'name'
    titleField(Optional): Which value will be used for title of column, default is 'title'
    start:                Starting index value, it'll be used for index column
    indexCol:             Display index column, starting value will be this.start
    indexColWidth:        Width of index column, default is 40
    checkCol:             Display checkbox column
    multiSelect:          Multi selection, default is false
    clickSelect:          If click can select row, default is 'row', others are: 'column', null
    remoteSort:           If sort in remote, it'll invoke a callback onSort. Default is false

  events:
    onUpdate:             When DataSet changed, it'll invoke function(dataset, action, changed)
*/
riot.tag2('rtable', '<yield></yield> <div class="rtable-root" riot-style="width:{width}px;height:{height}px"> <div class="rtable-header rtable-fixed" riot-style="width:{fix_width}px;height:{header_height}px"> <div each="{fix_columns}" no-reorder class="{rtable-cell:true}" riot-style="width:{width}px;height:{height}px;left:{left}px;top:{top}px;line-height:{height}px;"> <div if="{type!=\'check\'}" data-is="raw" content="{title}" riot-style="{sort?\'padding-right:18px\':\'\'}"></div> <input if="{type==\'check\' && parent.multiSelect}" type="checkbox" onclick="{checkall}" class="rtable-check"></input> <div if="{!fixed && leaf}" class="rtable-resizer" onmousedown="{colresize}"></div> <div if="{sort}" class="{rtable-sort:true, desc:get_sorted(name)==\'desc\', asc:get_sorted(name)==\'asc\'}" title="{sort}" onclick="{sort_handler}"></div> </div> </div> <div class="rtable-header rtable-main" riot-style="width:{width-fix_width-scrollbar_width}px;height:{header_height}px;left:{fix_width}px;"> <div each="{main_columns}" no-reorder class="{rtable-cell:true}" riot-style="width:{width}px;height:{height}px;left:{left}px;top:{top}px;line-height:{height}px;"> <div if="{type!=\'check\'}" data-is="raw" content="{title}" riot-style="{sort?\'padding-right:18px\':\'\'}"></div> <input if="{type==\'check\' && parent.multiSelect}" type="checkbox" onclick="{checkall}" class="rtable-check"></input> <div if="{!fixed && leaf}" class="rtable-resizer" onmousedown="{colresize}"></div> <div if="{sort}" class="{rtable-sort:true, desc:get_sorted(name)==\'desc\', asc:get_sorted(name)==\'asc\'}" title="{sort}" onclick="{sort_handler}"></div> </div> </div> <div class="rtable-body rtable-fixed" riot-style="width:{fix_width}px;bottom:{scrollbar_width}px;top:{header_height}px;bottom:0px;"> <div class="rtable-content" riot-style="width:{fix_width}px;height:{rows.length*rowHeight}px;"> <div each="{col in visCells.fixed}" no-reorder class="{rtable-cell:true, selected:col.selected}" riot-style="width:{col.width}px;height:{col.height}px;left:{col.left}px;top:{col.top}px;line-height:{col.height}px;{col.style}"> <div if="{col.type!=\'check\' && !col.buttons}" data-is="raw" content="{col.value}" class="rtable-cell-text" onclick="{parent.click_handler}"></div> <input if="{col.type==\'check\'}" type="checkbox" onclick="{checkcol}" __checked="{col.selected}" class="rtable-check"></input> </div> </div> </div> <div class="rtable-body rtable-main" onscroll="{scrolling}" ontouchmove="{touchmove}" onmousewheel="{mousewheel}" riot-style="left:{fix_width}px;top:{header_height}px;right:0px;bottom:0px;width:{width-fix_width-scrollbar_width}px;"> <div class="rtable-content" riot-style="width:{main_width}px;height:{rows.length*rowHeight}px;"> <div each="{col in visCells.main}" no-reorder class="{rtable-cell:true, selected:col.selected}" riot-style="width:{col.width}px;height:{col.height}px;left:{col.left}px;top:{col.top}px;line-height:{col.height}px;"> <div if="{col.type!=\'check\' && !col.buttons}" data-is="raw" content="{col.value}" class="rtable-cell-text" onclick="{parent.click_handler}"></div> <input if="{col.type==\'check\'}" type="checkbox" onclick="{checkcol}" __checked="{col.selected}" class="rtable-check"></input> <div if="{col.buttons}" no-reorder each="{btn in col.buttons}"> <i if="{btn.icon}" class="fa fa-{btn.icon} action" title="{btn.title}" onclick="{parent.parent.action_click(parent.col, btn)}"></i> <a if="{btn.label}" class="action" title="{btn.title}" href="{btn.href || \'#\'}" onclick="{parent.parent.action_click(parent.col, btn)}">{btn.label}</a> </div> </div> </div> </div> </div> </div>', 'rtable .action,[riot-tag="rtable"] .action,[data-is="rtable"] .action{cursor:pointer;} rtable .rtable-root,[riot-tag="rtable"] .rtable-root,[data-is="rtable"] .rtable-root{ position:relative; border: 1px solid gray; } rtable .rtable-header,[riot-tag="rtable"] .rtable-header,[data-is="rtable"] .rtable-header{ position:absolute; box-sizing: border-box; } rtable .rtable-header.rtable-fixed,[riot-tag="rtable"] .rtable-header.rtable-fixed,[data-is="rtable"] .rtable-header.rtable-fixed{ left:0; top:0; } rtable .rtable-header.rtable-main,[riot-tag="rtable"] .rtable-header.rtable-main,[data-is="rtable"] .rtable-header.rtable-main{ top:0; overflow:hidden; } rtable .rtable-cell,[riot-tag="rtable"] .rtable-cell,[data-is="rtable"] .rtable-cell{ position:absolute; box-sizing: border-box; border-right:1px solid gray; border-bottom:1px solid gray; background-color: white; } rtable .rtable-cell>*,[riot-tag="rtable"] .rtable-cell>*,[data-is="rtable"] .rtable-cell>*{ white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } rtable .rtable-cell > .rtable-resizer,[riot-tag="rtable"] .rtable-cell > .rtable-resizer,[data-is="rtable"] .rtable-cell > .rtable-resizer{ width:4px; position:absolute; height:100%; cursor: col-resize; top:0px; right:0px; } rtable .rtable-cell.selected,[riot-tag="rtable"] .rtable-cell.selected,[data-is="rtable"] .rtable-cell.selected{ background-color:#ffefd5; } rtable .rtable-cell .rtable-check,[riot-tag="rtable"] .rtable-cell .rtable-check,[data-is="rtable"] .rtable-cell .rtable-check{ vertical-align: text-bottom; margin-top: 5px; } rtable .rtable-cell .rtable-sort:before,[riot-tag="rtable"] .rtable-cell .rtable-sort:before,[data-is="rtable"] .rtable-cell .rtable-sort:before,rtable .rtable-cell .rtable-sort.desc:before,[riot-tag="rtable"] .rtable-cell .rtable-sort.desc:before,[data-is="rtable"] .rtable-cell .rtable-sort.desc:before,rtable .rtable-cell .rtable-sort.asc:before,[riot-tag="rtable"] .rtable-cell .rtable-sort.asc:before,[data-is="rtable"] .rtable-cell .rtable-sort.asc:before{ position: absolute; display: block; content: ""; background-color: transparent; border-left: 1px solid #ccc; border-bottom: 1px solid #ccc; height: .5rem; width: .5rem; right: 8; top: 6; z-index: 102; cursor: pointer; -webkit-transform: rotate(45deg); -ms-transform: rotate(45deg); -o-transform: rotate(45deg); transform: rotate(45deg); } rtable .rtable-cell .rtable-sort.desc:before,[riot-tag="rtable"] .rtable-cell .rtable-sort.desc:before,[data-is="rtable"] .rtable-cell .rtable-sort.desc:before{ border-left: 1px solid black; border-bottom: 1px solid black; -webkit-transform: rotate(-45deg); -ms-transform: rotate(-45deg); -o-transform: rotate(-45deg); transform: rotate(-45deg); top: 4; } rtable .rtable-cell .rtable-sort.asc:before,[riot-tag="rtable"] .rtable-cell .rtable-sort.asc:before,[data-is="rtable"] .rtable-cell .rtable-sort.asc:before{ border-left: 1px solid black; border-bottom: 1px solid black; -webkit-transform: rotate(135deg); -ms-transform: rotate(135deg); -o-transform: rotate(135deg); transform: rotate(135deg); top:8; } rtable .rtable-header .rtable-cell,[riot-tag="rtable"] .rtable-header .rtable-cell,[data-is="rtable"] .rtable-header .rtable-cell{ text-align:center; vertical-align: middle; } rtable .rtable-body,[riot-tag="rtable"] .rtable-body,[data-is="rtable"] .rtable-body{ position:absolute; box-sizing: border-box; } rtable .rtable-body.rtable-fixed,[riot-tag="rtable"] .rtable-body.rtable-fixed,[data-is="rtable"] .rtable-body.rtable-fixed{ left:0; overflow: hidden; } rtable .rtable-body.rtable-main,[riot-tag="rtable"] .rtable-body.rtable-main,[data-is="rtable"] .rtable-body.rtable-main{ overflow: auto; }', '', function(opts) {

  var self = this
  this.root.instance = this
  this.nameField = opts.nameField || 'name'
  this.titleField = opts.titleField || 'title'
  this.onUpdate = opts.onUpdate || function(){}
  this.onSort = opts.onSort || function(){}
  this.rowHeight = opts.rowHeight || 24
  this.indexColWidth = opts.indexColWidth || 40
  this.multiSelect = opts.multiSelect || false
  this.visCells = []
  this.selected_rows = []
  this.sort_cols = []
  this.clickSelect = opts.clickSelect || 'row'
  if (opts.data) {
    if (Array.isArray(opts.data)) {
      this._data = new DataSet()
      this._data.add(opts.data)
    }
    else
      this._data = opts.data
  } else {
    this._data = new DataSet()
  }

  this.bind = function () {

    this._data.on('*', function(r, d){
        self.onUpdate(dataset, r, d)
        self.ready_data()
      self.update()
    })
  }

  this.ready_data = function(){
    var order = []

    if (!opts.remoteSort && this.sort_cols.length) {
      for(i=0, len=this.sort_cols.length; i<len; i++) {
        col = this.sort_cols[i]
        if (col.direction == 'desc')
          order.push('-'+col.name)
        else if (col.direction == 'asc')
          order.push(col.name)
      }
      this.rows = this._data.get({order:order})
    }
    else
      this.rows = this._data.get()
  }

  this.on('mount', function() {
    if (opts.width === 'auto' || !opts.width) {
      this.width = $(this.root).parent().width()
    } else {
      this.width = opts.width
    }
    if (opts.height === 'auto' || !opts.height) {
      this.height = $(this.root).parent().height()
    } else {
      this.height = opts.height
    }

    this.content = this.root.querySelectorAll(".rtable-body.rtable-main")[0]
    this.header = this.root.querySelectorAll(".rtable-header.rtable-main")[0]
    this.content_fixed = this.root.querySelectorAll(".rtable-body.rtable-fixed")[0]

    this.ready_data()
    this.calHeader()
    this.calData()
    this.bind()
    this.update()
  })

  this.click_handler = function(e) {
    e.preventDefault()
    if (self.clickSelect === 'row') {
      self.toggle_select(e.item.col.row)
    } else if (self.clickSelect === 'column') {

    }
  }

  this.sort_handler = function(e) {
    var name, dir, col

    e.preventDefault()
    name = e.item.name
    if (self.sort_cols.length == 0)
      dir = 'asc'
    else {
      col = self.sort_cols[0]
      if (col.direction == 'desc') {
        dir = false
      } else if (col.direction == 'asc') {
        dir = 'desc'
      } else {
        dir = 'asc'
      }
    }
    if (dir)
      self.sort_cols = [{name:name, direction:dir}]
    else
      self.sort_cols = []
    if (self.remoteSort)
      self.onSort.call(self, self.sort_cols)
    else
      self.ready_data()
  }

  this.colresize = function (e) {
    var start = e.clientX
    var header = $(this.header)
    var root = $(document)
    var col = e.item
    var width = col.width, d

    document.selection && document.selection.empty && ( document.selection.empty(), 1)
    || window.getSelection && window.getSelection().removeAllRanges();
    document.body.onselectstart = function () {
        return false;
    };
    header.css('-moz-user-select','none');

    root.on('mousemove', function(e){
      d = Math.max(width + e.clientX - start, 5)
      col.real_col.width = d
      self.calHeader()
      self.update()
    }).on('mouseup', function(e){
        document.body.onselectstart = function(){
            return true;
        };
        header.css('-moz-user-select','text');
        root.off('mousemove').off('mouseup')
    })
  }

  function getScrollbarWidth() {
      var oP = document.createElement('p'),
          styles = {
              width: '100px',
              height: '100px',
              overflowY: 'scroll'
          }, i, scrollbarWidth;
      for (i in styles) oP.style[i] = styles[i];
      document.body.appendChild(oP);
      scrollbarWidth = oP.offsetWidth - oP.clientWidth;
      document.body.removeChild(oP);
      return scrollbarWidth;
  }
  this.on('update', function(){
    this.start = opts.start || 0
    if (!this.content)
      return
    this.calVis()
    console.log('update')
  })

  function _parse_header(cols, max_level, frozen){
    var columns = [], i, len, j, jj, col,
      subs_len,
      path,
      rowspan,
      colspan,
      parent,
      new_col,
      last_pos,
      left

    if (!cols || cols.length === 0)
      return []

    for (i=0; i<max_level; i++) {
      columns.push([])
    }

    for(i=0, len=cols.length; i<len; i++) {
      col = cols[i]
      subs_len = col.subs.length
      rowspan = 1
      last_pos = -1
      for (j=0; j<subs_len; j++) {
        path = col.subs[j]
        new_col = {}
        new_col.title = path
        if (j == subs_len - 1) {

          new_col.rowspan = max_level - (subs_len-1)*rowspan
          new_col.leaf = true

        } else {
          new_col.rowspan = rowspan
        }
        new_col.colspan = 1
        new_col.level = j
        new_col.col = i
        new_col.width = col.width
        new_col.height = new_col.rowspan * self.rowHeight
        new_col.top = (self.rowHeight) * j
        new_col.frozen = frozen
        new_col.buttons = col.buttons
        new_col.render = col.render
        new_col.name = col.name
        new_col.real_col = col
        new_col.fixed = col.fixed
        new_col.style = col.style
        new_col.type = col.type
        new_col.sort = col.sort

        if (columns[j].length > 0)
          left = columns[j][columns[j].length-1]
        else {
          left = null
        }

        if (j == 0) {
          last_pos = -1
          parent = null
        } else {

          parent = columns[j-1][columns[j-1].length-1]
          last_pos = parent.col
        }

        if (left && left.title==new_col.title && left.level==new_col.level && last_pos<i) {
          left.colspan ++
          left.width += new_col.width
        } else {
          columns[j].push(new_col)
          new_col.parent_col = parent
          if (i == 0) {
            new_col.left = 0
          } else {
            if (left)
              new_col.left = left.left + left.width
            else if (parent)
              new_col.left = parent.left
            else
              new_col.left = 0
          }
        }
        col.left = new_col.left
      }
    }
    var r = []
    for (i=0; i<max_level; i++)
      r = r.concat(columns[i])
    return r
  }

  this.calHeader = function () {
    var columns,
      fix_columns,
      i, len,
      col,
      max_level,
      fix_cols = [],
      cols = [],
      cal_cols=[],
      width = 0,
      has_frozen;

    max_level = 0

    this.cols = opts.cols.slice()

    if (opts.indexCol) {
      col = {
        render:function(row, col, value){
          return col.index + 1
        },
        width:self.indexColWidth,
        frozen:true,
        style:'text-align:center;'
      }
      col[this.nameField] = '#'
      col[this.titleField] = '#'
      this.cols.unshift(col)
    }

    for(i=0, len=self.cols.length; i<len; i++){
      if (this.cols[i].frozen){
        has_frozen = true
        break
      }
    }

    if (opts.checkCol) {
      col = {
        type:'check',
        width:30,
        style:'text-align:center;',
        frozen:has_frozen
      }
      col[this.nameField] = '_check'
      col[this.titleField] = '_check'
      if (!opts.indexCol)
        this.cols.unshift(col)
      else
        this.cols.splice(1, 0, col)
    }

    for (i=0, len=this.cols.length; i<len; i++){
      col = this.cols[i]
      if (col.hidden)
        continue
      if (col.frozen)
        fix_cols.push(col)
      else
        cols.push(col)
      col.name = col[this.nameField]
      col.title = col[this.titleField] || col.name
      col.subs = col.title.split('/')
      max_level = Math.max(max_level, col.subs.length)
      if (!col.width)
        cal_cols.push(col)
      else
        width += col.width
    }

    if (cal_cols.length > 0) {
      var dw = Math.floor((this.width-width)/cal_cols.length)
      for(var i=0, len=cal_cols.length; i<len; i++) {
        cal_cols[i].width = dw
        if (i == cal_cols.length - 1)
          cal_cols[i].width = (this.width-width) - (cal_cols.length-1)*dw
      }
    }

    columns = _parse_header(cols, max_level, false)
    fix_columns = _parse_header(fix_cols, max_level, true)

    this.fix_cols = fix_cols
    this.main_cols = cols
    this.fix_columns = fix_columns
    this.main_columns = columns
    this.max_level = max_level

    var fix_width = 0, main_width = 0, col;
    for (var i=0, len=this.cols.length; i<len; i++) {
      col = this.cols[i]
      if (col.hidden)
        continue
      if (col.frozen)
        fix_width += col.width
      else
        main_width += col.width
    }
    this.header_height = this.max_level * this.rowHeight
    this.fix_width = fix_width
    this.main_width = main_width
    this.has_xscroll = this.main_width > (this.width - this.fix_width)
    this.scrollbar_width = getScrollbarWidth()
  }

  this.calData = function() {
    this.has_yscroll = this.rows.length * this.rowHeight > (this.height - this.header_height)
  }

  this.calVis = function() {
    var i, j, last, len, len1, r2, cols, row, col, new_row, value, d,
      visible, visiblefixed, visrows, top, h, r1

    r1 = {}
    r1.top = this.content.scrollTop
    r1.left = this.content.scrollLeft
    r1.bottom = r1.top + this.height - this.header_height - this.scrollbar_width
    r1.right = r1.left + this.main_width - this.fix_width - this.scrollbar_width

    first = Math.max(Math.floor(this.content.scrollTop / this.rowHeight), 0)
    last = Math.ceil((this.content.scrollTop+this.height-this.header_height) / this.rowHeight)
    var b = new Date().getTime()

    visrows = this.rows.slice(first, last)
    visible = []
    visiblefixed = []
    h = this.rowHeight

    cols = this.fix_columns.concat(this.main_columns)
    for (i = 0, len = visrows.length; i < len; i++) {
      row = visrows[i];
      top = h*(first+i)
      for (j=0, len1=cols.length; j<len1; j++) {
        col = cols[j]
        d = {top:top, width:col.width, height:h, left: col.left,
          row:row, style:col.style, type:col.type, selected:this.is_selected(row),
          render:col.render, buttons:col.buttons, index:first+i, sor:col.sort}
        d.value = this.get_col_data(d, row[col.name])
        if (col.frozen)
          visiblefixed.push(d)
        else {

          if (!(d.left > r1.right || d.right < r1.left))
            visible.push(d)
        }
      }
    }
    this.visCells = {
      fixed: visiblefixed,
      main: visible
    }
  }

  this.get_sorted = function(name) {
    var col

    for(var i=0, len=this.sort_cols.length; i<len; i++) {
      col = this.sort_cols[i]
      if (col.name == name && col.direction)
        return col.direction
    }
  }

  this.scrolling = function(e) {
    e.preventUpdate = true
    this.header.scrollLeft = this.content.scrollLeft
    this.content_fixed.scrollTop = this.content.scrollTop
    return this.update()
  }

  this.checkall = function(e) {
    if (e.target.checked)
      self.selected_rows = self._data.getIds()
    else
      self.selected_rows = []
  }

  this.checkcol = function(e) {
    if (e.target.checked){
      self.select(e.item.col.row)
    } else
      self.deselect(e.item.col.row)
  }

  this.toggle_select = function (row) {
    if (this.is_selected(row)) {
      self.deselect(row)
    } else {
      self.select(row)
    }
  }

  this.select = function(rows) {
    var row, id

    if (!opts.multiSelect)
      self.selected_rows = []

    if (!rows) rows = this._data.get()
    if (!Array.isArray(rows)) {
      rows = [rows]
    }
    for(var i=0, len=rows.length; i<len; i++){
      row = rows[i]
      if (row instanceof Object) id = row.id
      else id = row
      if (this.selected_rows.indexOf(id) == -1)
        this.selected_rows.push(id)
    }
  }

  this.deselect = function(rows) {
    var r = [], row, selected_rows = this.selected_rows, index, items = [], id
    if (!rows) this.selected_rows = []
    else {
      if (!Array.isArray(rows))
        rows = [rows]
      for (var i=0, len=rows.length; i<len; i++) {
        if (rows[i] instanceof Object) id = rows[i].id
        else id = rows[i]
        items.push(id)
      }
      for(var i=selected_rows.length-1; i>-1; i--){
        row = selected_rows[i]
        index = items.indexOf(row)
        if (index != -1){
          selected_rows.splice(i, 1)
          items.splice(index, 1)
        }
        if (rows.length == 0)
          break
      }
    }
  }

  function wrap(func) {
    return function f(){
      return func.apply(self, arguments)
    }
  }

  this.is_selected = function (row) {
    var id
    if (!row) return
    if (row instanceof Object) id = row.id
    else id = row
    return self.selected_rows.indexOf(id) !== -1
  }
  this.root.is_selected = wrap(this.is_selected)

  this.get_selected = function(){
    return this._data.get({
      filter:function(item){
        return self.selected_rows.indexOf(item.id) !== -1
      }
    })
  }
  this.root.get_selected = wrap(this.get_selected)

  this.root.load = function(newrows){
    self._data.clear()
    self._data.add(newrows)
  }.bind(this);

  this.root.change = function(newrows){
    self._data.update(newrows)
  }.bind(this);

  this.root.setData = function(dataset){
    self._data = dataset
    self.bind()
  }.bind(this);

  this.get_col_data = function(col, value) {
    if (col.render && typeof col.render === 'function') {
      return col.render(col.row, col, value)
    }
    return value
  }

  this.action_click = function (col, btn) {
    return function (e) {
      if (btn.onclick && typeof btn.onclick === 'function') {

        btn.onclick.call(e.target, col.row, self)
      }
    }
  }

});

riot.tag2('raw', '<span></span>', '', '', function(opts) {
  this.on('mount', function(){
    this.root.innerHTML = opts.content
  })
  this.on('update', function () {
    this.root.innerHTML = opts.content
  })
});
