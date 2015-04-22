/****************************************************************
 * 		 Main
 * 		 @by wooleners
 *****************************************************************/

domready(function() {
	(function() {

		function sheep() {

			function letter() {
				var letters = [{
					text: "喜欢看你挠痒的样子,看一千遍也不厌倦~~"
				}, {
					text: "据说用嘴巴挠,获得的流量更高?试试!"
				}, {
					text: "做人呢,最重要是开心,再挠一次吧?"
				}, {
					text: "听说不能自己挠痒的羊,上辈子都是折翼的天使~~"
				}];
				return {
					random: function(amount) {
						return letters.sort(function() {
							return .5 - Math.random();
						}).splice(0, amount);
					}
				}
			}

			function scene() {
				function builder() {
					var config, scenes = [{
						cls: "sheep_game_meng",
						chd: "sheep_attach_meng"
					}, {
						cls: "sheep_game_hua",
						chd: "sheep_attach_hua"
					}, {
						cls: "sheep_game_li",
						chd: "sheep_attach_li"
					}];
					return {
						start: function(cfg) {
							var self = this;
							config = !!cfg ? cfg : {};
							$("#sheep_select").toggleClass("show");
							page().go(1);
							self.run();
							gesture(self);
						},
						toggle: function(index) {
							index == 0 ? (function() {
								$(".dialog").text(config.letters[index].text)
									.toggleClass("show");
							}()) : (function() {
								$(".dialog").text(config.letters[index].text)
									.toggleClass("show");
								setTimeout(function() {
									$(".dialog").toggleClass("show");
								}, 100)
							}());
						},
						run: function() {
							$("#" + config.id)
								.addClass(scenes[config.selected].cls)
								.find(".sheep_attach_warp")
								.addClass(scenes[config.selected].chd);
						}
					}
				}

				function gesture(sc) {


					var reqAnimationFrame = (function() {
						return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function(callback) {
							window.setTimeout(callback, 1000 / 60);
						};
					})();

					var scratchNum = 0;

					var screen = document.querySelector(".sheep_attach_warp");
					var el = document.querySelector("#sheep_attach");

					var START_X = Math.round((screen.offsetWidth - el.offsetWidth + 30));
					var START_Y = Math.round((screen.offsetHeight - el.offsetHeight + 70));

					var ticking = false;
					var transform;
					var timer;

					var mc = new Hammer.Manager(el);

					mc.add(new Hammer.Pan({
						threshold: 0,
						pointers: 0
					}));

					mc.add(new Hammer.Swipe()).recognizeWith(mc.get('pan'));
					mc.add(new Hammer.Rotate({
						threshold: 0
					})).recognizeWith(mc.get('pan'));
					mc.add(new Hammer.Pinch({
						threshold: 0
					})).recognizeWith([mc.get('pan'), mc.get('rotate')]);

					mc.add(new Hammer.Tap({
						event: 'doubletap',
						taps: 2
					}));
					mc.add(new Hammer.Tap());

					mc.on("panstart panmove", onPan);
					mc.on("rotatestart rotatemove", onRotate);
					mc.on("pinchstart pinchmove", onPinch);
					mc.on("swipe", onSwipe);
					mc.on("tap", onTap);
					mc.on("doubletap", onDoubleTap);

					mc.on("hammer.input", function(ev) {
						if (ev.isFinal) {
							if (++scratchNum >= 3) {
								resetElement();
								sc.toggle(scratchNum - 1);
								setTimeout(function() {
									page().go(2);
								}, 1300);
								$("#normal_res").toggleClass("show");
							} else {
								resetElement();
								sc.toggle(scratchNum - 1);
							}

						}
					});

					function logEvent(ev) {
						//el.innerText = ev.type;
					}

					function resetElement() {
						el.className += ' animate';
						transform = {
							translate: {
								x: START_X,
								y: START_Y
							},
							scale: 1,
							angle: 0,
							rx: 0,
							ry: 0,
							rz: 0
						};
						requestElementUpdate();
					}

					function updateElementTransform() {
						var value = [
							'translate3d(' + transform.translate.x + 'px, ' + transform.translate.y + 'px, 0)',
							'scale(' + transform.scale + ', ' + transform.scale + ')',
							'rotate3d(' + transform.rx + ',' + transform.ry + ',' + transform.rz + ',' + transform.angle + 'deg)'
						];

						value = value.join(" ");
						el.style.webkitTransform = value;
						el.style.mozTransform = value;
						el.style.transform = value;
						ticking = false;
					}

					function requestElementUpdate() {
						if (!ticking) {
							reqAnimationFrame(updateElementTransform);
							ticking = true;
						}
					}

					function onPan(ev) {
						el.className = '';
						transform.translate = {
							x: START_X + ev.deltaX,
							y: START_Y + ev.deltaY
						};

						logEvent(ev);
						requestElementUpdate();
					}

					var initScale = 1;

					function onPinch(ev) {
						if (ev.type == 'pinchstart') {
							initScale = transform.scale || 1;
						}

						el.className = '';
						transform.scale = initScale * ev.scale;

						logEvent(ev);
						requestElementUpdate();
					}

					var initAngle = 0;

					function onRotate(ev) {
						if (ev.type == 'rotatestart') {
							initAngle = transform.angle || 0;
						}

						el.className = '';
						transform.rz = 1;
						transform.angle = initAngle + ev.rotation;

						logEvent(ev);
						requestElementUpdate();
					}

					function onSwipe(ev) {
						var angle = 50;
						transform.ry = (ev.direction & Hammer.DIRECTION_HORIZONTAL) ? 1 : 0;
						transform.rx = (ev.direction & Hammer.DIRECTION_VERTICAL) ? 1 : 0;
						transform.angle = (ev.direction & (Hammer.DIRECTION_RIGHT | Hammer.DIRECTION_UP)) ? angle : -angle;

						clearTimeout(timer);
						timer = setTimeout(function() {
							resetElement();
						}, 300);

						logEvent(ev);
						requestElementUpdate();
					}

					function onTap(ev) {
						transform.rx = 1;
						transform.angle = 25;

						clearTimeout(timer);
						timer = setTimeout(function() {
							resetElement();
						}, 200);

						logEvent(ev);
						requestElementUpdate();
					}

					function onDoubleTap(ev) {
						transform.rx = 1;
						transform.angle = 80;

						clearTimeout(timer);
						timer = setTimeout(function() {
							resetElement();
						}, 500);

						logEvent(ev);
						requestElementUpdate();
					}

					resetElement();



				}
				return {
					init: function(index) {
						builder().start({
							id: "sheep_game",
							letters: (function() {
								return letter().random(3);
							}()),
							selected: index
						});
					}
				}
			}
			return {
				init: function() {
					var self = this;
					$("#sheeps > div").forEach(function(sheep, index) {
						$(sheep).off().on("click", function() {
							scene().init(index);
						});
					});
				},
				scratch: function() {

				}

			}
		}

		function page() {
			var pages = [{
				id: "page1"
			}, {
				id: "page2"
			}, {
				id: "page3"
			}, {
				id: "page4"
			}];
			return {
				load: function() {

				},
				go: function(index) {
					pages.forEach(function(page, curIndex) {
						curIndex !== index ? $("#" + page.id).removeClass("show") : $("#" + page.id).addClass("show");
					})
				}
			}
		}

		function handler() {
			var els = [{
					id: "rules",
					pop: "rules_window",
					eventType: "click",
					handler: function(pop_id) {
						$("#" + pop_id).toggleClass("show");
					}
				}, {
					id: "start",
					pop: "sheep_select",
					eventType: "click",
					handler: function(pop_id) {
						sheep().init();
						$("#" + pop_id).toggleClass("show");

					}
				}],
				pops = [{
					cid: "rules_window",
					cls: "pop_window",
					chd: "desc",
					eventType: "click",
					handler: function(id, chd, event) {
						$("#" + id).toggleClass("show");
					}
				}, {
					cid: "sheep_select",
					cls: "pop_window",
					chd: "pop_warpper",
					eventType: "click",
					handler: function(id, chd, event) {
						(!!event.target.id && event.target.id === id) ? $("#" + id).toggleClass("show"): false;
					}
				}, {
					cid: "normal_res",
					cls: "pop_window",
					chd: "result",
					eventType: "click",
					handler: function(id, chd, event) {
						(!!event.target.id && (event.target.id === id || event.target.id === "getFlow"))  ? $("#" + id).toggleClass("show"): false;
					}
				}];
			return {
				init: function() {
					els.forEach(function(el) {
						$("#" + el.id)[0].addEventListener(el.eventType, el.handler.bind(undefined, el.pop));
					});
					pops.forEach(function(pop) {
						$("#" + pop.cid)[0].addEventListener(pop.eventType, pop.handler.bind(undefined, pop.cid, pop.chd))
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