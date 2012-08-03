(function($){
	$.fn.bonsai = function( options ) {
		return this.each(function() {
			var bonsai = new Bonsai(this, options);
			$(this).data('bonsai', bonsai);
		});
	};
	var Bonsai = function( el, options ) {
		var self = this,
			options = $.extend({
				expandAll: false, // boolean expands all items
				expand: null, // function to expand an item
				collapse: null, // function to expand an item
				checkboxes: false, // requires jquery.qubit
				// createCheckboxes: creates checkboxes for each list item.
				// The name and value for the checkboxes are taken from data-name 
				// and data-value. The name is inherited from parent items if not 
				// specified. Checked state can be indicated using data-checked
				createCheckboxes: false,
				// handleDuplicateCheckboxes: adds onChange bindings to update 
				// any checkboxes with the same value
				handleDuplicateCheckboxes: false
			}, options),
			checkboxes;
		if( !options.root ) {
			options.root = el;
		}
		this.options = options;
		this.el = el = $(el);
		el.addClass('bonsai');
		
		if( options.checkboxes ) {
			// handle checkboxes once at the root of the tree, not on each element
			checkboxes = true;
			options.checkboxes = false;
		}
		// look for a nested list (if any)
		el.children().each(function() {
			var item = $(this),
				thumb = $('<div class="thumb" />');
			if( options.createCheckboxes ) {
				self.insertCheckbox(item);
			}
			item.prepend(thumb);
			// if there is a child list
			$(this).children().filter('ol, ul').last().each(function() {
				if( $('li', this).length == 0 ) {
					return;
				}
				// then this el has children
				item.addClass('has-children')
					// attach the sub-list to the item
					.data('subList', this);
				thumb.on('click', function() {
					self.toggle(item);
				});
				// collapse the nested list
				if( options.expandAll || item.hasClass('expanded') ) {
					self.expand(item);
				}
				else {
					self.collapse(item);
				}
				// handle any deeper nested lists
				$(this).bonsai(options)
			});
		});
		if( checkboxes ) {
			el.qubit(options);
		}
		this.expand = options.expand || this.expand;
		this.collapse = options.collapse || this.collapse;
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
		insertCheckbox: function( listItem ) {
			var id = this.generateId(listItem),
				children = listItem.children(),
				// get the first text node for the label
				text = listItem.contents().filter(function() {
						return this.nodeType == 3;
					}).first(),
				checkbox = $('<input type="checkbox" name="' 
					+ this.getCheckboxName(listItem)
					+ '" id="' + id  + '" /> '
				),
				self = this;
			checkbox.val(listItem.data('value'));
			checkbox.prop('checked', listItem.data('checked'))
			children.remove();
			listItem.append(checkbox)
				.append($('<label for="' + id + '">')
					.append(text ? text : children.first())
				)
				.append(text ? children : children.slice(1));
			if( this.options.handleDuplicateCheckboxes ) {
				checkbox.bind('change', function(e) {
					if( !e.duplicatesHandled ) {
						if( this.value ) {
							$('input[value=' + this.value + ']', self.options.root).prop({
									checked: $(this).prop('checked'),
									indeterminate: $(this).prop('indeterminate')
								})
								.filter(function() {
									return this != e.target;
								})
								.trigger({
									type: 'change',
									duplicatesHandled: true
								});
						}
					}
					return true;					
				});
			}
		},
		idPrefix: 'checkbox-',
		generateId: function( listItem ) {
			do {
				var id = this.idPrefix + Bonsai.uniqueId++;
			}
			while( $('#' + id).length > 0 );
			return id;
		},
		getCheckboxName: function( listItem ) {
			return listItem.data('name')
				|| listItem.parents().filter('[data-name]').data('name');
		} 
	};
	$.extend(Bonsai, {
		uniqueId: 0
	});
}(jQuery));