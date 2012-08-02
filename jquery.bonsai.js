(function($){
	$.fn.bonsai = function( options ) {
		return this.each(function() {
			var bonsai = new Bonsai(this, options);
		});
	};
	var Bonsai = function( el, options ) {
		var self = this,
			config = $.extend({
				expandAll: false, // boolean expands all items
				expand: null, // function to expand an item
				collapse: null, // function to expand an item
				checkboxes: false, // requires jquery.qubit
				// createCheckboxes: creates checkboxes for each list item.
				// The name and value for the checkboxes are taken from data-name 
				// and data-value. The name is inherited from parent items if not 
				// specified. Checked state can be indicated using data-checked
				createCheckboxes: false
			}, options), checkboxes;
		el = $(el);
		el.addClass('bonsai');
		
		if( config.checkboxes ) {
			// handle checkboxes once at the root of the tree
			options.checkboxes = false;
		}
		// look for a nested list (if any)
		el.children().each(function() {
			var item = $(this),
				thumb = $('<div class="thumb" />');
			if( config.createCheckboxes ) {
				self.createCheckbox(item);
			}
			item.prepend(thumb);
			// if there is a child list
			$(this).children().filter('ol, ul').last().each(function() {
					// then this el has children
					item.addClass('has-children')
						// attach the sub-list to the item
						.data('subList', this);
					thumb.on('click', function() {
						self.toggle(item);
					});
					// collapse the nested list
					if( config.expandAll || item.hasClass('expanded') ) {
						self.expand(item);
					}
					else {
						self.collapse(item);
					}
					// handle any deeper nested lists
					$(this).bonsai(options)
			});
		});
		if( config.checkboxes ) {
			el.qubit(options);
		}
		this.expand = config.expand || this.expand;
		this.collapse = config.collapse || this.collapse;
		this.initialised = true;
	};
	Bonsai.prototype = {
		initialised: false,
		toggle: function( el ) {
			if( !$(el).hasClass('expanded') ) {
				this.expand(el);
			}
			else {
				this.collapse(el);
			}
		},
		expand: function( el ) {
			el = $(el).addClass('expanded')
				.removeClass('collapsed');
			$(el.data('subList')).css('height', 'auto');
		},
		collapse: function( el ) {
			el = $(el).addClass('collapsed')
				.removeClass('expanded');
			$(el.data('subList')).height(0);
		},
		createCheckbox: function( item ) {
			item.prepend('<input type="checkbox" name="' 
				+ this.getCheckboxName(item)
				+ '" value="' + item.data('value') + '"'
				+ (item.data('checked') ? ' checked="checked"' : '')
				+ ' /> '
			);
		},
		getCheckboxName: function( item ) {
			return item.data('name')
				|| item.parents().filter('[data-name]').data('name');
		} 
	};
}(jQuery));