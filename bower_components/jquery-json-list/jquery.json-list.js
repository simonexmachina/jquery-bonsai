(function($) {
	$.fn.jsonList = function( options ) {
		return this.each(function() {
			new JSONList().init(this, options);
		});
	};
	var JSONList = function() {};
	JSONList.prototype = {
		init: function( el, options ) {
			this.el = $(el);
			// fill options with default values
			this.options = options = $.extend({
				type: 'groupedItems',
				url: null,
				data: null,
				groupLabel: 'name',
				itemLabel: 'name',
				onSuccess: function( jsonList ) {},
				onListItem: function( listItem, data, isGroup ) {},
				onResponse: function( data, textStatus ) {}
			}, options);
			var self = this;
			$(this)
				.bind('success', this.options.onSuccess)
				.bind('listItem', this.options.onListItem)
				.bind('response', this.options.onResponse);
			$.getJSON(options.url, options.data, function(data, textStatus) {
				self.handleResponse(data, textStatus);
			});
		},
		handleResponse: function( data, textStatus ) {
			$(this).trigger('response', [data, textStatus]);
			if( this.options.type == 'groupedItems' ) {
				this.createListForGroupedItems(data, textStatus);
			}
			$(this).trigger('success', [this.el]);
		},
		createListForGroupedItems: function( data, textStatus ) {
			var opts = $.extend({
					groups: 'groups',
					items: 'items'
				}, this.options),
				groups = {},
				items = {};
			this.groups = groups;
			this.items = items;
			$.each(data[opts.items], function(i, item) {
				items[item.id] = item;
			});
			$.each(data[opts.groups], function(i, group) {
				var children = [];
				if( group.children ) {
					$.each(group.children, function(i, childId) {
						children.push(items[childId]);
					});
				}
				group.children = children;
				groups[group.id] = group;
			});
			$.each(groups, function(id, group) {
				var subGroups = [];
				if( group.subGroups ) {
					$.each(group.subGroups, function(i, childId) {
						subGroups.push(groups[childId]);
						delete groups[childId];
					});
				}
				group.subGroups = subGroups;
			});
			this.createList(groups);
		},
		createList: function( groups ) {
			if( this.el.is('ol, ul') )
				this.appendGroupItems(groups, this.el);
			else
				this.el.append(this.appendGroupItems(groups, $('<ol>')));
		},
		appendGroupItems: function( groups, list ) {
			var self = this;
			$.each(groups, function(id, group) {
				var listItem = $('<li>' + self.getGroupLabel(group) + '</li>');
				$(self).trigger('listItem', [listItem, group, true]);
				if( group.subGroups || group.children ) {
					var subList = $('<ol>');
					if( group.subGroups ) {
						self.appendGroupItems(group.subGroups, subList);
					}
					if( group.children ) {
						self.appendItems(group.children, subList);
					}
					listItem.append(subList);
				}
				list.append(listItem);
			});
			return list;
		},
		appendItems: function( items, list ) {
			var self = this;
			$.each(items, function(id, item) {
				var listItem = $('<li>' + self.getItemLabel(item) + '</li>');
				$(self).trigger('listItem', [listItem, item, false]);
				list.append(listItem);
			});
		},
		getGroupLabel: function( group ) {
			return group[this.options.groupLabel];
		},
		getItemLabel: function( item ) {
			return item[this.options.itemLabel];
		}
	};
}(jQuery));