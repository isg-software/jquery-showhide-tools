"use strict";$(function(){"function"==typeof $.fn.prependFoldingArrowIcon&&($("ul.showOrHideGroups li").prependFoldingArrowIcon().children("svg.folding-arrow-icon").click(function(){$(this).parent().children("a.showOrHideLink").first().click()}),$("ul.showOrHideGroups").addClass("folding-arrows")),$("a.showOrHideLink:not([target])").attr("href","#!"),$("a.showOrHideLink").click(function(i){for(var n=$(this),e=n.nextUntil("a.showOrHideLink",".hideable");!e.length&&n.length;)e=(n=n.parent()).nextUntil("a.showOrHideLink",".hideable");e.length&&e.showOrHideSection({onToggle:function(i,n){"function"==typeof $.fn.transformFoldingArrowIcon&&n.hasClass("folding-arrow")&&n.transformFoldingArrowIcon()}}),$(this).is("[target]")&&!e.getSectionToggle().hasClass($.fn.showOrHideSection.DEFAULTS.classHidden)||i.preventDefault()}),$(".hideable").hideSection({duration:0}),$(".hideOnLoad, .more").css("display","none"),$(".appendMore").appendMoreLinks({moreLinkLabel:"mehr&nbsp;&hellip;"}),$("button.hilfeLink").each(function(){var i=$(this).data("topic");if(void 0!==i){var n='button.hilfeLink[data-topic="'+i+'"]';$("#"+i).setupShowOrHideSection({toggle:n,ariaExpandedSelector:n,scroll:!0})}}).click(function(){var i=$(this).data("topic");void 0!==i&&$("#"+i).showOrHideSection()}),$(".slidingpanel.inithidden").hide()});