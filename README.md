# jquery-showhide-tools

Bundle of jQuery Plug-ins for dynamically and animatedly showing or hiding website content with features like toggling control states or scrolling shown content into view.


## Motivation

Users of jQuery may already use the `show()` and `hide()` functions of a jQuery resultset in order to toggle the visibility of the selected elements.

These tools center around the same functionality: Selecting one or more elements by a query (`$(selector)`) and calling a similar function for showing or hiding the selected elements. The main functions of this bundle are `showSection()`, `hideSection()` and `showOrHideSection()`. In addition to the aforementioned jQuery-functions, they sport several (optional) features accompanying the showing or hiding action. 

* So you may define an always visible element for each hideable element which reflects the current visibility state. This might be, for example, an arrow icon pointing to the right while the corresponding section is hidden and pointing downwards while the section is visible.
	* Arrow icons like these, which switch state with a smooth transition, may be created with my separate jQuery plug-in [jquery-folding-arrow-icon](https://github.com/isg-software/folding-arrow).
	* The `show/hideSection()` functions may now automatically add or remove class names from the state display element's `class` attribute, so the visibility display gets automatically updated (according CSS required).
* For accessible web you should also consider using aria attributes on toggle elements (clickable by the user in order to toggle a section's visibility) which enable a screen reader to read out the current state (collapesed/hidden or expanded/visible) when the toggle is focused. This is also a feature of these plug-in functions.
* You may optionally activate an autoscroll feature to ensure that a section which gets shown (or at least its beginning) will be readable, i.e. in the viewport.
	* By the way: The functions internally used for this _viewport alignment_ are not private, but also implemented as jQuery plug-in functions, so you may also use this plug-in bundle for your own viewport alignment purposes.
* Maybe you are designing a form for a web application with some hideable sections (like an “accordeon”) and you want to transmit the visibility state of each hideable section with each form submit (as part of the form data), in order for your web application to be able to construct a response page corresponding to that state. In this case, simply add an input element (like an `<input type="hidden">`) for each hideable section and configure these plug-ins to that the input's value gets auto-updated with each `showSection()` or `hideSection()` action.

In addition to these main functions, this tool bundle contains several more jQuery plug-in functions for even more specific showing or hiding actions (building upon the main functions).

* So if you want to present text blocks with an always-visible start (perhaps the first paragraph) and an initially hidden rest, which the user can reveal by simply clicking on a link labelled something like `more…`, than there's a simple plug-in for that. You simply write your starting text and assign a special CSS class to that, as well as the remainder text, also flagged by a special class, and with some rather short JavaScript code (using the `appendMoreLinks()` plug-in) the remainder sections get hidden, `more…` links get appended to the headers and whenever a user clicks on such a `more…` link, it will be removed and the hidden remainder text will be shown instead.
* This plug-in bundle also contains a separate script file which you may include in order to build an accordion. It builds upon the main `showOrHideSection()` functions, inheriting features like accessibility, visibility state submission in a form, auto-scrolling etc. This accordion also supports multi-selection. While normally only one section of the accordion is visible, i.e. switching to another section will close the currently visible one, a user can also open sections in addition to the currently open one (i.e. without closing this one) by holding the ctrl or cmd key. A multi-touch gesture for devices without keyboard is also available: Tap on additional section toggles while holding down another finger.
* The _sliding panels_ plug-ins of this bundle enable you to create forms similar to the column layout of macOS's Finder.


See the examples included in this download for demos of all of these functions.

## Pre-Release 

This README documentation is not finished yet, but the plug-in functions should now be virtually stable, so this state gets published in the master branch of the git repo as a pre-release.

Please refer to the demo pages and the generated jsDocs for now, which you can access after downloading the repo content.

After finishing the documentation, a final V1.0 release will be published, including an `npm` entry and a website with online view of the demo pages.