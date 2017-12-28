/*
 * Basic CSS and JavaScript Framework: Core.css v0.1.0
 * Copyright 2017 @icalapuja
 * Licensed under MIT (https://github.com/icalapuja/css/core)
 */

// compatibilidad IE8
if(typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, ''); 
    };
}

if(typeof Array.prototype.forEach !== 'function') {
    Array.prototype.forEach = function(callback){
        for(var i = 0; i<this.length;i++){
            callback(this[i]);
        }
    }
}

if(typeof Array.prototype.filter !== 'function') {
    Array.prototype.filter = function(callback){
        var filters = [];
        this.forEach(function(item){
            var filter = callback(item);
            if(filter){
                filters.push(item);
            }
        });
        return filters;
    }
}

var Core = {};

Core.util = (function($){
    var _deploy = false;

    function _clone(o){
        return JSON.parse(JSON.stringify(o));
    }

    function _isInvalid(variable){
        return (variable==undefined || variable==null);
    }

    function _isValid(variable){
        return !_isInvalid(variable);
    }

    function _isEmpty(variable){
        if(_isValid(variable)){
            var tipo = typeof variable;
            if(tipo == "object"){
                tipo = typeof variable.length;

                if(tipo == "undefined"){
                    // is JSON
                    if(JSON.stringify(variable) == '{}'){
                        return true;
                    }
                }else{
                    // is Array
                    if(tipo == "number"){
                        if(variable.length == 0){
                            return true;
                        }
                    }
                }
            }else{
                if(tipo == "string"){
                    if(variable == ''){
                        return true;
                    }
                }
            }
        }else{
            return true;
        }

        return false;
    }

    function _isFunction(variable){
        if(_isValid(variable)){
            if(typeof variable == "function"){
                return true;
            }
        }

        return false;
    }

    function _loadScript(url,callback){
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onreadystatechange = callback;
        script.onload = callback;
        head.appendChild(script);
    }

    function _loadTemplate(url,callback){
		$.get(url,{},function(template){
			callback(template);
		});
	}

    function _isDeploy(){
        return _deploy;
    }

    function _console(mensaje){
        if(!_isDeploy()){
            console.log(mensaje);
        }
    }

    function _isIE(){
        return (navigator.userAgent.indexOf('MSIE') != -1);
    }

    function _isChrome(){
        return (navigator.userAgent.toLowerCase().indexOf('chrome') != -1);
    }

    function _isFirefox(){
        return (navigator.userAgent.toLowerCase().indexOf('firefox') != -1);
    }

    function _isEdge(){
        return (!_isIE() && !_isFirefox() && !_isChrome());
    }

    function _replace(stringSource,charStart,charEnd,arrayReplace){
		var pos = 0;
		var newString = stringSource.substr(0);

		if(arrayReplace.length > 0){
			arrayReplace.forEach(function(item){
				var stringReplace = charStart + pos + charEnd;
				newString = newString.replace(stringReplace,item);
				pos++;
			});
		}

		return newString;
    }

    function _replaceFormat(stringSource,arrayReplace){
        var charStart = "{";
		var charEnd = "}";
		var pos = 0;
		var newString = _replace(stringSource,charStart,charEnd,arrayReplace);
		return newString;
    }

    return{
        isDeploy: function(){
            return _isDeploy();
        },
        console: function(mensaje){
            _console(mensaje);
        },
        clone: function(o){
            return _clone(o);
        },
        isInvalid: function(variable){
            return _isInvalid(variable);
        },
        isValid: function(variable){
            return _isValid(variable);
        },
        isEmpty: function(variable){
            return _isEmpty(variable);
        },
        isFunction: function(variable){
            return _isFunction(variable);
        },
        loadScript: function(url,callback){
            _loadScript(url,callback);
        },
        loadTemplate: function(url,callback){
            _loadTemplate(url,callback);
        },
        isIE: function(){
            return _isIE();
        },
        isChrome: function(){
            return _isChrome();
        },
        isFirefox: function(){
            return _isFirefox();
        },
        isEdge: function(){
            return _isEdge();
        },
        replace: function(stringSource,charStart,charEnd,arrayReplace){
            return _replace(stringSource,charStart,charEnd,arrayReplace);
        },
        replaceFormat: function(stringSource,arrayReplace){
            return _replaceFormat(stringSource,arrayReplace);
        }
    }
})(jQuery);

Core.storage = (function(){
    function _setItem(item,json){
        var string = JSON.stringify(json);
        sessionStorage.setItem(item,string);
    }

    function _getItem(item){
        var string = sessionStorage.getItem(item);
        return JSON.parse(string);
    }

    function _clear(){
        sessionStorage.clear();
    }

    function _removeItem(item){
        sessionStorage.removeItem(item);
    }

    return{
        setItem: function(item,json){
            return _setItem(item,json);
        },
        getItem: function(item){
            return _getItem(item);
        },
        removeItem: function(item){
            return _removeItem(item);
        },
        clear: function(){
            return _clear();
        }
    }
})();


Core.route = (function(){
    var _gets = [];
    _get = function(uri,callback){
        var hash = location.hash;
        hash = hash.replace('#','');
        hash = hash.trim();

        if(hash == ''){
            hash = '/';
        }

        if(hash == uri){
            callback();
        }
        
        _gets.push({'uri':uri,'callback':callback});
    }

    _start = function(){
        window.addEventListener("hashchange", function(e){
            for(i in _gets){
                _get(_gets[i].uri,_gets[i].callback);
            }
        }, false);
    }

    return{
        get: function(uri,callback){
            _get(uri,callback);
        },
        start: function(){
            _start();
        }
    }
})();


Core.date = (function(){
    var _defaultFormat = "yyyy-mm-dd";
    function _now(){
        var date = new Date();
        var hours = date.getHours();
        var minuts = date.getMinutes();
        var seconds = date.getSeconds();
        hours = (hours<10 ? '0' + hours : hours);
        minuts = (minuts<10 ? '0' + minuts : minuts);
        seconds = (seconds<10 ? '0' + seconds : seconds);

        var sDate = _format(date,_defaultFormat);
        var sHour = hours+":"+minuts+":"+seconds;
        
        return sDate + " " + sHour;
    }

    function _format(date,format){
        var separator = (format.indexOf("/")>0 ? '/' : '-');
        var posYear = format.indexOf("yyyy");
        var posMonth = format.indexOf("mm");
        var posDay = format.indexOf("dd");
        var sDate = "";
        var year = date.getFullYear();
        var month = date.getMonth()+1;
        var day = date.getDate();
        month = (month<10 ? '0' + month : month);
        day = (day<10 ? '0' + day : day);

        if(posYear < posMonth && posYear < posDay){
            if(posMonth<posDay){
                // yyyy/mm/dd
                sDate = year+separator+month+separator+day;
            }else{
                // yyyy/dd/mm
                sDate = year+separator+day+separator+month;
            }
        }else{
            if(posYear>posMonth && posYear>posDay){
                if(posMonth<posDay){
                    // mm/dd/yyyy
                    sDate = month+separator+day+separator+year;
                }else{
                    // dd/mm/yyyy
                    sDate = day+separator+month+separator+year;
                }
            }else{
                if(posYear<posMonth){
                    // dd/yyyy/mm
                    sDate = day+separator+year+separator+month;
                }else{
                    // mm/yyyy/dd
                    sDate = month+separator+year+separator+day;
                }
            }
        }

        return sDate;
    }

    function _getDate(sDate){
        sDate = sDate.replace('-','/');
        sDate = sDate.replace('-','/');
        return new Date(sDate);
    }

    function _getDateFromFormat(sDate,format){
        var separator = "/";
        var posYear = format.indexOf("yyyy");
        var posMonth = format.indexOf("mm");
        var posDay = format.indexOf("dd");
        var year = "";
        var month = "";
        var day = "";

        if(posYear < posMonth && posYear < posDay){
            if(posMonth<posDay){
                // yyyy/mm/dd
                year = sDate.substr(0,4);
                month = sDate.substr(5,2);
                day = sDate.substr(8,2);
            }else{
                // yyyy/dd/mm
                year = sDate.substr(0,4);
                day = sDate.substr(5,2);
                month = sDate.substr(8,2);
            }
        }else{
            if(posYear>posMonth && posYear>posDay){
                if(posMonth<posDay){
                    // mm/dd/yyyy
                    month = sDate.substr(0,2);
                    day = sDate.substr(3,2);
                    year = sDate.substr(6,4);
                }else{
                    // dd/mm/yyyy
                    day = sDate.substr(0,2);
                    month = sDate.substr(3,2);
                    year = sDate.substr(6,4);
                }
            }else{
                if(posYear<posMonth){
                    // dd/yyyy/mm
                    day = sDate.substr(0,2);
                    year = sDate.substr(3,4);
                    month = sDate.substr(8,2);
                }else{
                    // mm/yyyy/dd
                    month = sDate.substr(0,2);
                    year = sDate.substr(3,4);
                    day = sDate.substr(8,2);
                }
            }
        }

        sDate = year+separator+month+separator+day;
        return _getDate(sDate);
    }

    function _getDateString(date){
        return _format(date,_defaultFormat);
    }


    function _addDays(sDate,days){
        var separator = (sDate.indexOf("/")>0 ? '/' : '-');
        var date = _getDate(sDate);
        date.setDate(date.getDate() + days);
        sDate = _format(date,_defaultFormat);
        sDate = sDate.replace('-',separator); // Firefox sólo reemplaza una vez
        sDate = sDate.replace('-',separator); // Firefox sólo reemplaza una vez
        return sDate;
    }

    function _addMonths(sDate,months){
        var separator = (sDate.indexOf("/")>0 ? '/' : '-');
        var date = _getDate(sDate);
        date.setMonth(date.getMonth() + months);
        sDate = _format(date,_defaultFormat);
        sDate = sDate.replace('-',separator); // Firefox sólo reemplaza una vez
        sDate = sDate.replace('-',separator); // Firefox sólo reemplaza una vez
        return sDate;
    }

    function _firstDay(sDate){
    	var separator = (sDate.indexOf("/")>0 ? '/' : '-');
        var sFirstDay = _getDateString(_getDate(sDate)).substr(0,8) + "01";
        sFirstDay = sFirstDay.replace('-',separator);
        sFirstDay = sFirstDay.replace('-',separator);
    	return sFirstDay;
    }

    function _lastDay(sDate){
    	var sLastDay = _addMonths(sDate,1);
    	var sFirstDay = _firstDay(sLastDay);
    	sLastDay = _addDays(sFirstDay,-1);
    	return sLastDay;
    }

    function _diffDay(sDate1,sDate2){
        var date1 = _getDate(sDate1);
        var date2 = _getDate(sDate2);
        var milliseconds = (date2 - date1);
        return Math.abs(parseInt((milliseconds / (1000*60*60*24))));
    }

    function _diffMonth(sDate1,sDate2){
        var date1 = _getDate(sDate1);
        var date2 = _getDate(sDate2);
        var nMeses = Math.abs((date2.getMonth() - date1.getMonth()) + (12 * (date2.getFullYear() - date1.getFullYear())));
        return nMeses;
    }

    function _diffMonthIncomplete(sDate1,sDate2){
        var date1 = _getDate(sDate1);
        var date2 = _getDate(sDate2);
        var months = Math.abs((date2.getMonth() - date1.getMonth()) + (12 * (date2.getFullYear() - date1.getFullYear())));

        if(date2.getDate() > date1.getDate()){
            months++;
        }

        return months;
    }

    function _isDateNet(value){
        if(typeof(value) == "string"){
            return (value.indexOf('/Date(') != -1);
        }
        return false;
    }

    function _fromDotNet(strMilliseconds){
        strMilliseconds = strMilliseconds.replace('/Date(','');
        strMilliseconds = strMilliseconds.replace(')/','');
        strMilliseconds = parseInt(strMilliseconds);
        return _format(new Date(strMilliseconds),_defaultFormat);
    }

    return{
        now: function(){
            return _now();
        },
        today: function(){
            return _now().substr(0,10);
        },
        hour: function(){
            return _now().substr(11);
        },
        format: function(date,format){
            return _format(date,format);
        },
        getDate: function(sDate){
            // yyyy-mm-dd
            return _getDate(sDate);
        },
        getDateFromFormat: function(sDate,format){
            return _getDateFromFormat(sDate,format);
        },
        getDateString: function(date){
            return _getDateString(date);
        },
        addDays: function(sDate,days){
            // yyyy-mm-dd / number
            return _addDays(sDate,days);
        },
        addMonths: function(sDate,months){
            // yyyy-mm-dd / number
            return _addMonths(sDate,months);
        },
        firstDay: function(sDate){
            // yyyy-mm-dd / yyyy/mm/dd
        	return _firstDay(sDate);
        },
        lastDay: function(sDate){
            // yyyy-mm-dd / yyyy/mm/dd
        	return _lastDay(sDate);
        },
        diffDay: function(sDate1,sDate2){
            // yyyy-mm-dd / yyyy/mm/dd
            return _diffDay(sDate1,sDate2);
        },
        diffMonth: function(sDate1,sDate2){
            return _diffMonth(sDate1,sDate2);
        },
        diffMonthIncomplete: function(sDate1,sDate2){
            return _diffMonthIncomplete(sDate1,sDate2);
        },
        isDateNet: function(value){
            return _isDateNet(value);
        },
        fromDotNet: function(strMilliseconds){
            return _fromDotNet(strMilliseconds);
        }
    }
})();


Core.ajax = (function($){
    $.support.cors = true;
    
    function _ws(url,request,callback){
        var resp;
		$.ajax({
				crossDomain: true,
		        'url': url,
		        'type': "POST",
		        'data': JSON.stringify({ 'dataRequest': JSON.stringify(request)}),
		        'contentType': "application/json;charset=utf-8",
		        'dataType': 'json',
		        success: function (response) {
		        	Core.util.console("*********************");
		        	Core.util.console("Ajax Success");
		        	Core.util.console(response);
                    Core.util.console("*********************");
                    resp = {'status':{'nerror':0,'serror':'Ajax operation success'},'data':JSON.parse(response.d)};
		            callback(resp);
		        },
		        error: function (response) {
		        	Core.util.console("*********************");
		        	Core.util.console("Ajax Error");
		        	Core.util.console(response);
		        	Core.util.console("*********************");
		            resp = {'status':{'nerror':-1,'serror':'Ajax operation failed'},'data':[]};
		            callback(resp);
		        }
		});
    }

    return{
        ws: function(url,request,callback){
            _ws(url,request,callback);
        }
    }
})(jQuery);


(function($){
    // modal
    function _showModal(modal){
        $(modal).fadeIn();
        $(modal).trigger('show');
    }

    function _hideModal(modal){
        $(modal).fadeOut();
        $(modal).trigger('hide');
    }

    $.fn.extend({
		modal: function(params){
			if(params == "show"){
                _showModal(this);
            }

            if(params == "hide"){
                _hideModal(this);
            }
        }
    });
    
    $(".modal [data-dismiss='modal']").on("click",function(e){
        var close = e.currentTarget;
        var modal = $(close).parents(".modal")[0];
        _hideModal(modal);
    });

    $("[data-toggle]").on("click",function(e){
        toogleModal($(e.currentTarget.dataset.toggle)[0]);
    });

    toogleModal = function(modal){
        if(modal.style.display == "block"){
            _hideModal(modal);
        }else{
            _showModal(modal);
        }
    }
})(jQuery);


Core.modal = (function($){
    var _circles = [];

    function _pixelToNumber(pixels){
        var px = pixels.indexOf('px');
        var number = 0;

        if(px != -1){
            number = parseInt(pixels.substr(0,px));
        }

        return number;
    }

    function _create(params){
        var defaultClose = true;

        if(Core.util.isValid(params)){
            if(Core.util.isValid(params.defaultClose)){
                defaultClose = params.defaultClose;
            }
        }

        var modal = $(document.createElement('div'));
        modal.addClass('modal');
        modal.css('display','none');
        
        if(defaultClose){
            modal.append("<span class='close'>x</span>");
            
            $(document).keyup(function(event){
                if(event.which==27)
                {
                    modal.close();
                }
            });
        }

        $('body').append(modal);

        $(modal).find('.close').on('click',function(){
            modal.close();
        });

        modal.show = function(){
            modal.fadeIn();
        }

        modal.close = function(){
            modal.fadeOut();
            setTimeout(function(){
                modal.remove();
            },500);
        }

        return modal;
    }

    function _dialog(params,callback){
        var typeDialog = "modal-dialog";
        var title = "Application";
        var defaultClose = true;

        if(Core.util.isValid(params)){
            if(Core.util.isValid(params.type)){
                typeDialog = params.type;
            }

            if(Core.util.isValid(params.defaultClose)){
                defaultClose = params.defaultClose;
            }

            if(Core.util.isValid(params.title)){
                title = params.title;
            }
        }

        var modal  = _create({'defaultClose': defaultClose});
        var dialog = $(document.createElement("div"));
        var panel = $(document.createElement("div"));
        var header = $(document.createElement("div"));
        var body = $(document.createElement("div"));
        var footer = $(document.createElement("div"));

        dialog.addClass(typeDialog);
        panel.addClass("panel bg-light");
        header.addClass("panel-header bg-primary");
        body.addClass("panel-body");
        footer.addClass("panel-footer text-right");

        panel.append(header);
        panel.append(body);
        panel.append(footer);
        dialog.append(panel);
        modal.append(dialog);

        header.append("<p>"+title+"</p>");
        footer.append("<button class='btn btn-sm btn-primary btn-ok'>Ok</button>");
        footer.append(" ");
        footer.append("<button class='btn btn-sm btn-danger btn-cancel'>Cancel</button>");

        footer.find('.btn-ok').on('click',function(){
            if(Core.util.isFunction(callback)){
                callback(true);
            }
            
            modal.close();
        });

        footer.find('.btn-cancel').on('click',function(){
            if(Core.util.isFunction(callback)){
                callback(false);
            }
            modal.close();
        });

        modal.show();
        return modal;
    }

    function _getCircle(size){
        var circleOn = false;
        var circle = $(document.createElement("div"));
        circle.addClass('modal-wait-circle');
        circle.css('display','inline-block');
        circle.css('width',size + 'px');
        circle.css('height',size + 'px');
        circle.css('background','white');
        circle.css('border-radius','50%');
        circle.css('box-sizing','border-box');
        circle.css('margin','0px');
        circle.css('padding','0px');
        circle.css('position','absolute');
        circle.css('border','none');
        circle.css('display','none');

        circle.interval = setInterval(function(){
            if(circleOn){
                circle.fadeOut();
                circleOn = false;
            }else{
                circle.fadeIn();
                circleOn = true;
            }
        },500);

        _circles.push(circle);
        return circle;
    }

    function _wait(){
        var sizeContainer = 100;
        var sizeCircle = 15;
        var halfContainer = sizeContainer / 2;
        var halfCircle = sizeCircle / 2;

        var modal  = _create({'defaultClose': false});
        modal.addClass('modal-wait');
        var container = $(document.createElement("div"));
        
        container.css('display','block');
        container.css('width',sizeContainer + 'px');
        container.css('height',sizeContainer + 'px');
        container.css('margin','auto');
        container.css('margin-top','100px');
        container.css('position','relative');
        modal.append(container);

        setTimeout(function(){
            var circle1 = _getCircle(sizeCircle);
            circle1.css('top', (0 - halfCircle)+"px");
            circle1.css('left',(halfContainer - halfCircle)+"px");
            container.append(circle1);
        },100);

        setTimeout(function(){
            var circle2 = _getCircle(sizeCircle);
            circle2.css('top',((halfContainer / 4)-(halfCircle/2))+'px');
            circle2.css('left',((sizeContainer-halfCircle)-(halfContainer/4))+'px');
            container.append(circle2);
        },200);

        setTimeout(function(){
            var circle3 = _getCircle(sizeCircle);
            circle3.css('top',(halfContainer-halfCircle)+'px');
            circle3.css('left',(sizeContainer-halfCircle)+'px');
            container.append(circle3);
        },300);

        setTimeout(function(){
            var circle4 = _getCircle(sizeCircle);
            circle4.css('top',(sizeContainer - (sizeContainer / 4))+'px');
            circle4.css('left',((sizeContainer-halfCircle)-(halfContainer/4))+'px');
            container.append(circle4);
        },400);

        setTimeout(function(){
            var circle5 = _getCircle(sizeCircle);
            circle5.css('top', (sizeContainer - halfCircle)+"px");
            circle5.css('left',(halfContainer - halfCircle)+"px");
            container.append(circle5);
        },500);

        setTimeout(function(){
            var circle6 = _getCircle(sizeCircle);
            circle6.css('top',(sizeContainer - (sizeContainer / 4))+'px');
            circle6.css('left',((halfContainer / 4)-(halfCircle))+'px');
            container.append(circle6);
        },600);

        setTimeout(function(){
            var circle7 = _getCircle(sizeCircle);
            circle7.css('top',(halfContainer-halfCircle)+'px');
            circle7.css('left',(0 - halfCircle)+'px');
            container.append(circle7);
        },700);

        setTimeout(function(){
            var circle8 = _getCircle(sizeCircle);
            circle8.css('top',((halfContainer / 4)-(halfCircle/2))+'px');
            circle8.css('left',((halfContainer / 4)-(halfCircle))+'px');
            container.append(circle8);
        },800);

        modal.show();
    }

    function _waitOff(){
        _circles.forEach(function(item){
            clearInterval(item.interval);
        });

        _circles = [];
        $('.modal-wait').remove();
    }

    return{
        create: function(params){
            return _create(params);
        },
        dialog: function(params,callback){
            return _dialog(params,callback);
        },
        wait: function(){
            return _wait();
        },
        waitOff: function(){
            return _waitOff();
        }
    }
})(jQuery);


Core.message = (function($){
    function _alert(title,message,callback){
        if(Core.util.isInvalid(message)){
            message = "";
        }

        var modal = Core.modal.dialog({'type':'modal-dialog-sm','defaultClose': false,'title': title},callback);
        var body = modal.find('.panel-body');
        body.css("padding-bottom","30px");
        body.append("<p>"+message+"</p>");
        var footer = modal.find('.panel-footer');
        footer.find('.btn-cancel').remove();
    }

    function _confirm(title,message,callback){
        if(Core.util.isInvalid(message)){
            message = "";
        }

        var modal = Core.modal.dialog({'type':'modal-dialog-sm','defaultClose': false,'title': title},callback);
        var body = modal.find('.panel-body');
        body.css("padding-bottom","30px");
        body.append("<p>"+message+"</p>");
    }

    function _toast(message,milliseconds){
        var messageBar = $('body').find('.message-bar-top');
        if(messageBar.length == 0){
            messageBar = $(document.createElement("div"));
            messageBar.addClass("message-bar-top");
            $('body').append(messageBar);
        }

        var toast = $(document.createElement("div"));
        toast.addClass("alert-dark");
        toast.css('display','none');
        toast.text(message);
        messageBar.append(toast);
        toast.fadeIn();

        if(Core.util.isInvalid(milliseconds)){
            milliseconds = 5000;
        }

        setTimeout(function(){
            toast.fadeOut();
            setTimeout(function(){
                toast.remove();
            },500);
        },milliseconds);
    }

    function _snackbar(message,milliseconds){
        var snackbar = $(document.createElement("div"));
        snackbar.addClass('snackbar-dark');
        snackbar.css('display','none');
        snackbar.text(message);
        $('body').append(snackbar);
        snackbar.fadeIn();

        if(Core.util.isInvalid(milliseconds)){
            milliseconds = 5000;
        }

        setTimeout(function(){
            snackbar.fadeOut();
            setTimeout(function(){
                snackbar.remove();
            },500);
        },milliseconds);
    }

    return{
        alert: function(title,message,callback){
            return _alert(title,message,callback);
        },
        confirm: function(title,message,callback){
            return _confirm(title,message,callback);
        },
        toast: function(message,milliseconds){
            return _toast(message,milliseconds);
        },
        snackbar: function(message,milliseconds){
            return _snackbar(message,milliseconds);
        }
    }
})(jQuery);
