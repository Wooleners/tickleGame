/****************************************************************
 * 		 Main
 * 		 @by wooleners
 *****************************************************************/

domready(function() {
	(function() {

		function page(){
			var pages = [
				{
					id: "page1"
				},
				{
					id: "page2"
				},
				{
					id: "page3"
				},
				{
					id: "page4"
				}
			];
			return {
				load: function(){

				},
				go: function(index){
					pages.forEach(function(page, curIndex){
						curIndex !== index ? $("#" + page.id).hide() : $("#" + page.id).show();
					})
				}
			}
		}

		function handler() {
			var els = [
				{
					id: "rules",
					pop: "rules_window",
					eventType: "click",
					handler: function(pop_id) {
						$("#" + pop_id).toggle();
					}
				}
			], pops = [
				{	
					cid: "rules_window",
					cls: "pop_window",
					chd: "desc",
					eventType: "click",
					handler: function(id, chd, event){
						(!!event.target.id && event.target.id === id) ? $("#" + id).toggle() : false;
					}
				}
			];
			return {
				init: function() {
					els.forEach(function(el) {
						$("#" + el.id)[0].addEventListener(el.eventType, el.handler.bind(undefined, el.pop));
					});
					pops.forEach(function(pop){
						$("." + pop.cls)[0].addEventListener(pop.eventType, pop.handler.bind(undefined, pop.cid, pop.chd))
					});
					$("#start")[0].addEventListener("click", function(){
						page().go(1);
					});
				}
			}
		}
		return {
			init: function() {
				handler().init();
			}
		}
	}()).init();
});