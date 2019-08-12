"use strict";
(function($){
		
	
	/* Ib) More-Links und More-Blocks 
	 * 
	 * Usage: Ein Block (z.B. Absatz) wird mit der Klasse .appendMore ausgestattet. 
	 * (Der Mehr...-Link wird an den Inhalt des .appendMore-Blocks angefügt. Absätze können selbst von der Klasse appendMore sein, soll aber z.B. auf eine
	 * Liste (ul) ein Mehr...-Link folgen, darf nicht die Liste selbst von der Klasse appendMore sein, sondern ist in einen Div-Block der Klasse appendMore einzufassen,
	 * damit der Link sp‰ter *hinter* dem UL-Element eingef¸gt wird.)
	 * Entweder folgt innerhalb dieses Blocks ein Kindelement der Klasse .more, oder als direkter Nachbar (Nachfolger) des .appendMore.Blocks
	 * oder eines seiner Vorfahren. 
	 * Geschachtelte Blöcke: Es ist erlaubt, dass ein appendMore-Block selbst innere appendMore-/More-Blöcke enthält. In dem Fall darf sein "eigener" more-Block
	 * nicht ebenfalls ein Kindelement sein, sondern muss ein Nachfolger sein wie oben beschrieben.
	 * Ist JavaScript aktiviert, wird an den Inhalt jedes appendMore-Blocks automatisch ein "Mehr..."-Link angefügt und die more-Blocks ausgeblendet.
	 * Der Link blendet diese dann wieder ein. Nur für echte Block-Elemente der Klasse .more (Div, Absatz etc.) wird eine slideDown-Animation
	 * angewendet. Ist der .more-Teil z.B. ein Span innerhalb eines Absatzes der Klasse .appendMore, so wird zwar das Einblenden des more-Blocks
	 * funktionieren, jedoch ohne Animation (da die auf Inline-Elemente nicht anwendbar ist).
	 * 
	 **/
	$.fn.appendMoreLinks = function(options) {
		const opts = $.extend({}, $.fn.appendMoreLinks.DEFAULTS, options);
		this.append(" <a href='#!' class='" + opts.moreLinkClass + "'>" + opts.moreLinkLabel + "</a>");
		//Soeben eingefügte Links nun mit Leben ausstatten:
		$("a." + opts.moreLinkClass).click(function() {
			$(this).hide();
			//Suche den .more-Block zum Link.
			var finder = $(this).parent(); //Ausgangspunkt ist der Vorfahr des .more-Links (Block der Klasse .appendMore)
			var found = finder.next(opts.moreContentSelector);
			while (!found.length && finder.length) { //Pr¸fe ansonsten noch die Nachfolger der Vorfahren
				finder = finder.parent();
				found = finder.next(opts.moreContentSelector);
			}
			found.slideDown("fast");

			return false; //Springen zum Anchor '#' vermeiden
		});
		return this;
	};
	
	$.fn.appendMoreLinks.DEFAULTS = {
		moreLinkClass: "moreLink",
		moreLinkLabel: "more&nbsp;&hellip;",
		moreContentSelector: ".more"
	};

}(jQuery));