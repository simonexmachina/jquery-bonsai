(function($){
    $.fn.bonsai = function(options) {
        var config = {
                selector: $(this).selector,
                expandAll: false,
                expand: expand,
                collapse: collapse
            }
            , opts = $.extend(config, options);
        return this.each(function() {
            var bonsai = function() {
                return {
                    init: function( el ) {
                        el = $(el);
                        el.addClass('bonsai');
                        // look for a nested list (if any)
                        el.children().each(function() {
                        	var item = $(this),
                        		thumb = $('<div class="thumb" />');
                            item.prepend(thumb);
                            $(this).children().filter('ol, ul')
                                // if we found one
                                .first().each(function() {
                                    // then this el has children
                                    item.addClass('has-children')
                                        // attach the sub-list to the item
                                        .data('subList', this);
                                    // and should respond to a click
                                    thumb.on('click', function() {
                                        bonsai.toggle(item);
                                    });
                                    // collapse the nested list
                                    if( !config.expandAll && !item.hasClass('expanded') ) {
                                        bonsai.collapse(item, true);
                                    }
                                    // handle any deeper nested lists
                                    $(this).bonsai(options)
                            });
                        });
                    },
                    toggle: function( el ) {
                        if( !$(el).hasClass('expanded') ) {
                            bonsai.expand(el);
                        }
                        else {
                            bonsai.collapse(el);
                        }
                    },
                    expand: opts.expand,
                    collapse: opts.collapse
                }
            }();
            bonsai.init($(this));
        });
        function expand( el ) {
            el = $(el).addClass('expanded')
                .removeClass('collapsed');
            var subList = $(el.data('subList'));
            subList.css('height', 'auto');
        };
        function collapse( el ) {
            el = $(el).addClass('collapsed')
                .removeClass('expanded');
            var subList = $(el.data('subList'));
            subList.height(0);
        };
    }
}(jQuery));