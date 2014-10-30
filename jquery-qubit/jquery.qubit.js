(function($) {
  $.fn.qubit = function(options) {
    return this.each(function() {
      var qubit = new Qubit(this, options);
    });
  };
  var Qubit = function(el) {
    var self = this;
    this.scope = $(el);
    this.scope.on('change', 'input[type=checkbox]', function(e) {
      if (!self.suspendListeners) {
        self.process(e.target);
      }
    });
    this.scope.find('input[type=checkbox]:checked').each(function() {
      self.process(this);
    });
  };
  Qubit.prototype = {
    itemSelector: 'li',
    process: function(checkbox) {
      var checkbox = $(checkbox),
          parentItems = checkbox.parentsUntil(this.scope, this.itemSelector);
      try {
        this.suspendListeners = true;
        // all children inherit my state
        parentItems.eq(0).find('input[type=checkbox]')
          .filter(checkbox.prop('checked') ? ':not(:checked)' : ':checked')
          .each(function() {
            if (!$(this).parent().hasClass('hidden')) {
              $(this).prop('checked', checkbox.prop('checked'));
            }
          })
          .trigger('change');
        this.processParents(checkbox);
      } finally {
        this.suspendListeners = false;
      }
    },
    processParents: function() {
      var self = this;
      this.scope.find('input[type=checkbox]').each(function() {
        var $this = $(this),
            parent = $this.closest(self.itemSelector),
            children = parent.find('input[type=checkbox]').not($this),
            numChecked = children.filter(':checked').length;

        if (children.length) {
          if (numChecked == 0) {
            self.setChecked($this, false);
          } else if (numChecked == children.length) {
            self.setChecked($this, true);
          } else {
            self.setIndeterminate($this, true);
          }
        }
        else {
          self.setIndeterminate($this, false);
        }
      });
    },
    setChecked: function(checkbox, value, event) {
      checkbox.prop('indeterminate', false);
      if (checkbox.prop('checked') != value) {
        checkbox.prop('checked', value).trigger('change');
      }
    },
    setIndeterminate: function(checkbox, value) {
      checkbox.prop('indeterminate', value);
      if (value) {
        checkbox.prop('checked', true);
      }
    }
  };
}(jQuery));
