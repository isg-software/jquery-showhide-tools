$(function() {
	"use strict";
	//make each link of class showOrHideLink animate a transition to show or hide the nearest following element of class hideable.
	//Existing anchor hrefs will be overruled (set to #!).
	//Usage: 
	// a) Define a hyperlink like: <a href="#!" class="showOrHideLink">...</a> 
	//	   (any href other than "#!" will be replaced by "#!" dynamically and will only persist if JavaScript is disabled)
	//		Exception: If the link has a target attribute (i.e. is meant for loading content in an different frame),
	//		The href-attribut will be left untouched, such that the link both opens the target document and shows
	//		or hides a section.
	// b) Define a block to be shown or hidden like <p [or div] class="hideable [optionally more classes]" id="someID">...
	//	  This block must be the next sibling of the <a...> node or any of its parent nodes.
	//	  example:	 <div>
	//				   <a class="showOrHideLink" href="#!">...</a>
	//				   [first possible position of hideable block]
	//				 </div>
	//				 [second possible position of hideable block]
	//				 ...
	// c) (optional) associate styles to a "heading" of this block for indicating whether the block is visible or hidden:
	//	  This heading might be an image inside the anchor tag, a list item or anything else.
	//	  Naming convention: This element has to be identified by id="someID_h". 
	//	  It will be assigned the CSS class "showing" or "hidden". Other classes are preserved (not overwritten).
	//	  Example 1: <a href='#' class="showOrHideLink"><img id="myID_h" href="..."></a><div class="hideable" id="myID">...</div>
	//	  Example 2: <ul class="showOrHideGroups">
	//				   <li id="advanced_h" class="hidden"><a href="#"! class="showOrHideLink">...</a>
	//					 <div id="advanced" class="hideable" style="display:none">
	//	 
	// d) (optional) insert a hidden html form field to store the current state (visible or hidden):
	//	  Naming convention: insert a hidden field with id "someID_state". A hidden field of this ID will be
	//	  - empty after the block (someID) has been hidden
	//	  - not empty ("X") after block (someID) has been toggled visible.
	//	  Example 3 (taken from attendanceform.jsp, compare to example 2 above):
	//	  <c:choose>
	//	  <c:when test="${empty multiAttendanceForm.showAdvanced}">
	//		<c:set scope="request" var="showadvancedStyle" value="display:none"/>
	//		<c:set scope="request" var="showadvancedGroupClass" value="hidden"/>
	//	  </c:when>
	//	  <c:otherwise>
	//		<c:set scope="request" var="showadvancedStyle" value="display:block"/>
	//		<c:set scope="request" var="showadvancedGroupClass" value="showing"/>
	//	  </c:otherwise>
	//	  </c:choose>
	//	  <ul class="showOrHideGroups">
	//		<li id="advanced_h" class="${showadvancedGroupClass}">
	//		   <a href="#" class="showOrHideLink"><bean:message key="attendance.advanced.link"/></a>
	//		   <div id="advanced" class="hideable" style="${showadvancedStyle}">
	//		   <html:hidden property="showAdvanced" styleId="advanced_state"/>

	if (typeof $.fn.prependFoldingArrowIcon === "function") {
		$("ul.showOrHideGroups > li")
			.prependFoldingArrowIcon()
			.children("svg.folding-arrow-icon")
			.click(function() {
				$(this).parent().children("a.showOrHideLink").first().click();
			});
		$("ul.showOrHideGroups").addClass("folding-arrows");
	}

	$("a.showOrHideLink:not([target])").attr("href", "#!");
	$("a.showOrHideLink")
		.click( function(ev) {
			var finder = $(this);
			var block = finder.nextUntil("a.showOrHideLink", ".hideable");
			while (!block.length && finder.length) {
				finder = finder.parent();
				block = finder.nextUntil("a.showOrHideLink", ".hideable");
			}
			if (block.length) {
				block.showOrHideSection({
					onToggle: function(block, toggle) {
						if (typeof $.fn.transformFoldingArrowIcon === "function" && toggle.hasClass("folding-arrow")) {
							toggle.transformFoldingArrowIcon();
						}
					}
				});
			}
		
            //Für Links, die ihr href in einem target (Frame) öffnen, das Öffnen des href nur beim Zuklappen,
            //aber nicht beim Aufklappen unterdrücken.
            //Aber für Links ohne target-Attribut (für die oben schon href durch "#!" überschrieben wurde), nun das Springen zu diesem Anchor
            //unterbinden, so dass auf keinen Fall gescrollt wird.
			if (!$(this).is("[target]") || block.getSectionToggle().hasClass($.fn.showOrHideSection.DEFAULTS.classHidden))
				ev.preventDefault();
		});
	$(".hideable").hideSection({duration: 0});
	$(".hideOnLoad, .more").css("display", "none");
	$(".appendMore").appendMoreLinks({
		moreLinkLabel: "mehr&nbsp;&hellip;"
	}); //Links werden nur bei aktiviertem JavaScript dynamisch eingef¸gt, sobald der more-Text ausgeblendet wurde.
	
	$("button.hilfeLink").each(function() {
		var topic = $(this).data("topic");
		if (typeof topic !== "undefined") {
			var selector = "button.hilfeLink[data-topic=\"" + topic + "\"]";
			$("#" + topic).setupShowOrHideSection({
				toggle: selector,
				ariaExpandedSelector: selector,
				scroll: true
			});
		}
	}).click(function() {
		var topic = $(this).data("topic");
		if (typeof topic !== "undefined") {
			$("#" + topic).showOrHideSection();
		}
	});
	
	$(".slidingpanel.inithidden").hide();
});