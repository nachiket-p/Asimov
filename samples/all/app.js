(function(){
	window.randStr = function(len){
		return (function(){g=function(){c='0123 4567 89ab cde fghi jklmn opqrstuvwxy zAB CDEFG HIJKLM NOPQR STUVWXYZ';p='';for(i=0;i<len;i++){p+=c.charAt(Math.floor(Math.random()*62));}return p;};p=g();while(!/[A-Z]/.test(p)||!/[0-9]/.test(p)||!/[a-z]/.test(p)){p=g();}return p;})()
	}

	
	var MODEL = {
		'audio': {
			jsString: "new asimov.Audio($('sample'), 'http://www.tonycuffe.com/mp3/cairnomount.mp3', {});"
		},
		'video': {
			jsString: "new asimov.Video($('sample'), 'http://www.auby.no/files/video_tests/h264_720p_hp_5.1_3mbps_vorbis_styled_and_unstyled_subs_suzumiya.mkv', {posterImageUrl: 'http://placehold.it/350x150', altText:'Sample alt text', autoPlay: false});"
		},
		'text-resizer': {
			jsString: "new asimov.TextResizer($('sample'), {target: $('sample-content')});"
		},
		'gallery': {
			jsString: 'new asimov.Gallery($("sample"),{options:{"delay":4000,"autoplay":false,"transition":"fade"}},undefined,' +
				'{"size":{"height":"450","width":"250"},"images":[' + 
					'{"id":"89437","src":"http://placehold.it/350x300?v=1369317434333"}, {"id":"89436","src":"http://placehold.it/350x301?v=1369317434332"},' +
					'{"id":"89436","src":"http://placehold.it/350x302?v=1369317434332"}, {"id":"89436","src":"http://placehold.it/350x303?v=1369317434332"}],' +
					'"thumbnails":false,"clickToNext":true})'
		},
		'scrolling-sidebar': {
			jsString: "new asimov.ScrollingSidebar($('sample'), {header: 'This is header', footer: 'this is footer', content:randStr(1444), width: 200, height: 400});"
		},
		'quiz-multiple-choice': {
			jsString: 'new asimov.QuizMultipleChoice($("sample"),{"persist":false,"generateHTML":true,"questionData":' +
				'{"correctMsg":"Correct! You answered correctly. Good job.","incorrectMsg":"Sorry! This is not the correct answer.","questions":' + 
				'[{"text":"This is Q2","options":[{"text":"o2","correct":true,"order":1},{"text":"o1","correct":false,"order":2}],"order":1},{"text":"This is new Q1","options":[{"text":"o3","correct":false,"order":1},' + 
				'{"text":"O1","correct":false,"order":2},{"text":"o2","correct":true,"order":3}],"order":2}]}})'
		},
		'popup': {
			jsString: "new asimov.Popup($('sample'), '<p>Popup with close btn <br/> Lorem ipsum blah blah bla....</p>' ," +
    			"{'title':'Test title', 'size':{width: 500, height:300}, closeBtn: true});",
			content: "Click here to open Popup"
		}
	};

	document.addEvent('domready' ,function(){
		var CodeView = new Class({
			Implements: [Events],
			initialize: function(el) {
				this.el = el;
				this.el.getElement('button.preview').addEvent('click', function(){
					if(!this.widgetKey) {
						return;
					}

					this.fireEvent("previewClicked", this.widgetKey);
				}.bind(this))
			},
			setView: function(widgetKey){
				this.widgetKey = widgetKey;
				this.el.getElement('#code').set('text', MODEL[widgetKey].jsString);
			}
		});
		var PreviewView = new Class({
			initialize: function(el){
				this.el = el;
			},
			preview: function(widgetKey) {
				var widget = MODEL[widgetKey];
				this.el.empty();
				this.el.adopt(new Element('div', {id: 'sample', 'class': 'widget-space', html: widget.content}));
				this.el.adopt(new Element('div', {
					id: 'sample-content', 'class': 'content', 
					'html': "This is sampel content for widget demo. This is sampel content for widget demo. This is sampel content for widget demo. " + 
					"<br/>This is sampel content for widget demo. This is sampel content for widget demo. This is sampel content for widget demo."}));
				window.eval(widget.jsString);
			}
		})

		var WidgetList = new Class({
			Implements: [Events],
			initialize: function(el, model) {
				this.el = el;
				this.model = model;
				this.render();
			},
			render: function(){
				this.el.empty();
				var widgetListEl = new Element('ul');
				Object.keys(this.model).each(function(widgetName){
					widgetListEl.adopt(this.createEntry(widgetName));
				}.bind(this));
				this.el.adopt(widgetListEl);
				this.el.getElements('li').addEvent("click", function(e){
					this.fireEvent('widgetSelected', e.target.get('html'));
				}.bind(this))
			},
			createEntry: function(widgetName){
				var entryEl = new Element('li', {html: widgetName, 'class': 'widget-entry'});
				return entryEl;
			}
		});


		var codeView = new CodeView($("code-view"));
		var previewView = new PreviewView($("preview-view"));
		var widgetList = new WidgetList($('widget-list'), MODEL);
		widgetList.addEvent('widgetSelected', function(widgetKey) {
			codeView.setView(widgetKey);
			previewView.preview(widgetKey);
		});

		codeView.addEvent('previewClicked', function(widgetKey) {
			previewView.preview(widgetKey);
		});
	})

})()