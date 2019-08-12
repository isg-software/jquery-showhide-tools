"use strict";
(function($){
		
	/**
	 * Namespace for the {@link jQuery.fn.appendMoreLinks() appendMoreLinks() plug-in}.
	 * @namespace appendMoreLinks
	 * @memberOf jQuery.fn
	 */
	/**
	 * jQuery plug-in for showing only the first / top part of a section and appending a link
	 * (like "more…") enabling users to show the rest of the section if they want to read it.
	 * <p>Take this HTML code for <strong>example</strong>:</p>
	 * <pre><code class="html">
	 * &lt;p class="appendMore"&gt;Lorem Ipsum …&lt;/p&gt;
	 * &lt;div class="more"&gt;
	 *     &lt;p&gt;Some more…&lt;/p&gt;
	 *     &lt;p&gt;Even more…&lt;/p&gt;
	 * &lt;/div&gt;
	 * </code></pre>
	 * With JavaScript disabled, a user will see all thee paragraphs. With JavaScript enabled
	 * you may execute a code like the following example in order to hide all ".more" blocks
	 * on load and append a "more…" link to each ".appendMore" block, wich, when clicked, will
	 * show the following ".more" block (and hide the link).
	 * <pre><code class="javascript">
	 * $(function() {
	 *     $(".more").hide();
	 *     $(".appendMore").appendMoreLinks();
	 * });
	 * </code></pre>
	 * <ul>
	 * <li>Of course, a web page may contains more than one pair of some node of class "appendMore"
	 * followed by a node of class "more".</lo>
	 * <li>The appendMoreLinks() function will simply append the links which will show the following
	 * ".more" node. It does <em>not</em> initially hide the ".more" sections, which you should do
	 * dynamically by javascript just like in the example above. This has the advantage over static
	 * style attributes in your HTML or a static CSS rule like (<code>.more{display:none}</code>)
	 * that this way, the whole content will be visible if JavaScript should be disabled by the user,
	 * which is also importent regarding accessibility.</li>
	 * <li>Of course you may choose different class names. If the "more" blocks should use different
	 * classes than "more", don't forget to set the option <code>moreContentSelector</code> accordingly!.</li>
	 * <li>The following ".more" node does not have to be descendant of the same parent node as the "appendMore" node,
	 * it may also be a descendant of one of the ".more"-links's parents, like for example:
	 * <pre><code class="html">&lt;div&gt;
	 *     &lt;p class="appendMore"&gt;Lorem Ipsum …&lt;/p&gt;
	 * &lt;/div&gt;
	 * &lt;div class="more"&gt;…&lt;/div&gt;
	 * </li>
	 * <li>Nesting of "append-more-sections" is allowed. Example:
	 * <pre><code class="html">&lt;p class="appendMore"&gt;Lorem Ipsum …&lt;/p&gt;
	 * &lt;div class="more"&gt;
	 *     &lt;p& class="appendMore"gt;Some more…&lt;/p&gt;
	 *     &lt;p& class="more"gt;Even more…&lt;/p&gt;
	 * &lt;/div&gt;
	 * </code></pre>
	 * </li>
	 * <li>When clicking the more link, the next "more" section will be shown with a
	 * vertical slide-down transition. But this only works if the "more" section is a block
	 * element (not an inline element).</li>
	 * </ul>
	 * 
	 *
	 * @function appendMoreLinks()
	 * @memberOf jQuery.fn
	 * @param {object} [options] An objects whose properties may specify options (override default options),
	 * see {@link jQuery.fn.appendMoreLinks.DEFAULTS list of default options}, which also specifies
	 * all available/overridable options.
	 * @returns {jqr} the same jQuery resultset it was called on, allows chainable method calls.
	 */
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
	
	/**
	 * This object defines the default options for {@link jQuery.fn.appendMoreLinks()}.
	 * This is also a complete list of all supported options which may be set/overridden
	 * in the function's options argument.
	 * @property {string} moreLinkClass ="moreLink" The {@link jQuery.fn.appendMoreLinks()} function will append
	 * hyperlinks to the selected paragraphs. This option defines the content of the <code>class</code>
	 * attribute of those generated links. This has to be a single word (single class name) in order
	 * for the plug-in to work properly. The class will be used internally, and you'll probably never need
	 * to override it. But you may do so, e.g. in case you want to use the class yourself in your CSS
	 * stylesheets.
	 * @property {string} moreLinkLabel ="more&nbsp;&hellip;" This is the default link text (caption)
	 * of the inserted hyperlinks (see above).
	 * This is the option the most likely to be changed by a user, since this string isn't just used
	 * internally but is actually visible content of your website. Especially if your site's content
	 * language is not english, you will want to set this option in order to translate the link
	 * label to your target language.
	 * @property {string} moreContentSelector =".more" If the user clicks the generated "more..." link,
	 * the plug-in is meant to show the following hidden section. In order to locate this, the plug-in
	 * function needs to know a selector for searching the sections it should expand.
	 * The default value (<code>.more</code>) means, that the following section which should be
	 * show/expanded, is simply the next node with class <code>more</code>, see example HTML code
	 * in {@link jQuery.fn.appendMoreLinks() appendMoreLink's documentation}.
	 * @member DEFAULTS
	 * @memberOf jQuery.fn.appendMoreLinks
	 */
	$.fn.appendMoreLinks.DEFAULTS = {
		moreLinkClass: "moreLink",
		moreLinkLabel: "more&nbsp;&hellip;",
		moreContentSelector: ".more"
	};

}(jQuery));