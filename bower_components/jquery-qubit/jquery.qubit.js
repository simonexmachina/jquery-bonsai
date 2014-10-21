(function($){
	$.fn.qubit = function( options ) {
		return this.each(function() {
			var qubit = new Qubit(this, options);
		});
	};
	var Qubit = function( el ) {
		var self = this;
		this.scope = el = $(el);
		$('input[type=checkbox]', el).on('change', function(e) {
			self.process(e.target, e);
		});
		$('input[type=checkbox]:checked', el).each(function() {
			self.process(this)
		});
	};
	Qubit.prototype = {
		itemSelector: 'li',
		process: function( checkbox, event ) {
			var checkbox = $(checkbox),
				parentItems = checkbox.parentsUntil(this.scope, this.itemSelector),
				self = this;
			// all children inherit my state
			parentItems.eq(0).find('input[type=checkbox]').each(function() {
				if( !$(this).parent().hasClass('hidden') ) {
					self.setChecked(this, checkbox.prop('checked'), event);
				}
			});
			this.processParents(checkbox);
		},
		processParents: function( checkbox ) {
			checkbox = $(checkbox);
			var parentItems = checkbox.parentsUntil(this.scope, this.itemSelector),
					parent = parentItems.eq(1).children('input[type=checkbox]');
			// check parent is within our scope
			if( !$.contains(this.scope[0], parent[0]) ) return;
			if( parent.length > 0 ) {
				var siblings = this.getSiblings(checkbox, parentItems.eq(1)),
					checked = siblings.filter(':checked'),
					oldValue = this.getValue(parent), parentChecked = null;
				// if all siblings are checked
				if( siblings.length == checked.length ) {
					parentChecked = true;
				}
				// else if some are checked
				else if( checked.length > 0 ||
						// or indeterminate
						siblings.filter(isIndeterminate).length > 0 ) {
					this.setIndeterminate(parent, true);
				}
				// else none are checked
				else {
					parentChecked = false;
				}
				// update the parent
				if( parentChecked !== null ) this.setChecked(parent, parentChecked);
				// and go up the tree if it changed
				if( oldValue !== this.getValue(parent) ) this.processParents(parent);
			}
			function isIndeterminate() {
				return $(this).prop('indeterminate');
			}
		},
		setChecked: function( checkbox, value, event ) {
			$(checkbox).prop({
				checked: value,
				indeterminate: false
			});
		},
		setIndeterminate: function( checkbox, value ) {
			$(checkbox).prop({
				indeterminate: value,
				checked: null
			});
		},
		getSiblings: function( checkbox, listItem ) {
			listItem = listItem || checkbox.parentsUntil(this.itemSelector).get(1);
			return $('> ol > li > input[type=checkbox], > ul > li > input[type=checkbox]', listItem);
		},
		getValue: function( checkbox ) {
			return $(checkbox).prop('indeterminate') ? null : $(checkbox).prop('checked');
		}
	};
}(jQuery));
