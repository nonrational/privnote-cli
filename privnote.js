// privnote.js

(function () {
    var _jQuery = window.jQuery,
        _$ = window.$;
    var jQuery = window.jQuery = window.$ = function (selector, context) {
        return new jQuery.fn.init(selector, context)
    };
    var quickExpr = /^[^<]*(<(.|\s)+>)[^>]*$|^#(\w+)$/,
        isSimple = /^.[^:#\[\.]*$/,
        undefined;
    jQuery.fn = jQuery.prototype = {
        init: function (selector, context) {
            selector = selector || document;
            if (selector.nodeType) {
                this[0] = selector;
                this.length = 1;
                return this
            }
            if (typeof selector == "string") {
                var match = quickExpr.exec(selector);
                if (match && (match[1] || !context)) {
                    if (match[1]) {
                        selector = jQuery.clean([match[1]], context)
                    } else {
                        var elem = document.getElementById(match[3]);
                        if (elem) {
                            if (elem.id != match[3]) {
                                return jQuery().find(selector)
                            }
                            return jQuery(elem)
                        }
                        selector = []
                    }
                } else {
                    return jQuery(context).find(selector)
                }
            } else {
                if (jQuery.isFunction(selector)) {
                    return jQuery(document)[jQuery.fn.ready ? "ready" : "load"](selector)
                }
            }
            return this.setArray(jQuery.makeArray(selector))
        },
        jquery: "1.2.6",
        size: function () {
            return this.length
        },
        length: 0,
        get: function (num) {
            return num == undefined ? jQuery.makeArray(this) : this[num]
        },
        pushStack: function (elems) {
            var ret = jQuery(elems);
            ret.prevObject = this;
            return ret
        },
        setArray: function (elems) {
            this.length = 0;
            Array.prototype.push.apply(this, elems);
            return this
        },
        each: function (callback, args) {
            return jQuery.each(this, callback, args)
        },
        index: function (elem) {
            var ret = -1;
            return jQuery.inArray(elem && elem.jquery ? elem[0] : elem, this)
        },
        attr: function (name, value, type) {
            var options = name;
            if (name.constructor == String) {
                if (value === undefined) {
                    return this[0] && jQuery[type || "attr"](this[0], name)
                } else {
                    options = {};
                    options[name] = value
                }
            }
            return this.each(function (i) {
                for (name in options) {
                    jQuery.attr(type ? this.style : this, name, jQuery.prop(this, options[name], type, i, name))
                }
            })
        },
        css: function (key, value) {
            if ((key == "width" || key == "height") && parseFloat(value) < 0) {
                value = undefined
            }
            return this.attr(key, value, "curCSS")
        },
        text: function (text) {
            if (typeof text != "object" && text != null) {
                return this.empty().append((this[0] && this[0].ownerDocument || document).createTextNode(text))
            }
            var ret = "";
            jQuery.each(text || this, function () {
                jQuery.each(this.childNodes, function () {
                    if (this.nodeType != 8) {
                        ret += this.nodeType != 1 ? this.nodeValue : jQuery.fn.text([this])
                    }
                })
            });
            return ret
        },
        wrapAll: function (html) {
            if (this[0]) {
                jQuery(html, this[0].ownerDocument).clone().insertBefore(this[0]).map(function () {
                    var elem = this;
                    while (elem.firstChild) {
                        elem = elem.firstChild
                    }
                    return elem
                }).append(this)
            }
            return this
        },
        wrapInner: function (html) {
            return this.each(function () {
                jQuery(this).contents().wrapAll(html)
            })
        },
        wrap: function (html) {
            return this.each(function () {
                jQuery(this).wrapAll(html)
            })
        },
        append: function () {
            return this.domManip(arguments, true, false, function (elem) {
                if (this.nodeType == 1) {
                    this.appendChild(elem)
                }
            })
        },
        prepend: function () {
            return this.domManip(arguments, true, true, function (elem) {
                if (this.nodeType == 1) {
                    this.insertBefore(elem, this.firstChild)
                }
            })
        },
        before: function () {
            return this.domManip(arguments, false, false, function (elem) {
                this.parentNode.insertBefore(elem, this)
            })
        },
        after: function () {
            return this.domManip(arguments, false, true, function (elem) {
                this.parentNode.insertBefore(elem, this.nextSibling)
            })
        },
        end: function () {
            return this.prevObject || jQuery([])
        },
        find: function (selector) {
            var elems = jQuery.map(this, function (elem) {
                return jQuery.find(selector, elem)
            });
            return this.pushStack(/[^+>] [^+>]/.test(selector) || selector.indexOf("..") > -1 ? jQuery.unique(elems) : elems)
        },
        clone: function (events) {
            var ret = this.map(function () {
                if (jQuery.browser.msie && !jQuery.isXMLDoc(this)) {
                    var clone = this.cloneNode(true),
                        container = document.createElement("div");
                    container.appendChild(clone);
                    return jQuery.clean([container.innerHTML])[0]
                } else {
                    return this.cloneNode(true)
                }
            });
            var clone = ret.find("*").andSelf().each(function () {
                if (this[expando] != undefined) {
                    this[expando] = null
                }
            });
            if (events === true) {
                this.find("*").andSelf().each(function (i) {
                    if (this.nodeType == 3) {
                        return
                    }
                    var events = jQuery.data(this, "events");
                    for (var type in events) {
                        for (var handler in events[type]) {
                            jQuery.event.add(clone[i], type, events[type][handler], events[type][handler].data)
                        }
                    }
                })
            }
            return ret
        },
        filter: function (selector) {
            return this.pushStack(jQuery.isFunction(selector) && jQuery.grep(this, function (elem, i) {
                return selector.call(elem, i)
            }) || jQuery.multiFilter(selector, this))
        },
        not: function (selector) {
            if (selector.constructor == String) {
                if (isSimple.test(selector)) {
                    return this.pushStack(jQuery.multiFilter(selector, this, true))
                } else {
                    selector = jQuery.multiFilter(selector, this)
                }
            }
            var isArrayLike = selector.length && selector[selector.length - 1] !== undefined && !selector.nodeType;
            return this.filter(function () {
                return isArrayLike ? jQuery.inArray(this, selector) < 0 : this != selector
            })
        },
        add: function (selector) {
            return this.pushStack(jQuery.unique(jQuery.merge(this.get(), typeof selector == "string" ? jQuery(selector) : jQuery.makeArray(selector))))
        },
        is: function (selector) {
            return !!selector && jQuery.multiFilter(selector, this).length > 0
        },
        hasClass: function (selector) {
            return this.is("." + selector)
        },
        val: function (value) {
            if (value == undefined) {
                if (this.length) {
                    var elem = this[0];
                    if (jQuery.nodeName(elem, "select")) {
                        var index = elem.selectedIndex,
                            values = [],
                            options = elem.options,
                            one = elem.type == "select-one";
                        if (index < 0) {
                            return null
                        }
                        for (var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++) {
                            var option = options[i];
                            if (option.selected) {
                                value = jQuery.browser.msie && !option.attributes.value.specified ? option.text : option.value;
                                if (one) {
                                    return value
                                }
                                values.push(value)
                            }
                        }
                        return values
                    } else {
                        return (this[0].value || "").replace(/\r/g, "")
                    }
                }
                return undefined
            }
            if (value.constructor == Number) {
                value += ""
            }
            return this.each(function () {
                if (this.nodeType != 1) {
                    return
                }
                if (value.constructor == Array && /radio|checkbox/.test(this.type)) {
                    this.checked = (jQuery.inArray(this.value, value) >= 0 || jQuery.inArray(this.name, value) >= 0)
                } else {
                    if (jQuery.nodeName(this, "select")) {
                        var values = jQuery.makeArray(value);
                        jQuery("option", this).each(function () {
                            this.selected = (jQuery.inArray(this.value, values) >= 0 || jQuery.inArray(this.text, values) >= 0)
                        });
                        if (!values.length) {
                            this.selectedIndex = -1
                        }
                    } else {
                        this.value = value
                    }
                }
            })
        },
        html: function (value) {
            return value == undefined ? (this[0] ? this[0].innerHTML : null) : this.empty().append(value)
        },
        replaceWith: function (value) {
            return this.after(value).remove()
        },
        eq: function (i) {
            return this.slice(i, i + 1)
        },
        slice: function () {
            return this.pushStack(Array.prototype.slice.apply(this, arguments))
        },
        map: function (callback) {
            return this.pushStack(jQuery.map(this, function (elem, i) {
                return callback.call(elem, i, elem)
            }))
        },
        andSelf: function () {
            return this.add(this.prevObject)
        },
        data: function (key, value) {
            var parts = key.split(".");
            parts[1] = parts[1] ? "." + parts[1] : "";
            if (value === undefined) {
                var data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);
                if (data === undefined && this.length) {
                    data = jQuery.data(this[0], key)
                }
                return data === undefined && parts[1] ? this.data(parts[0]) : data
            } else {
                return this.trigger("setData" + parts[1] + "!", [parts[0], value]).each(function () {
                    jQuery.data(this, key, value)
                })
            }
        },
        removeData: function (key) {
            return this.each(function () {
                jQuery.removeData(this, key)
            })
        },
        domManip: function (args, table, reverse, callback) {
            var clone = this.length > 1,
                elems;
            return this.each(function () {
                if (!elems) {
                    elems = jQuery.clean(args, this.ownerDocument);
                    if (reverse) {
                        elems.reverse()
                    }
                }
                var obj = this;
                if (table && jQuery.nodeName(this, "table") && jQuery.nodeName(elems[0], "tr")) {
                    obj = this.getElementsByTagName("tbody")[0] || this.appendChild(this.ownerDocument.createElement("tbody"))
                }
                var scripts = jQuery([]);
                jQuery.each(elems, function () {
                    var elem = clone ? jQuery(this).clone(true)[0] : this;
                    if (jQuery.nodeName(elem, "script")) {
                        scripts = scripts.add(elem)
                    } else {
                        if (elem.nodeType == 1) {
                            scripts = scripts.add(jQuery("script", elem).remove())
                        }
                        callback.call(obj, elem)
                    }
                });
                scripts.each(evalScript)
            })
        }
    };
    jQuery.fn.init.prototype = jQuery.fn;

    function evalScript(i, elem) {
        if (elem.src) {
            jQuery.ajax({
                url: elem.src,
                async: false,
                dataType: "script"
            })
        } else {
            jQuery.globalEval(elem.text || elem.textContent || elem.innerHTML || "")
        } if (elem.parentNode) {
            elem.parentNode.removeChild(elem)
        }
    }

    function now() {
        return +new Date
    }
    jQuery.extend = jQuery.fn.extend = function () {
        var target = arguments[0] || {}, i = 1,
            length = arguments.length,
            deep = false,
            options;
        if (target.constructor == Boolean) {
            deep = target;
            target = arguments[1] || {};
            i = 2
        }
        if (typeof target != "object" && typeof target != "function") {
            target = {}
        }
        if (length == i) {
            target = this;
            --i
        }
        for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (var name in options) {
                    var src = target[name],
                        copy = options[name];
                    if (target === copy) {
                        continue
                    }
                    if (deep && copy && typeof copy == "object" && !copy.nodeType) {
                        target[name] = jQuery.extend(deep, src || (copy.length != null ? [] : {}), copy)
                    } else {
                        if (copy !== undefined) {
                            target[name] = copy
                        }
                    }
                }
            }
        }
        return target
    };
    var expando = "jQuery" + now(),
        uuid = 0,
        windowData = {}, exclude = /z-?index|font-?weight|opacity|zoom|line-?height/i,
        defaultView = document.defaultView || {};
    jQuery.extend({
        noConflict: function (deep) {
            window.$ = _$;
            if (deep) {
                window.jQuery = _jQuery
            }
            return jQuery
        },
        isFunction: function (fn) {
            return !!fn && typeof fn != "string" && !fn.nodeName && fn.constructor != Array && /^[\s[]?function/.test(fn + "")
        },
        isXMLDoc: function (elem) {
            return elem.documentElement && !elem.body || elem.tagName && elem.ownerDocument && !elem.ownerDocument.body
        },
        globalEval: function (data) {
            data = jQuery.trim(data);
            if (data) {
                var head = document.getElementsByTagName("head")[0] || document.documentElement,
                    script = document.createElement("script");
                script.type = "text/javascript";
                if (jQuery.browser.msie) {
                    script.text = data
                } else {
                    script.appendChild(document.createTextNode(data))
                }
                head.insertBefore(script, head.firstChild);
                head.removeChild(script)
            }
        },
        nodeName: function (elem, name) {
            return elem.nodeName && elem.nodeName.toUpperCase() == name.toUpperCase()
        },
        cache: {},
        data: function (elem, name, data) {
            elem = elem == window ? windowData : elem;
            var id = elem[expando];
            if (!id) {
                id = elem[expando] = ++uuid
            }
            if (name && !jQuery.cache[id]) {
                jQuery.cache[id] = {}
            }
            if (data !== undefined) {
                jQuery.cache[id][name] = data
            }
            return name ? jQuery.cache[id][name] : id
        },
        removeData: function (elem, name) {
            elem = elem == window ? windowData : elem;
            var id = elem[expando];
            if (name) {
                if (jQuery.cache[id]) {
                    delete jQuery.cache[id][name];
                    name = "";
                    for (name in jQuery.cache[id]) {
                        break
                    }
                    if (!name) {
                        jQuery.removeData(elem)
                    }
                }
            } else {
                try {
                    delete elem[expando]
                } catch (e) {
                    if (elem.removeAttribute) {
                        elem.removeAttribute(expando)
                    }
                }
                delete jQuery.cache[id]
            }
        },
        each: function (object, callback, args) {
            var name, i = 0,
                length = object.length;
            if (args) {
                if (length == undefined) {
                    for (name in object) {
                        if (callback.apply(object[name], args) === false) {
                            break
                        }
                    }
                } else {
                    for (; i < length;) {
                        if (callback.apply(object[i++], args) === false) {
                            break
                        }
                    }
                }
            } else {
                if (length == undefined) {
                    for (name in object) {
                        if (callback.call(object[name], name, object[name]) === false) {
                            break
                        }
                    }
                } else {
                    for (var value = object[0]; i < length && callback.call(value, i, value) !== false; value = object[++i]) {}
                }
            }
            return object
        },
        prop: function (elem, value, type, i, name) {
            if (jQuery.isFunction(value)) {
                value = value.call(elem, i)
            }
            return value && value.constructor == Number && type == "curCSS" && !exclude.test(name) ? value + "px" : value
        },
        className: {
            add: function (elem, classNames) {
                jQuery.each((classNames || "").split(/\s+/), function (i, className) {
                    if (elem.nodeType == 1 && !jQuery.className.has(elem.className, className)) {
                        elem.className += (elem.className ? " " : "") + className
                    }
                })
            },
            remove: function (elem, classNames) {
                if (elem.nodeType == 1) {
                    elem.className = classNames != undefined ? jQuery.grep(elem.className.split(/\s+/), function (className) {
                        return !jQuery.className.has(classNames, className)
                    }).join(" ") : ""
                }
            },
            has: function (elem, className) {
                return jQuery.inArray(className, (elem.className || elem).toString().split(/\s+/)) > -1
            }
        },
        swap: function (elem, options, callback) {
            var old = {};
            for (var name in options) {
                old[name] = elem.style[name];
                elem.style[name] = options[name]
            }
            callback.call(elem);
            for (var name in options) {
                elem.style[name] = old[name]
            }
        },
        css: function (elem, name, force) {
            if (name == "width" || name == "height") {
                var val, props = {
                        position: "absolute",
                        visibility: "hidden",
                        display: "block"
                    }, which = name == "width" ? ["Left", "Right"] : ["Top", "Bottom"];

                function getWH() {
                    val = name == "width" ? elem.offsetWidth : elem.offsetHeight;
                    var padding = 0,
                        border = 0;
                    jQuery.each(which, function () {
                        padding += parseFloat(jQuery.curCSS(elem, "padding" + this, true)) || 0;
                        border += parseFloat(jQuery.curCSS(elem, "border" + this + "Width", true)) || 0
                    });
                    val -= Math.round(padding + border)
                }
                if (jQuery(elem).is(":visible")) {
                    getWH()
                } else {
                    jQuery.swap(elem, props, getWH)
                }
                return Math.max(0, val)
            }
            return jQuery.curCSS(elem, name, force)
        },
        curCSS: function (elem, name, force) {
            var ret, style = elem.style;

            function color(elem) {
                if (!jQuery.browser.safari) {
                    return false
                }
                var ret = defaultView.getComputedStyle(elem, null);
                return !ret || ret.getPropertyValue("color") == ""
            }
            if (name == "opacity" && jQuery.browser.msie) {
                ret = jQuery.attr(style, "opacity");
                return ret == "" ? "1" : ret
            }
            if (jQuery.browser.opera && name == "display") {
                var save = style.outline;
                style.outline = "0 solid black";
                style.outline = save
            }
            if (name.match(/float/i)) {
                name = styleFloat
            }
            if (!force && style && style[name]) {
                ret = style[name]
            } else {
                if (defaultView.getComputedStyle) {
                    if (name.match(/float/i)) {
                        name = "float"
                    }
                    name = name.replace(/([A-Z])/g, "-$1").toLowerCase();
                    var computedStyle = defaultView.getComputedStyle(elem, null);
                    if (computedStyle && !color(elem)) {
                        ret = computedStyle.getPropertyValue(name)
                    } else {
                        var swap = [],
                            stack = [],
                            a = elem,
                            i = 0;
                        for (; a && color(a); a = a.parentNode) {
                            stack.unshift(a)
                        }
                        for (; i < stack.length; i++) {
                            if (color(stack[i])) {
                                swap[i] = stack[i].style.display;
                                stack[i].style.display = "block"
                            }
                        }
                        ret = name == "display" && swap[stack.length - 1] != null ? "none" : (computedStyle && computedStyle.getPropertyValue(name)) || "";
                        for (i = 0; i < swap.length; i++) {
                            if (swap[i] != null) {
                                stack[i].style.display = swap[i]
                            }
                        }
                    } if (name == "opacity" && ret == "") {
                        ret = "1"
                    }
                } else {
                    if (elem.currentStyle) {
                        var camelCase = name.replace(/\-(\w)/g, function (all, letter) {
                            return letter.toUpperCase()
                        });
                        ret = elem.currentStyle[name] || elem.currentStyle[camelCase];
                        if (!/^\d+(px)?$/i.test(ret) && /^\d/.test(ret)) {
                            var left = style.left,
                                rsLeft = elem.runtimeStyle.left;
                            elem.runtimeStyle.left = elem.currentStyle.left;
                            style.left = ret || 0;
                            ret = style.pixelLeft + "px";
                            style.left = left;
                            elem.runtimeStyle.left = rsLeft
                        }
                    }
                }
            }
            return ret
        },
        clean: function (elems, context) {
            var ret = [];
            context = context || document;
            if (typeof context.createElement == "undefined") {
                context = context.ownerDocument || context[0] && context[0].ownerDocument || document
            }
            jQuery.each(elems, function (i, elem) {
                if (!elem) {
                    return
                }
                if (elem.constructor == Number) {
                    elem += ""
                }
                if (typeof elem == "string") {
                    elem = elem.replace(/(<(\w+)[^>]*?)\/>/g, function (all, front, tag) {
                        return tag.match(/^(abbr|br|col|img|input|link|meta|param|hr|area|embed)$/i) ? all : front + "></" + tag + ">"
                    });
                    var tags = jQuery.trim(elem).toLowerCase(),
                        div = context.createElement("div");
                    var wrap = !tags.indexOf("<opt") && [1, "<select multiple='multiple'>", "</select>"] || !tags.indexOf("<leg") && [1, "<fieldset>", "</fieldset>"] || tags.match(/^<(thead|tbody|tfoot|colg|cap)/) && [1, "<table>", "</table>"] || !tags.indexOf("<tr") && [2, "<table><tbody>", "</tbody></table>"] || (!tags.indexOf("<td") || !tags.indexOf("<th")) && [3, "<table><tbody><tr>", "</tr></tbody></table>"] || !tags.indexOf("<col") && [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"] || jQuery.browser.msie && [1, "div<div>", "</div>"] || [0, "", ""];
                    div.innerHTML = wrap[1] + elem + wrap[2];
                    while (wrap[0]--) {
                        div = div.lastChild
                    }
                    if (jQuery.browser.msie) {
                        var tbody = !tags.indexOf("<table") && tags.indexOf("<tbody") < 0 ? div.firstChild && div.firstChild.childNodes : wrap[1] == "<table>" && tags.indexOf("<tbody") < 0 ? div.childNodes : [];
                        for (var j = tbody.length - 1; j >= 0; --j) {
                            if (jQuery.nodeName(tbody[j], "tbody") && !tbody[j].childNodes.length) {
                                tbody[j].parentNode.removeChild(tbody[j])
                            }
                        }
                        if (/^\s/.test(elem)) {
                            div.insertBefore(context.createTextNode(elem.match(/^\s*/)[0]), div.firstChild)
                        }
                    }
                    elem = jQuery.makeArray(div.childNodes)
                }
                if (elem.length === 0 && (!jQuery.nodeName(elem, "form") && !jQuery.nodeName(elem, "select"))) {
                    return
                }
                if (elem[0] == undefined || jQuery.nodeName(elem, "form") || elem.options) {
                    ret.push(elem)
                } else {
                    ret = jQuery.merge(ret, elem)
                }
            });
            return ret
        },
        attr: function (elem, name, value) {
            if (!elem || elem.nodeType == 3 || elem.nodeType == 8) {
                return undefined
            }
            var notxml = !jQuery.isXMLDoc(elem),
                set = value !== undefined,
                msie = jQuery.browser.msie;
            name = notxml && jQuery.props[name] || name;
            if (elem.tagName) {
                var special = /href|src|style/.test(name);
                if (name == "selected" && jQuery.browser.safari) {
                    elem.parentNode.selectedIndex
                }
                if (name in elem && notxml && !special) {
                    if (set) {
                        if (name == "type" && jQuery.nodeName(elem, "input") && elem.parentNode) {
                            throw "type property can't be changed"
                        }
                        elem[name] = value
                    }
                    if (jQuery.nodeName(elem, "form") && elem.getAttributeNode(name)) {
                        return elem.getAttributeNode(name).nodeValue
                    }
                    return elem[name]
                }
                if (msie && notxml && name == "style") {
                    return jQuery.attr(elem.style, "cssText", value)
                }
                if (set) {
                    elem.setAttribute(name, "" + value)
                }
                var attr = msie && notxml && special ? elem.getAttribute(name, 2) : elem.getAttribute(name);
                return attr === null ? undefined : attr
            }
            if (msie && name == "opacity") {
                if (set) {
                    elem.zoom = 1;
                    elem.filter = (elem.filter || "").replace(/alpha\([^)]*\)/, "") + (parseInt(value) + "" == "NaN" ? "" : "alpha(opacity=" + value * 100 + ")")
                }
                return elem.filter && elem.filter.indexOf("opacity=") >= 0 ? (parseFloat(elem.filter.match(/opacity=([^)]*)/)[1]) / 100) + "" : ""
            }
            name = name.replace(/-([a-z])/ig, function (all, letter) {
                return letter.toUpperCase()
            });
            if (set) {
                elem[name] = value
            }
            return elem[name]
        },
        trim: function (text) {
            return (text || "").replace(/^\s+|\s+$/g, "")
        },
        makeArray: function (array) {
            var ret = [];
            if (array != null) {
                var i = array.length;
                if (i == null || array.split || array.setInterval || array.call) {
                    ret[0] = array
                } else {
                    while (i) {
                        ret[--i] = array[i]
                    }
                }
            }
            return ret
        },
        inArray: function (elem, array) {
            for (var i = 0, length = array.length; i < length; i++) {
                if (array[i] === elem) {
                    return i
                }
            }
            return -1
        },
        merge: function (first, second) {
            var i = 0,
                elem, pos = first.length;
            if (jQuery.browser.msie) {
                while (elem = second[i++]) {
                    if (elem.nodeType != 8) {
                        first[pos++] = elem
                    }
                }
            } else {
                while (elem = second[i++]) {
                    first[pos++] = elem
                }
            }
            return first
        },
        unique: function (array) {
            var ret = [],
                done = {};
            try {
                for (var i = 0, length = array.length; i < length; i++) {
                    var id = jQuery.data(array[i]);
                    if (!done[id]) {
                        done[id] = true;
                        ret.push(array[i])
                    }
                }
            } catch (e) {
                ret = array
            }
            return ret
        },
        grep: function (elems, callback, inv) {
            var ret = [];
            for (var i = 0, length = elems.length; i < length; i++) {
                if (!inv != !callback(elems[i], i)) {
                    ret.push(elems[i])
                }
            }
            return ret
        },
        map: function (elems, callback) {
            var ret = [];
            for (var i = 0, length = elems.length; i < length; i++) {
                var value = callback(elems[i], i);
                if (value != null) {
                    ret[ret.length] = value
                }
            }
            return ret.concat.apply([], ret)
        }
    });
    var userAgent = navigator.userAgent.toLowerCase();
    jQuery.browser = {
        version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
        safari: /webkit/.test(userAgent),
        opera: /opera/.test(userAgent),
        msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
        mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent)
    };
    var styleFloat = jQuery.browser.msie ? "styleFloat" : "cssFloat";
    jQuery.extend({
        boxModel: !jQuery.browser.msie || document.compatMode == "CSS1Compat",
        props: {
            "for": "htmlFor",
            "class": "className",
            "float": styleFloat,
            cssFloat: styleFloat,
            styleFloat: styleFloat,
            readonly: "readOnly",
            maxlength: "maxLength",
            cellspacing: "cellSpacing"
        }
    });
    jQuery.each({
        parent: function (elem) {
            return elem.parentNode
        },
        parents: function (elem) {
            return jQuery.dir(elem, "parentNode")
        },
        next: function (elem) {
            return jQuery.nth(elem, 2, "nextSibling")
        },
        prev: function (elem) {
            return jQuery.nth(elem, 2, "previousSibling")
        },
        nextAll: function (elem) {
            return jQuery.dir(elem, "nextSibling")
        },
        prevAll: function (elem) {
            return jQuery.dir(elem, "previousSibling")
        },
        siblings: function (elem) {
            return jQuery.sibling(elem.parentNode.firstChild, elem)
        },
        children: function (elem) {
            return jQuery.sibling(elem.firstChild)
        },
        contents: function (elem) {
            return jQuery.nodeName(elem, "iframe") ? elem.contentDocument || elem.contentWindow.document : jQuery.makeArray(elem.childNodes)
        }
    }, function (name, fn) {
        jQuery.fn[name] = function (selector) {
            var ret = jQuery.map(this, fn);
            if (selector && typeof selector == "string") {
                ret = jQuery.multiFilter(selector, ret)
            }
            return this.pushStack(jQuery.unique(ret))
        }
    });
    jQuery.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function (name, original) {
        jQuery.fn[name] = function () {
            var args = arguments;
            return this.each(function () {
                for (var i = 0, length = args.length; i < length; i++) {
                    jQuery(args[i])[original](this)
                }
            })
        }
    });
    jQuery.each({
        removeAttr: function (name) {
            jQuery.attr(this, name, "");
            if (this.nodeType == 1) {
                this.removeAttribute(name)
            }
        },
        addClass: function (classNames) {
            jQuery.className.add(this, classNames)
        },
        removeClass: function (classNames) {
            jQuery.className.remove(this, classNames)
        },
        toggleClass: function (classNames) {
            jQuery.className[jQuery.className.has(this, classNames) ? "remove" : "add"](this, classNames)
        },
        remove: function (selector) {
            if (!selector || jQuery.filter(selector, [this]).r.length) {
                jQuery("*", this).add(this).each(function () {
                    jQuery.event.remove(this);
                    jQuery.removeData(this)
                });
                if (this.parentNode) {
                    this.parentNode.removeChild(this)
                }
            }
        },
        empty: function () {
            jQuery(">*", this).remove();
            while (this.firstChild) {
                this.removeChild(this.firstChild)
            }
        }
    }, function (name, fn) {
        jQuery.fn[name] = function () {
            return this.each(fn, arguments)
        }
    });
    jQuery.each(["Height", "Width"], function (i, name) {
        var type = name.toLowerCase();
        jQuery.fn[type] = function (size) {
            return this[0] == window ? jQuery.browser.opera && document.body["client" + name] || jQuery.browser.safari && window["inner" + name] || document.compatMode == "CSS1Compat" && document.documentElement["client" + name] || document.body["client" + name] : this[0] == document ? Math.max(Math.max(document.body["scroll" + name], document.documentElement["scroll" + name]), Math.max(document.body["offset" + name], document.documentElement["offset" + name])) : size == undefined ? (this.length ? jQuery.css(this[0], type) : null) : this.css(type, size.constructor == String ? size : size + "px")
        }
    });

    function num(elem, prop) {
        return elem[0] && parseInt(jQuery.curCSS(elem[0], prop, true), 10) || 0
    }
    var chars = jQuery.browser.safari && parseInt(jQuery.browser.version) < 417 ? "(?:[\\w*_-]|\\\\.)" : "(?:[\\w\u0128-\uFFFF*_-]|\\\\.)",
        quickChild = new RegExp("^>\\s*(" + chars + "+)"),
        quickID = new RegExp("^(" + chars + "+)(#)(" + chars + "+)"),
        quickClass = new RegExp("^([#.]?)(" + chars + "*)");
    jQuery.extend({
        expr: {
            "": function (a, i, m) {
                return m[2] == "*" || jQuery.nodeName(a, m[2])
            },
            "#": function (a, i, m) {
                return a.getAttribute("id") == m[2]
            },
            ":": {
                lt: function (a, i, m) {
                    return i < m[3] - 0
                },
                gt: function (a, i, m) {
                    return i > m[3] - 0
                },
                nth: function (a, i, m) {
                    return m[3] - 0 == i
                },
                eq: function (a, i, m) {
                    return m[3] - 0 == i
                },
                first: function (a, i) {
                    return i == 0
                },
                last: function (a, i, m, r) {
                    return i == r.length - 1
                },
                even: function (a, i) {
                    return i % 2 == 0
                },
                odd: function (a, i) {
                    return i % 2
                },
                "first-child": function (a) {
                    return a.parentNode.getElementsByTagName("*")[0] == a
                },
                "last-child": function (a) {
                    return jQuery.nth(a.parentNode.lastChild, 1, "previousSibling") == a
                },
                "only-child": function (a) {
                    return !jQuery.nth(a.parentNode.lastChild, 2, "previousSibling")
                },
                parent: function (a) {
                    return a.firstChild
                },
                empty: function (a) {
                    return !a.firstChild
                },
                contains: function (a, i, m) {
                    return (a.textContent || a.innerText || jQuery(a).text() || "").indexOf(m[3]) >= 0
                },
                visible: function (a) {
                    return "hidden" != a.type && jQuery.css(a, "display") != "none" && jQuery.css(a, "visibility") != "hidden"
                },
                hidden: function (a) {
                    return "hidden" == a.type || jQuery.css(a, "display") == "none" || jQuery.css(a, "visibility") == "hidden"
                },
                enabled: function (a) {
                    return !a.disabled
                },
                disabled: function (a) {
                    return a.disabled
                },
                checked: function (a) {
                    return a.checked
                },
                selected: function (a) {
                    return a.selected || jQuery.attr(a, "selected")
                },
                text: function (a) {
                    return "text" == a.type
                },
                radio: function (a) {
                    return "radio" == a.type
                },
                checkbox: function (a) {
                    return "checkbox" == a.type
                },
                file: function (a) {
                    return "file" == a.type
                },
                password: function (a) {
                    return "password" == a.type
                },
                submit: function (a) {
                    return "submit" == a.type
                },
                image: function (a) {
                    return "image" == a.type
                },
                reset: function (a) {
                    return "reset" == a.type
                },
                button: function (a) {
                    return "button" == a.type || jQuery.nodeName(a, "button")
                },
                input: function (a) {
                    return /input|select|textarea|button/i.test(a.nodeName)
                },
                has: function (a, i, m) {
                    return jQuery.find(m[3], a).length
                },
                header: function (a) {
                    return /h\d/i.test(a.nodeName)
                },
                animated: function (a) {
                    return jQuery.grep(jQuery.timers, function (fn) {
                        return a == fn.elem
                    }).length
                }
            }
        },
        parse: [/^(\[) *@?([\w-]+) *([!*$^~=]*) *('?"?)(.*?)\4 *\]/, /^(:)([\w-]+)\("?'?(.*?(\(.*?\))?[^(]*?)"?'?\)/, new RegExp("^([:.#]*)(" + chars + "+)")],
        multiFilter: function (expr, elems, not) {
            var old, cur = [];
            while (expr && expr != old) {
                old = expr;
                var f = jQuery.filter(expr, elems, not);
                expr = f.t.replace(/^\s*,\s*/, "");
                cur = not ? elems = f.r : jQuery.merge(cur, f.r)
            }
            return cur
        },
        find: function (t, context) {
            if (typeof t != "string") {
                return [t]
            }
            if (context && context.nodeType != 1 && context.nodeType != 9) {
                return []
            }
            context = context || document;
            var ret = [context],
                done = [],
                last, nodeName;
            while (t && last != t) {
                var r = [];
                last = t;
                t = jQuery.trim(t);
                var foundToken = false,
                    re = quickChild,
                    m = re.exec(t);
                if (m) {
                    nodeName = m[1].toUpperCase();
                    for (var i = 0; ret[i]; i++) {
                        for (var c = ret[i].firstChild; c; c = c.nextSibling) {
                            if (c.nodeType == 1 && (nodeName == "*" || c.nodeName.toUpperCase() == nodeName)) {
                                r.push(c)
                            }
                        }
                    }
                    ret = r;
                    t = t.replace(re, "");
                    if (t.indexOf(" ") == 0) {
                        continue
                    }
                    foundToken = true
                } else {
                    re = /^([>+~])\s*(\w*)/i;
                    if ((m = re.exec(t)) != null) {
                        r = [];
                        var merge = {};
                        nodeName = m[2].toUpperCase();
                        m = m[1];
                        for (var j = 0, rl = ret.length; j < rl; j++) {
                            var n = m == "~" || m == "+" ? ret[j].nextSibling : ret[j].firstChild;
                            for (; n; n = n.nextSibling) {
                                if (n.nodeType == 1) {
                                    var id = jQuery.data(n);
                                    if (m == "~" && merge[id]) {
                                        break
                                    }
                                    if (!nodeName || n.nodeName.toUpperCase() == nodeName) {
                                        if (m == "~") {
                                            merge[id] = true
                                        }
                                        r.push(n)
                                    }
                                    if (m == "+") {
                                        break
                                    }
                                }
                            }
                        }
                        ret = r;
                        t = jQuery.trim(t.replace(re, ""));
                        foundToken = true
                    }
                } if (t && !foundToken) {
                    if (!t.indexOf(",")) {
                        if (context == ret[0]) {
                            ret.shift()
                        }
                        done = jQuery.merge(done, ret);
                        r = ret = [context];
                        t = " " + t.substr(1, t.length)
                    } else {
                        var re2 = quickID;
                        var m = re2.exec(t);
                        if (m) {
                            m = [0, m[2], m[3], m[1]]
                        } else {
                            re2 = quickClass;
                            m = re2.exec(t)
                        }
                        m[2] = m[2].replace(/\\/g, "");
                        var elem = ret[ret.length - 1];
                        if (m[1] == "#" && elem && elem.getElementById && !jQuery.isXMLDoc(elem)) {
                            var oid = elem.getElementById(m[2]);
                            if ((jQuery.browser.msie || jQuery.browser.opera) && oid && typeof oid.id == "string" && oid.id != m[2]) {
                                oid = jQuery('[@id="' + m[2] + '"]', elem)[0]
                            }
                            ret = r = oid && (!m[3] || jQuery.nodeName(oid, m[3])) ? [oid] : []
                        } else {
                            for (var i = 0; ret[i]; i++) {
                                var tag = m[1] == "#" && m[3] ? m[3] : m[1] != "" || m[0] == "" ? "*" : m[2];
                                if (tag == "*" && ret[i].nodeName.toLowerCase() == "object") {
                                    tag = "param"
                                }
                                r = jQuery.merge(r, ret[i].getElementsByTagName(tag))
                            }
                            if (m[1] == ".") {
                                r = jQuery.classFilter(r, m[2])
                            }
                            if (m[1] == "#") {
                                var tmp = [];
                                for (var i = 0; r[i]; i++) {
                                    if (r[i].getAttribute("id") == m[2]) {
                                        tmp = [r[i]];
                                        break
                                    }
                                }
                                r = tmp
                            }
                            ret = r
                        }
                        t = t.replace(re2, "")
                    }
                }
                if (t) {
                    var val = jQuery.filter(t, r);
                    ret = r = val.r;
                    t = jQuery.trim(val.t)
                }
            }
            if (t) {
                ret = []
            }
            if (ret && context == ret[0]) {
                ret.shift()
            }
            done = jQuery.merge(done, ret);
            return done
        },
        classFilter: function (r, m, not) {
            m = " " + m + " ";
            var tmp = [];
            for (var i = 0; r[i]; i++) {
                var pass = (" " + r[i].className + " ").indexOf(m) >= 0;
                if (!not && pass || not && !pass) {
                    tmp.push(r[i])
                }
            }
            return tmp
        },
        filter: function (t, r, not) {
            var last;
            while (t && t != last) {
                last = t;
                var p = jQuery.parse,
                    m;
                for (var i = 0; p[i]; i++) {
                    m = p[i].exec(t);
                    if (m) {
                        t = t.substring(m[0].length);
                        m[2] = m[2].replace(/\\/g, "");
                        break
                    }
                }
                if (!m) {
                    break
                }
                if (m[1] == ":" && m[2] == "not") {
                    r = isSimple.test(m[3]) ? jQuery.filter(m[3], r, true).r : jQuery(r).not(m[3])
                } else {
                    if (m[1] == ".") {
                        r = jQuery.classFilter(r, m[2], not)
                    } else {
                        if (m[1] == "[") {
                            var tmp = [],
                                type = m[3];
                            for (var i = 0, rl = r.length; i < rl; i++) {
                                var a = r[i],
                                    z = a[jQuery.props[m[2]] || m[2]];
                                if (z == null || /href|src|selected/.test(m[2])) {
                                    z = jQuery.attr(a, m[2]) || ""
                                }
                                if ((type == "" && !! z || type == "=" && z == m[5] || type == "!=" && z != m[5] || type == "^=" && z && !z.indexOf(m[5]) || type == "$=" && z.substr(z.length - m[5].length) == m[5] || (type == "*=" || type == "~=") && z.indexOf(m[5]) >= 0) ^ not) {
                                    tmp.push(a)
                                }
                            }
                            r = tmp
                        } else {
                            if (m[1] == ":" && m[2] == "nth-child") {
                                var merge = {}, tmp = [],
                                    test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(m[3] == "even" && "2n" || m[3] == "odd" && "2n+1" || !/\D/.test(m[3]) && "0n+" + m[3] || m[3]),
                                    first = (test[1] + (test[2] || 1)) - 0,
                                    last = test[3] - 0;
                                for (var i = 0, rl = r.length; i < rl; i++) {
                                    var node = r[i],
                                        parentNode = node.parentNode,
                                        id = jQuery.data(parentNode);
                                    if (!merge[id]) {
                                        var c = 1;
                                        for (var n = parentNode.firstChild; n; n = n.nextSibling) {
                                            if (n.nodeType == 1) {
                                                n.nodeIndex = c++
                                            }
                                        }
                                        merge[id] = true
                                    }
                                    var add = false;
                                    if (first == 0) {
                                        if (node.nodeIndex == last) {
                                            add = true
                                        }
                                    } else {
                                        if ((node.nodeIndex - last) % first == 0 && (node.nodeIndex - last) / first >= 0) {
                                            add = true
                                        }
                                    } if (add ^ not) {
                                        tmp.push(node)
                                    }
                                }
                                r = tmp
                            } else {
                                var fn = jQuery.expr[m[1]];
                                if (typeof fn == "object") {
                                    fn = fn[m[2]]
                                }
                                if (typeof fn == "string") {
                                    fn = eval("false||function(a,i){return " + fn + ";}")
                                }
                                r = jQuery.grep(r, function (elem, i) {
                                    return fn(elem, i, m, r)
                                }, not)
                            }
                        }
                    }
                }
            }
            return {
                r: r,
                t: t
            }
        },
        dir: function (elem, dir) {
            var matched = [],
                cur = elem[dir];
            while (cur && cur != document) {
                if (cur.nodeType == 1) {
                    matched.push(cur)
                }
                cur = cur[dir]
            }
            return matched
        },
        nth: function (cur, result, dir, elem) {
            result = result || 1;
            var num = 0;
            for (; cur; cur = cur[dir]) {
                if (cur.nodeType == 1 && ++num == result) {
                    break
                }
            }
            return cur
        },
        sibling: function (n, elem) {
            var r = [];
            for (; n; n = n.nextSibling) {
                if (n.nodeType == 1 && n != elem) {
                    r.push(n)
                }
            }
            return r
        }
    });
    jQuery.event = {
        add: function (elem, types, handler, data) {
            if (elem.nodeType == 3 || elem.nodeType == 8) {
                return
            }
            if (jQuery.browser.msie && elem.setInterval) {
                elem = window
            }
            if (!handler.guid) {
                handler.guid = this.guid++
            }
            if (data != undefined) {
                var fn = handler;
                handler = this.proxy(fn, function () {
                    return fn.apply(this, arguments)
                });
                handler.data = data
            }
            var events = jQuery.data(elem, "events") || jQuery.data(elem, "events", {}),
                handle = jQuery.data(elem, "handle") || jQuery.data(elem, "handle", function () {
                    if (typeof jQuery != "undefined" && !jQuery.event.triggered) {
                        return jQuery.event.handle.apply(arguments.callee.elem, arguments)
                    }
                });
            handle.elem = elem;
            jQuery.each(types.split(/\s+/), function (index, type) {
                var parts = type.split(".");
                type = parts[0];
                handler.type = parts[1];
                var handlers = events[type];
                if (!handlers) {
                    handlers = events[type] = {};
                    if (!jQuery.event.special[type] || jQuery.event.special[type].setup.call(elem) === false) {
                        if (elem.addEventListener) {
                            elem.addEventListener(type, handle, false)
                        } else {
                            if (elem.attachEvent) {
                                elem.attachEvent("on" + type, handle)
                            }
                        }
                    }
                }
                handlers[handler.guid] = handler;
                jQuery.event.global[type] = true
            });
            elem = null
        },
        guid: 1,
        global: {},
        remove: function (elem, types, handler) {
            if (elem.nodeType == 3 || elem.nodeType == 8) {
                return
            }
            var events = jQuery.data(elem, "events"),
                ret, index;
            if (events) {
                if (types == undefined || (typeof types == "string" && types.charAt(0) == ".")) {
                    for (var type in events) {
                        this.remove(elem, type + (types || ""))
                    }
                } else {
                    if (types.type) {
                        handler = types.handler;
                        types = types.type
                    }
                    jQuery.each(types.split(/\s+/), function (index, type) {
                        var parts = type.split(".");
                        type = parts[0];
                        if (events[type]) {
                            if (handler) {
                                delete events[type][handler.guid]
                            } else {
                                for (handler in events[type]) {
                                    if (!parts[1] || events[type][handler].type == parts[1]) {
                                        delete events[type][handler]
                                    }
                                }
                            }
                            for (ret in events[type]) {
                                break
                            }
                            if (!ret) {
                                if (!jQuery.event.special[type] || jQuery.event.special[type].teardown.call(elem) === false) {
                                    if (elem.removeEventListener) {
                                        elem.removeEventListener(type, jQuery.data(elem, "handle"), false)
                                    } else {
                                        if (elem.detachEvent) {
                                            elem.detachEvent("on" + type, jQuery.data(elem, "handle"))
                                        }
                                    }
                                }
                                ret = null;
                                delete events[type]
                            }
                        }
                    })
                }
                for (ret in events) {
                    break
                }
                if (!ret) {
                    var handle = jQuery.data(elem, "handle");
                    if (handle) {
                        handle.elem = null
                    }
                    jQuery.removeData(elem, "events");
                    jQuery.removeData(elem, "handle")
                }
            }
        },
        trigger: function (type, data, elem, donative, extra) {
            data = jQuery.makeArray(data);
            if (type.indexOf("!") >= 0) {
                type = type.slice(0, -1);
                var exclusive = true
            }
            if (!elem) {
                if (this.global[type]) {
                    jQuery("*").add([window, document]).trigger(type, data)
                }
            } else {
                if (elem.nodeType == 3 || elem.nodeType == 8) {
                    return undefined
                }
                var val, ret, fn = jQuery.isFunction(elem[type] || null),
                    event = !data[0] || !data[0].preventDefault;
                if (event) {
                    data.unshift({
                        type: type,
                        target: elem,
                        preventDefault: function () {},
                        stopPropagation: function () {},
                        timeStamp: now()
                    });
                    data[0][expando] = true
                }
                data[0].type = type;
                if (exclusive) {
                    data[0].exclusive = true
                }
                var handle = jQuery.data(elem, "handle");
                if (handle) {
                    val = handle.apply(elem, data)
                }
                if ((!fn || (jQuery.nodeName(elem, "a") && type == "click")) && elem["on" + type] && elem["on" + type].apply(elem, data) === false) {
                    val = false
                }
                if (event) {
                    data.shift()
                }
                if (extra && jQuery.isFunction(extra)) {
                    ret = extra.apply(elem, val == null ? data : data.concat(val));
                    if (ret !== undefined) {
                        val = ret
                    }
                }
                if (fn && donative !== false && val !== false && !(jQuery.nodeName(elem, "a") && type == "click")) {
                    this.triggered = true;
                    try {
                        elem[type]()
                    } catch (e) {}
                }
                this.triggered = false
            }
            return val
        },
        handle: function (event) {
            var val, ret, namespace, all, handlers;
            event = arguments[0] = jQuery.event.fix(event || window.event);
            namespace = event.type.split(".");
            event.type = namespace[0];
            namespace = namespace[1];
            all = !namespace && !event.exclusive;
            handlers = (jQuery.data(this, "events") || {})[event.type];
            for (var j in handlers) {
                var handler = handlers[j];
                if (all || handler.type == namespace) {
                    event.handler = handler;
                    event.data = handler.data;
                    ret = handler.apply(this, arguments);
                    if (val !== false) {
                        val = ret
                    }
                    if (ret === false) {
                        event.preventDefault();
                        event.stopPropagation()
                    }
                }
            }
            return val
        },
        fix: function (event) {
            if (event[expando] == true) {
                return event
            }
            var originalEvent = event;
            event = {
                originalEvent: originalEvent
            };
            var props = "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode metaKey newValue originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target timeStamp toElement type view wheelDelta which".split(" ");
            for (var i = props.length; i; i--) {
                event[props[i]] = originalEvent[props[i]]
            }
            event[expando] = true;
            event.preventDefault = function () {
                if (originalEvent.preventDefault) {
                    originalEvent.preventDefault()
                }
                originalEvent.returnValue = false
            };
            event.stopPropagation = function () {
                if (originalEvent.stopPropagation) {
                    originalEvent.stopPropagation()
                }
                originalEvent.cancelBubble = true
            };
            event.timeStamp = event.timeStamp || now();
            if (!event.target) {
                event.target = event.srcElement || document
            }
            if (event.target.nodeType == 3) {
                event.target = event.target.parentNode
            }
            if (!event.relatedTarget && event.fromElement) {
                event.relatedTarget = event.fromElement == event.target ? event.toElement : event.fromElement
            }
            if (event.pageX == null && event.clientX != null) {
                var doc = document.documentElement,
                    body = document.body;
                event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0);
                event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc.clientTop || 0)
            }
            if (!event.which && ((event.charCode || event.charCode === 0) ? event.charCode : event.keyCode)) {
                event.which = event.charCode || event.keyCode
            }
            if (!event.metaKey && event.ctrlKey) {
                event.metaKey = event.ctrlKey
            }
            if (!event.which && event.button) {
                event.which = (event.button & 1 ? 1 : (event.button & 2 ? 3 : (event.button & 4 ? 2 : 0)))
            }
            return event
        },
        proxy: function (fn, proxy) {
            proxy.guid = fn.guid = fn.guid || proxy.guid || this.guid++;
            return proxy
        },
        special: {
            ready: {
                setup: function () {
                    bindReady();
                    return
                },
                teardown: function () {
                    return
                }
            },
            mouseenter: {
                setup: function () {
                    if (jQuery.browser.msie) {
                        return false
                    }
                    jQuery(this).bind("mouseover", jQuery.event.special.mouseenter.handler);
                    return true
                },
                teardown: function () {
                    if (jQuery.browser.msie) {
                        return false
                    }
                    jQuery(this).unbind("mouseover", jQuery.event.special.mouseenter.handler);
                    return true
                },
                handler: function (event) {
                    if (withinElement(event, this)) {
                        return true
                    }
                    event.type = "mouseenter";
                    return jQuery.event.handle.apply(this, arguments)
                }
            },
            mouseleave: {
                setup: function () {
                    if (jQuery.browser.msie) {
                        return false
                    }
                    jQuery(this).bind("mouseout", jQuery.event.special.mouseleave.handler);
                    return true
                },
                teardown: function () {
                    if (jQuery.browser.msie) {
                        return false
                    }
                    jQuery(this).unbind("mouseout", jQuery.event.special.mouseleave.handler);
                    return true
                },
                handler: function (event) {
                    if (withinElement(event, this)) {
                        return true
                    }
                    event.type = "mouseleave";
                    return jQuery.event.handle.apply(this, arguments)
                }
            }
        }
    };
    jQuery.fn.extend({
        bind: function (type, data, fn) {
            return type == "unload" ? this.one(type, data, fn) : this.each(function () {
                jQuery.event.add(this, type, fn || data, fn && data)
            })
        },
        one: function (type, data, fn) {
            var one = jQuery.event.proxy(fn || data, function (event) {
                jQuery(this).unbind(event, one);
                return (fn || data).apply(this, arguments)
            });
            return this.each(function () {
                jQuery.event.add(this, type, one, fn && data)
            })
        },
        unbind: function (type, fn) {
            return this.each(function () {
                jQuery.event.remove(this, type, fn)
            })
        },
        trigger: function (type, data, fn) {
            return this.each(function () {
                jQuery.event.trigger(type, data, this, true, fn)
            })
        },
        triggerHandler: function (type, data, fn) {
            return this[0] && jQuery.event.trigger(type, data, this[0], false, fn)
        },
        toggle: function (fn) {
            var args = arguments,
                i = 1;
            while (i < args.length) {
                jQuery.event.proxy(fn, args[i++])
            }
            return this.click(jQuery.event.proxy(fn, function (event) {
                this.lastToggle = (this.lastToggle || 0) % i;
                event.preventDefault();
                return args[this.lastToggle++].apply(this, arguments) || false
            }))
        },
        hover: function (fnOver, fnOut) {
            return this.bind("mouseenter", fnOver).bind("mouseleave", fnOut)
        },
        ready: function (fn) {
            bindReady();
            if (jQuery.isReady) {
                fn.call(document, jQuery)
            } else {
                jQuery.readyList.push(function () {
                    return fn.call(this, jQuery)
                })
            }
            return this
        }
    });
    jQuery.extend({
        isReady: false,
        readyList: [],
        ready: function () {
            if (!jQuery.isReady) {
                jQuery.isReady = true;
                if (jQuery.readyList) {
                    jQuery.each(jQuery.readyList, function () {
                        this.call(document)
                    });
                    jQuery.readyList = null
                }
                jQuery(document).triggerHandler("ready")
            }
        }
    });
    var readyBound = false;

    function bindReady() {
        if (readyBound) {
            return
        }
        readyBound = true;
        if (document.addEventListener && !jQuery.browser.opera) {
            document.addEventListener("DOMContentLoaded", jQuery.ready, false)
        }
        if (jQuery.browser.msie && window == top) {
            (function () {
                if (jQuery.isReady) {
                    return
                }
                try {
                    document.documentElement.doScroll("left")
                } catch (error) {
                    setTimeout(arguments.callee, 0);
                    return
                }
                jQuery.ready()
            })()
        }
        if (jQuery.browser.opera) {
            document.addEventListener("DOMContentLoaded", function () {
                if (jQuery.isReady) {
                    return
                }
                for (var i = 0; i < document.styleSheets.length; i++) {
                    if (document.styleSheets[i].disabled) {
                        setTimeout(arguments.callee, 0);
                        return
                    }
                }
                jQuery.ready()
            }, false)
        }
        if (jQuery.browser.safari) {
            var numStyles;
            (function () {
                if (jQuery.isReady) {
                    return
                }
                if (document.readyState != "loaded" && document.readyState != "complete") {
                    setTimeout(arguments.callee, 0);
                    return
                }
                if (numStyles === undefined) {
                    numStyles = jQuery("style, link[rel=stylesheet]").length
                }
                if (document.styleSheets.length != numStyles) {
                    setTimeout(arguments.callee, 0);
                    return
                }
                jQuery.ready()
            })()
        }
        jQuery.event.add(window, "load", jQuery.ready)
    }
    jQuery.each(("blur,focus,load,resize,scroll,unload,click,dblclick,mousedown,mouseup,mousemove,mouseover,mouseout,change,select,submit,keydown,keypress,keyup,error").split(","), function (i, name) {
        jQuery.fn[name] = function (fn) {
            return fn ? this.bind(name, fn) : this.trigger(name)
        }
    });
    var withinElement = function (event, elem) {
        var parent = event.relatedTarget;
        while (parent && parent != elem) {
            try {
                parent = parent.parentNode
            } catch (error) {
                parent = elem
            }
        }
        return parent == elem
    };
    jQuery(window).bind("unload", function () {
        jQuery("*").add(document).unbind()
    });
    jQuery.fn.extend({
        _load: jQuery.fn.load,
        load: function (url, params, callback) {
            if (typeof url != "string") {
                return this._load(url)
            }
            var off = url.indexOf(" ");
            if (off >= 0) {
                var selector = url.slice(off, url.length);
                url = url.slice(0, off)
            }
            callback = callback || function () {};
            var type = "GET";
            if (params) {
                if (jQuery.isFunction(params)) {
                    callback = params;
                    params = null
                } else {
                    params = jQuery.param(params);
                    type = "POST"
                }
            }
            var self = this;
            jQuery.ajax({
                url: url,
                type: type,
                dataType: "html",
                data: params,
                complete: function (res, status) {
                    if (status == "success" || status == "notmodified") {
                        self.html(selector ? jQuery("<div/>").append(res.responseText.replace(/<script(.|\s)*?\/script>/g, "")).find(selector) : res.responseText)
                    }
                    self.each(callback, [res.responseText, status, res])
                }
            });
            return this
        },
        serialize: function () {
            return jQuery.param(this.serializeArray())
        },
        serializeArray: function () {
            return this.map(function () {
                return jQuery.nodeName(this, "form") ? jQuery.makeArray(this.elements) : this
            }).filter(function () {
                return this.name && !this.disabled && (this.checked || /select|textarea/i.test(this.nodeName) || /text|hidden|password/i.test(this.type))
            }).map(function (i, elem) {
                var val = jQuery(this).val();
                return val == null ? null : val.constructor == Array ? jQuery.map(val, function (val, i) {
                    return {
                        name: elem.name,
                        value: val
                    }
                }) : {
                    name: elem.name,
                    value: val
                }
            }).get()
        }
    });
    jQuery.each("ajaxStart,ajaxStop,ajaxComplete,ajaxError,ajaxSuccess,ajaxSend".split(","), function (i, o) {
        jQuery.fn[o] = function (f) {
            return this.bind(o, f)
        }
    });
    var jsc = now();
    jQuery.extend({
        get: function (url, data, callback, type) {
            if (jQuery.isFunction(data)) {
                callback = data;
                data = null
            }
            return jQuery.ajax({
                type: "GET",
                url: url,
                data: data,
                success: callback,
                dataType: type
            })
        },
        getScript: function (url, callback) {
            return jQuery.get(url, null, callback, "script")
        },
        getJSON: function (url, data, callback) {
            return jQuery.get(url, data, callback, "json")
        },
        post: function (url, data, callback, type) {
            if (jQuery.isFunction(data)) {
                callback = data;
                data = {}
            }
            return jQuery.ajax({
                type: "POST",
                url: url,
                data: data,
                success: callback,
                dataType: type
            })
        },
        ajaxSetup: function (settings) {
            jQuery.extend(jQuery.ajaxSettings, settings)
        },
        ajaxSettings: {
            url: location.href,
            global: true,
            type: "GET",
            timeout: 0,
            contentType: "application/x-www-form-urlencoded",
            processData: true,
            async: true,
            data: null,
            username: null,
            password: null,
            accepts: {
                xml: "application/xml, text/xml",
                html: "text/html",
                script: "text/javascript, application/javascript",
                json: "application/json, text/javascript",
                text: "text/plain",
                _default: "*/*"
            }
        },
        lastModified: {},
        ajax: function (s) {
            s = jQuery.extend(true, s, jQuery.extend(true, {}, jQuery.ajaxSettings, s));
            var jsonp, jsre = /=\?(&|$)/g,
                status, data, type = s.type.toUpperCase();
            if (s.data && s.processData && typeof s.data != "string") {
                s.data = jQuery.param(s.data)
            }
            if (s.dataType == "jsonp") {
                if (type == "GET") {
                    if (!s.url.match(jsre)) {
                        s.url += (s.url.match(/\?/) ? "&" : "?") + (s.jsonp || "callback") + "=?"
                    }
                } else {
                    if (!s.data || !s.data.match(jsre)) {
                        s.data = (s.data ? s.data + "&" : "") + (s.jsonp || "callback") + "=?"
                    }
                }
                s.dataType = "json"
            }
            if (s.dataType == "json" && (s.data && s.data.match(jsre) || s.url.match(jsre))) {
                jsonp = "jsonp" + jsc++;
                if (s.data) {
                    s.data = (s.data + "").replace(jsre, "=" + jsonp + "$1")
                }
                s.url = s.url.replace(jsre, "=" + jsonp + "$1");
                s.dataType = "script";
                window[jsonp] = function (tmp) {
                    data = tmp;
                    success();
                    complete();
                    window[jsonp] = undefined;
                    try {
                        delete window[jsonp]
                    } catch (e) {}
                    if (head) {
                        head.removeChild(script)
                    }
                }
            }
            if (s.dataType == "script" && s.cache == null) {
                s.cache = false
            }
            if (s.cache === false && type == "GET") {
                var ts = now();
                var ret = s.url.replace(/(\?|&)_=.*?(&|$)/, "$1_=" + ts + "$2");
                s.url = ret + ((ret == s.url) ? (s.url.match(/\?/) ? "&" : "?") + "_=" + ts : "")
            }
            if (s.data && type == "GET") {
                s.url += (s.url.match(/\?/) ? "&" : "?") + s.data;
                s.data = null
            }
            if (s.global && !jQuery.active++) {
                jQuery.event.trigger("ajaxStart")
            }
            var remote = /^(?:\w+:)?\/\/([^\/?#]+)/;
            if (s.dataType == "script" && type == "GET" && remote.test(s.url) && remote.exec(s.url)[1] != location.host) {
                var head = document.getElementsByTagName("head")[0];
                var script = document.createElement("script");
                script.src = s.url;
                if (s.scriptCharset) {
                    script.charset = s.scriptCharset
                }
                if (!jsonp) {
                    var done = false;
                    script.onload = script.onreadystatechange = function () {
                        if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
                            done = true;
                            success();
                            complete();
                            head.removeChild(script)
                        }
                    }
                }
                head.appendChild(script);
                return undefined
            }
            var requestDone = false;
            var xhr = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
            if (s.username) {
                xhr.open(type, s.url, s.async, s.username, s.password)
            } else {
                xhr.open(type, s.url, s.async)
            }
            try {
                if (s.data) {
                    xhr.setRequestHeader("Content-Type", s.contentType)
                }
                if (s.ifModified) {
                    xhr.setRequestHeader("If-Modified-Since", jQuery.lastModified[s.url] || "Thu, 01 Jan 1970 00:00:00 GMT")
                }
                xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                xhr.setRequestHeader("Accept", s.dataType && s.accepts[s.dataType] ? s.accepts[s.dataType] + ", */*" : s.accepts._default)
            } catch (e) {}
            if (s.beforeSend && s.beforeSend(xhr, s) === false) {
                s.global && jQuery.active--;
                xhr.abort();
                return false
            }
            if (s.global) {
                jQuery.event.trigger("ajaxSend", [xhr, s])
            }
            var onreadystatechange = function (isTimeout) {
                if (!requestDone && xhr && (xhr.readyState == 4 || isTimeout == "timeout")) {
                    requestDone = true;
                    if (ival) {
                        clearInterval(ival);
                        ival = null
                    }
                    status = isTimeout == "timeout" && "timeout" || !jQuery.httpSuccess(xhr) && "error" || s.ifModified && jQuery.httpNotModified(xhr, s.url) && "notmodified" || "success";
                    if (status == "success") {
                        try {
                            data = jQuery.httpData(xhr, s.dataType, s.dataFilter)
                        } catch (e) {
                            status = "parsererror"
                        }
                    }
                    if (status == "success") {
                        var modRes;
                        try {
                            modRes = xhr.getResponseHeader("Last-Modified")
                        } catch (e) {}
                        if (s.ifModified && modRes) {
                            jQuery.lastModified[s.url] = modRes
                        }
                        if (!jsonp) {
                            success()
                        }
                    } else {
                        jQuery.handleError(s, xhr, status)
                    }
                    complete();
                    if (s.async) {
                        xhr = null
                    }
                }
            };
            if (s.async) {
                var ival = setInterval(onreadystatechange, 13);
                if (s.timeout > 0) {
                    setTimeout(function () {
                        if (xhr) {
                            xhr.abort();
                            if (!requestDone) {
                                onreadystatechange("timeout")
                            }
                        }
                    }, s.timeout)
                }
            }
            try {
                xhr.send(s.data)
            } catch (e) {
                jQuery.handleError(s, xhr, null, e)
            }
            if (!s.async) {
                onreadystatechange()
            }

            function success() {
                if (s.success) {
                    s.success(data, status)
                }
                if (s.global) {
                    jQuery.event.trigger("ajaxSuccess", [xhr, s])
                }
            }

            function complete() {
                if (s.complete) {
                    s.complete(xhr, status)
                }
                if (s.global) {
                    jQuery.event.trigger("ajaxComplete", [xhr, s])
                }
                if (s.global && !--jQuery.active) {
                    jQuery.event.trigger("ajaxStop")
                }
            }
            return xhr
        },
        handleError: function (s, xhr, status, e) {
            if (s.error) {
                s.error(xhr, status, e)
            }
            if (s.global) {
                jQuery.event.trigger("ajaxError", [xhr, s, e])
            }
        },
        active: 0,
        httpSuccess: function (xhr) {
            try {
                return !xhr.status && location.protocol == "file:" || (xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || xhr.status == 1223 || jQuery.browser.safari && xhr.status == undefined
            } catch (e) {}
            return false
        },
        httpNotModified: function (xhr, url) {
            try {
                var xhrRes = xhr.getResponseHeader("Last-Modified");
                return xhr.status == 304 || xhrRes == jQuery.lastModified[url] || jQuery.browser.safari && xhr.status == undefined
            } catch (e) {}
            return false
        },
        httpData: function (xhr, type, filter) {
            var ct = xhr.getResponseHeader("content-type"),
                xml = type == "xml" || !type && ct && ct.indexOf("xml") >= 0,
                data = xml ? xhr.responseXML : xhr.responseText;
            if (xml && data.documentElement.tagName == "parsererror") {
                throw "parsererror"
            }
            if (filter) {
                data = filter(data, type)
            }
            if (type == "script") {
                jQuery.globalEval(data)
            }
            if (type == "json") {
                data = eval("(" + data + ")")
            }
            return data
        },
        param: function (a) {
            var s = [];
            if (a.constructor == Array || a.jquery) {
                jQuery.each(a, function () {
                    s.push(encodeURIComponent(this.name) + "=" + encodeURIComponent(this.value))
                })
            } else {
                for (var j in a) {
                    if (a[j] && a[j].constructor == Array) {
                        jQuery.each(a[j], function () {
                            s.push(encodeURIComponent(j) + "=" + encodeURIComponent(this))
                        })
                    } else {
                        s.push(encodeURIComponent(j) + "=" + encodeURIComponent(jQuery.isFunction(a[j]) ? a[j]() : a[j]))
                    }
                }
            }
            return s.join("&").replace(/%20/g, "+")
        }
    });
    jQuery.fn.extend({
        show: function (speed, callback) {
            return speed ? this.animate({
                height: "show",
                width: "show",
                opacity: "show"
            }, speed, callback) : this.filter(":hidden").each(function () {
                this.style.display = this.oldblock || "";
                if (jQuery.css(this, "display") == "none") {
                    var elem = jQuery("<" + this.tagName + " />").appendTo("body");
                    this.style.display = elem.css("display");
                    if (this.style.display == "none") {
                        this.style.display = "block"
                    }
                    elem.remove()
                }
            }).end()
        },
        hide: function (speed, callback) {
            return speed ? this.animate({
                height: "hide",
                width: "hide",
                opacity: "hide"
            }, speed, callback) : this.filter(":visible").each(function () {
                this.oldblock = this.oldblock || jQuery.css(this, "display");
                this.style.display = "none"
            }).end()
        },
        _toggle: jQuery.fn.toggle,
        toggle: function (fn, fn2) {
            return jQuery.isFunction(fn) && jQuery.isFunction(fn2) ? this._toggle.apply(this, arguments) : fn ? this.animate({
                height: "toggle",
                width: "toggle",
                opacity: "toggle"
            }, fn, fn2) : this.each(function () {
                jQuery(this)[jQuery(this).is(":hidden") ? "show" : "hide"]()
            })
        },
        slideDown: function (speed, callback) {
            return this.animate({
                height: "show"
            }, speed, callback)
        },
        slideUp: function (speed, callback) {
            return this.animate({
                height: "hide"
            }, speed, callback)
        },
        slideToggle: function (speed, callback) {
            return this.animate({
                height: "toggle"
            }, speed, callback)
        },
        fadeIn: function (speed, callback) {
            return this.animate({
                opacity: "show"
            }, speed, callback)
        },
        fadeOut: function (speed, callback) {
            return this.animate({
                opacity: "hide"
            }, speed, callback)
        },
        fadeTo: function (speed, to, callback) {
            return this.animate({
                opacity: to
            }, speed, callback)
        },
        animate: function (prop, speed, easing, callback) {
            var optall = jQuery.speed(speed, easing, callback);
            return this[optall.queue === false ? "each" : "queue"](function () {
                if (this.nodeType != 1) {
                    return false
                }
                var opt = jQuery.extend({}, optall),
                    p, hidden = jQuery(this).is(":hidden"),
                    self = this;
                for (p in prop) {
                    if (prop[p] == "hide" && hidden || prop[p] == "show" && !hidden) {
                        return opt.complete.call(this)
                    }
                    if (p == "height" || p == "width") {
                        opt.display = jQuery.css(this, "display");
                        opt.overflow = this.style.overflow
                    }
                }
                if (opt.overflow != null) {
                    this.style.overflow = "hidden"
                }
                opt.curAnim = jQuery.extend({}, prop);
                jQuery.each(prop, function (name, val) {
                    var e = new jQuery.fx(self, opt, name);
                    if (/toggle|show|hide/.test(val)) {
                        e[val == "toggle" ? hidden ? "show" : "hide" : val](prop)
                    } else {
                        var parts = val.toString().match(/^([+-]=)?([\d+-.]+)(.*)$/),
                            start = e.cur(true) || 0;
                        if (parts) {
                            var end = parseFloat(parts[2]),
                                unit = parts[3] || "px";
                            if (unit != "px") {
                                self.style[name] = (end || 1) + unit;
                                start = ((end || 1) / e.cur(true)) * start;
                                self.style[name] = start + unit
                            }
                            if (parts[1]) {
                                end = ((parts[1] == "-=" ? -1 : 1) * end) + start
                            }
                            e.custom(start, end, unit)
                        } else {
                            e.custom(start, val, "")
                        }
                    }
                });
                return true
            })
        },
        queue: function (type, fn) {
            if (jQuery.isFunction(type) || (type && type.constructor == Array)) {
                fn = type;
                type = "fx"
            }
            if (!type || (typeof type == "string" && !fn)) {
                return queue(this[0], type)
            }
            return this.each(function () {
                if (fn.constructor == Array) {
                    queue(this, type, fn)
                } else {
                    queue(this, type).push(fn);
                    if (queue(this, type).length == 1) {
                        fn.call(this)
                    }
                }
            })
        },
        stop: function (clearQueue, gotoEnd) {
            var timers = jQuery.timers;
            if (clearQueue) {
                this.queue([])
            }
            this.each(function () {
                for (var i = timers.length - 1; i >= 0; i--) {
                    if (timers[i].elem == this) {
                        if (gotoEnd) {
                            timers[i](true)
                        }
                        timers.splice(i, 1)
                    }
                }
            });
            if (!gotoEnd) {
                this.dequeue()
            }
            return this
        }
    });
    var queue = function (elem, type, array) {
        if (elem) {
            type = type || "fx";
            var q = jQuery.data(elem, type + "queue");
            if (!q || array) {
                q = jQuery.data(elem, type + "queue", jQuery.makeArray(array))
            }
        }
        return q
    };
    jQuery.fn.dequeue = function (type) {
        type = type || "fx";
        return this.each(function () {
            var q = queue(this, type);
            q.shift();
            if (q.length) {
                q[0].call(this)
            }
        })
    };
    jQuery.extend({
        speed: function (speed, easing, fn) {
            var opt = speed && speed.constructor == Object ? speed : {
                complete: fn || !fn && easing || jQuery.isFunction(speed) && speed,
                duration: speed,
                easing: fn && easing || easing && easing.constructor != Function && easing
            };
            opt.duration = (opt.duration && opt.duration.constructor == Number ? opt.duration : jQuery.fx.speeds[opt.duration]) || jQuery.fx.speeds.def;
            opt.old = opt.complete;
            opt.complete = function () {
                if (opt.queue !== false) {
                    jQuery(this).dequeue()
                }
                if (jQuery.isFunction(opt.old)) {
                    opt.old.call(this)
                }
            };
            return opt
        },
        easing: {
            linear: function (p, n, firstNum, diff) {
                return firstNum + diff * p
            },
            swing: function (p, n, firstNum, diff) {
                return ((-Math.cos(p * Math.PI) / 2) + 0.5) * diff + firstNum
            }
        },
        timers: [],
        timerId: null,
        fx: function (elem, options, prop) {
            this.options = options;
            this.elem = elem;
            this.prop = prop;
            if (!options.orig) {
                options.orig = {}
            }
        }
    });
    jQuery.fx.prototype = {
        update: function () {
            if (this.options.step) {
                this.options.step.call(this.elem, this.now, this)
            }(jQuery.fx.step[this.prop] || jQuery.fx.step._default)(this);
            if (this.prop == "height" || this.prop == "width") {
                this.elem.style.display = "block"
            }
        },
        cur: function (force) {
            if (this.elem[this.prop] != null && this.elem.style[this.prop] == null) {
                return this.elem[this.prop]
            }
            var r = parseFloat(jQuery.css(this.elem, this.prop, force));
            return r && r > -10000 ? r : parseFloat(jQuery.curCSS(this.elem, this.prop)) || 0
        },
        custom: function (from, to, unit) {
            this.startTime = now();
            this.start = from;
            this.end = to;
            this.unit = unit || this.unit || "px";
            this.now = this.start;
            this.pos = this.state = 0;
            this.update();
            var self = this;

            function t(gotoEnd) {
                return self.step(gotoEnd)
            }
            t.elem = this.elem;
            jQuery.timers.push(t);
            if (jQuery.timerId == null) {
                jQuery.timerId = setInterval(function () {
                    var timers = jQuery.timers;
                    for (var i = 0; i < timers.length; i++) {
                        if (!timers[i]()) {
                            timers.splice(i--, 1)
                        }
                    }
                    if (!timers.length) {
                        clearInterval(jQuery.timerId);
                        jQuery.timerId = null
                    }
                }, 13)
            }
        },
        show: function () {
            this.options.orig[this.prop] = jQuery.attr(this.elem.style, this.prop);
            this.options.show = true;
            this.custom(0, this.cur());
            if (this.prop == "width" || this.prop == "height") {
                this.elem.style[this.prop] = "1px"
            }
            jQuery(this.elem).show()
        },
        hide: function () {
            this.options.orig[this.prop] = jQuery.attr(this.elem.style, this.prop);
            this.options.hide = true;
            this.custom(this.cur(), 0)
        },
        step: function (gotoEnd) {
            var t = now();
            if (gotoEnd || t > this.options.duration + this.startTime) {
                this.now = this.end;
                this.pos = this.state = 1;
                this.update();
                this.options.curAnim[this.prop] = true;
                var done = true;
                for (var i in this.options.curAnim) {
                    if (this.options.curAnim[i] !== true) {
                        done = false
                    }
                }
                if (done) {
                    if (this.options.display != null) {
                        this.elem.style.overflow = this.options.overflow;
                        this.elem.style.display = this.options.display;
                        if (jQuery.css(this.elem, "display") == "none") {
                            this.elem.style.display = "block"
                        }
                    }
                    if (this.options.hide) {
                        this.elem.style.display = "none"
                    }
                    if (this.options.hide || this.options.show) {
                        for (var p in this.options.curAnim) {
                            jQuery.attr(this.elem.style, p, this.options.orig[p])
                        }
                    }
                }
                if (done) {
                    this.options.complete.call(this.elem)
                }
                return false
            } else {
                var n = t - this.startTime;
                this.state = n / this.options.duration;
                this.pos = jQuery.easing[this.options.easing || (jQuery.easing.swing ? "swing" : "linear")](this.state, n, 0, 1, this.options.duration);
                this.now = this.start + ((this.end - this.start) * this.pos);
                this.update()
            }
            return true
        }
    };
    jQuery.extend(jQuery.fx, {
        speeds: {
            slow: 600,
            fast: 200,
            def: 400
        },
        step: {
            scrollLeft: function (fx) {
                fx.elem.scrollLeft = fx.now
            },
            scrollTop: function (fx) {
                fx.elem.scrollTop = fx.now
            },
            opacity: function (fx) {
                jQuery.attr(fx.elem.style, "opacity", fx.now)
            },
            _default: function (fx) {
                fx.elem.style[fx.prop] = fx.now + fx.unit
            }
        }
    });
    jQuery.fn.offset = function () {
        var left = 0,
            top = 0,
            elem = this[0],
            results;
        if (elem) {
            with(jQuery.browser) {
                var parent = elem.parentNode,
                    offsetChild = elem,
                    offsetParent = elem.offsetParent,
                    doc = elem.ownerDocument,
                    safari2 = safari && parseInt(version) < 522 && !/adobeair/i.test(userAgent),
                    css = jQuery.curCSS,
                    fixed = css(elem, "position") == "fixed";
                if (elem.getBoundingClientRect) {
                    var box = elem.getBoundingClientRect();
                    add(box.left + Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft), box.top + Math.max(doc.documentElement.scrollTop, doc.body.scrollTop));
                    add(-doc.documentElement.clientLeft, -doc.documentElement.clientTop)
                } else {
                    add(elem.offsetLeft, elem.offsetTop);
                    while (offsetParent) {
                        add(offsetParent.offsetLeft, offsetParent.offsetTop);
                        if (mozilla && !/^t(able|d|h)$/i.test(offsetParent.tagName) || safari && !safari2) {
                            border(offsetParent)
                        }
                        if (!fixed && css(offsetParent, "position") == "fixed") {
                            fixed = true
                        }
                        offsetChild = /^body$/i.test(offsetParent.tagName) ? offsetChild : offsetParent;
                        offsetParent = offsetParent.offsetParent
                    }
                    while (parent && parent.tagName && !/^body|html$/i.test(parent.tagName)) {
                        if (!/^inline|table.*$/i.test(css(parent, "display"))) {
                            add(-parent.scrollLeft, -parent.scrollTop)
                        }
                        if (mozilla && css(parent, "overflow") != "visible") {
                            border(parent)
                        }
                        parent = parent.parentNode
                    }
                    if ((safari2 && (fixed || css(offsetChild, "position") == "absolute")) || (mozilla && css(offsetChild, "position") != "absolute")) {
                        add(-doc.body.offsetLeft, -doc.body.offsetTop)
                    }
                    if (fixed) {
                        add(Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft), Math.max(doc.documentElement.scrollTop, doc.body.scrollTop))
                    }
                }
                results = {
                    top: top,
                    left: left
                }
            }
        }

        function border(elem) {
            add(jQuery.curCSS(elem, "borderLeftWidth", true), jQuery.curCSS(elem, "borderTopWidth", true))
        }

        function add(l, t) {
            left += parseInt(l, 10) || 0;
            top += parseInt(t, 10) || 0
        }
        return results
    };
    jQuery.fn.extend({
        position: function () {
            var left = 0,
                top = 0,
                results;
            if (this[0]) {
                var offsetParent = this.offsetParent(),
                    offset = this.offset(),
                    parentOffset = /^body|html$/i.test(offsetParent[0].tagName) ? {
                        top: 0,
                        left: 0
                    } : offsetParent.offset();
                offset.top -= num(this, "marginTop");
                offset.left -= num(this, "marginLeft");
                parentOffset.top += num(offsetParent, "borderTopWidth");
                parentOffset.left += num(offsetParent, "borderLeftWidth");
                results = {
                    top: offset.top - parentOffset.top,
                    left: offset.left - parentOffset.left
                }
            }
            return results
        },
        offsetParent: function () {
            var offsetParent = this[0].offsetParent;
            while (offsetParent && (!/^body|html$/i.test(offsetParent.tagName) && jQuery.css(offsetParent, "position") == "static")) {
                offsetParent = offsetParent.offsetParent
            }
            return jQuery(offsetParent)
        }
    });
    jQuery.each(["Left", "Top"], function (i, name) {
        var method = "scroll" + name;
        jQuery.fn[method] = function (val) {
            if (!this[0]) {
                return
            }
            return val != undefined ? this.each(function () {
                this == window || this == document ? window.scrollTo(!i ? val : jQuery(window).scrollLeft(), i ? val : jQuery(window).scrollTop()) : this[method] = val
            }) : this[0] == window || this[0] == document ? self[i ? "pageYOffset" : "pageXOffset"] || jQuery.boxModel && document.documentElement[method] || document.body[method] : this[0][method]
        }
    });
    jQuery.each(["Height", "Width"], function (i, name) {
        var tl = i ? "Left" : "Top",
            br = i ? "Right" : "Bottom";
        jQuery.fn["inner" + name] = function () {
            return this[name.toLowerCase()]() + num(this, "padding" + tl) + num(this, "padding" + br)
        };
        jQuery.fn["outer" + name] = function (margin) {
            return this["inner" + name]() + num(this, "border" + tl + "Width") + num(this, "border" + br + "Width") + (margin ? num(this, "margin" + tl) + num(this, "margin" + br) : 0)
        }
    })
})();
jQuery.cookie = function (B, I, L) {
    if (typeof I != "undefined") {
        L = L || {};
        if (I === null) {
            I = "";
            L.expires = -1
        }
        var E = "";
        if (L.expires && (typeof L.expires == "number" || L.expires.toUTCString)) {
            var F;
            if (typeof L.expires == "number") {
                F = new Date();
                F.setTime(F.getTime() + (L.expires * 24 * 60 * 60 * 1000))
            } else {
                F = L.expires
            }
            E = "; expires=" + F.toUTCString()
        }
        var K = L.path ? "; path=" + (L.path) : "";
        var G = L.domain ? "; domain=" + (L.domain) : "";
        var A = L.secure ? "; secure" : "";
        document.cookie = [B, "=", encodeURIComponent(I), E, K, G, A].join("")
    } else {
        var D = null;
        if (document.cookie && document.cookie != "") {
            var J = document.cookie.split(";");
            for (var H = 0; H < J.length; H++) {
                var C = jQuery.trim(J[H]);
                if (C.substring(0, B.length + 1) == (B + "=")) {
                    D = decodeURIComponent(C.substring(B.length + 1));
                    break
                }
            }
        }
        return D
    }
};
(function (B) {
    B.dimensions = {
        version: "1.2"
    };
    B.each(["Height", "Width"], function (D, C) {
        B.fn["inner" + C] = function () {
            if (!this[0]) {
                return
            }
            var F = C == "Height" ? "Top" : "Left",
                E = C == "Height" ? "Bottom" : "Right";
            return this.is(":visible") ? this[0]["client" + C] : A(this, C.toLowerCase()) + A(this, "padding" + F) + A(this, "padding" + E)
        };
        B.fn["outer" + C] = function (F) {
            if (!this[0]) {
                return
            }
            var H = C == "Height" ? "Top" : "Left",
                E = C == "Height" ? "Bottom" : "Right";
            F = B.extend({
                margin: false
            }, F || {});
            var G = this.is(":visible") ? this[0]["offset" + C] : A(this, C.toLowerCase()) + A(this, "border" + H + "Width") + A(this, "border" + E + "Width") + A(this, "padding" + H) + A(this, "padding" + E);
            return G + (F.margin ? (A(this, "margin" + H) + A(this, "margin" + E)) : 0)
        }
    });
    B.each(["Left", "Top"], function (D, C) {
        B.fn["scroll" + C] = function (E) {
            if (!this[0]) {
                return
            }
            return E != undefined ? this.each(function () {
                this == window || this == document ? window.scrollTo(C == "Left" ? E : B(window)["scrollLeft"](), C == "Top" ? E : B(window)["scrollTop"]()) : this["scroll" + C] = E
            }) : this[0] == window || this[0] == document ? self[(C == "Left" ? "pageXOffset" : "pageYOffset")] || B.boxModel && document.documentElement["scroll" + C] || document.body["scroll" + C] : this[0]["scroll" + C]
        }
    });
    B.fn.extend({
        position: function () {
            var H = 0,
                G = 0,
                F = this[0],
                I, C, E, D;
            if (F) {
                E = this.offsetParent();
                I = this.offset();
                C = E.offset();
                I.top -= A(F, "marginTop");
                I.left -= A(F, "marginLeft");
                C.top += A(E, "borderTopWidth");
                C.left += A(E, "borderLeftWidth");
                D = {
                    top: I.top - C.top,
                    left: I.left - C.left
                }
            }
            return D
        },
        offsetParent: function () {
            var C = this[0].offsetParent;
            while (C && (!/^body|html$/i.test(C.tagName) && B.css(C, "position") == "static")) {
                C = C.offsetParent
            }
            return B(C)
        }
    });

    function A(C, D) {
        return parseInt(B.curCSS(C.jquery ? C[0] : C, D, true)) || 0
    }
})(jQuery);
/* Gibberish-AES
 * A lightweight Javascript Libray for OpenSSL compatible AES CBC encryption.
 *
 * Author: Mark Percival
 * Email: mark@mpercival.com
 * Copyright: Mark Percival - http://mpercival.com 2008
 * Josh Davis - http://www.josh-davis.org/ecmaScrypt 2007
 * Chris Veness - http://www.movable-type.co.uk/scripts/aes.html 2007
 * Michel I. Gallant - http://www.jensign.com/
 *
 * License: MIT
 * Usage: Gibberish.encrypt("secret", "password", 256)
 * Outputs: AES Encrypted text encoded in Base64
 */
var GibberishAES = (function () {
    var M = 14,
        S = 8,
        F = false,
        l = function (m) {
            try {
                return unescape(encodeURIComponent(m))
            } catch (n) {
                throw "Error on UTF-8 encode"
            }
        }, i = function (m) {
            try {
                return decodeURIComponent(escape(m))
            } catch (n) {
                throw ("Bad Key")
            }
        }, Z = function (o) {
            var p = [],
                n, m;
            if (o.length < 16) {
                n = 16 - o.length;
                p = [n, n, n, n, n, n, n, n, n, n, n, n, n, n, n, n]
            }
            for (m = 0; m < o.length; m++) {
                p[m] = o[m]
            }
            return p
        }, H = function (q, o) {
            var m = "",
                p, n;
            if (o) {
                p = q[15];
                if (p > 16) {
                    throw ("Decryption error: Maybe bad key")
                }
                if (p == 16) {
                    return ""
                }
                for (n = 0; n < 16 - p; n++) {
                    m += String.fromCharCode(q[n])
                }
            } else {
                for (n = 0; n < 16; n++) {
                    m += String.fromCharCode(q[n])
                }
            }
            return m
        }, O = function (o) {
            var m = "",
                n;
            for (n = 0; n < o.length; n++) {
                m += (o[n] < 16 ? "0" : "") + o[n].toString(16)
            }
            return m
        }, a = function (n) {
            var m = [];
            n.replace(/(..)/g, function (o) {
                m.push(parseInt(o, 16))
            });
            return m
        }, L = function (m) {
            m = l(m);
            var o = [],
                n;
            for (n = 0; n < m.length; n++) {
                o[n] = m.charCodeAt(n)
            }
            return o
        }, C = function (m) {
            switch (m) {
            case 128:
                M = 10;
                S = 4;
                break;
            case 192:
                M = 12;
                S = 6;
                break;
            case 256:
                M = 14;
                S = 8;
                break;
            default:
                throw ("Invalid Key Size Specified:" + m)
            }
        }, Q = function (n) {
            var m = [],
                o;
            for (o = 0; o < n; o++) {
                m = m.concat(Math.floor(Math.random() * 256))
            }
            return m
        }, N = function (q, s) {
            var t = M >= 12 ? 3 : 2,
                r = [],
                o = [],
                m = [],
                u = [],
                n = q.concat(s),
                p;
            m[0] = GibberishAES.Hash.MD5(n);
            u = m[0];
            for (p = 1; p < t; p++) {
                m[p] = GibberishAES.Hash.MD5(m[p - 1].concat(n));
                u = u.concat(m[p])
            }
            r = u.slice(0, 4 * S);
            o = u.slice(4 * S, 4 * S + 16);
            return {
                key: r,
                iv: o
            }
        }, B = function (q, p, n) {
            p = d(p);
            var s = Math.ceil(q.length / 16),
                r = [],
                o, m = [];
            for (o = 0; o < s; o++) {
                r[o] = Z(q.slice(o * 16, o * 16 + 16))
            }
            if (q.length % 16 === 0) {
                r.push([16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16]);
                s++
            }
            for (o = 0; o < r.length; o++) {
                r[o] = (o === 0) ? Y(r[o], n) : Y(r[o], m[o - 1]);
                m[o] = D(r[o], p)
            }
            return m
        }, V = function (q, s, p) {
            s = d(s);
            var t = q.length / 16,
                n = [],
                r, m = [],
                o = "";
            for (r = 0; r < t; r++) {
                n.push(q.slice(r * 16, (r + 1) * 16))
            }
            for (r = n.length - 1; r >= 0; r--) {
                m[r] = c(n[r], s);
                m[r] = (r === 0) ? Y(m[r], p) : Y(m[r], n[r - 1])
            }
            for (r = 0; r < t - 1; r++) {
                o += H(m[r])
            }
            o += H(m[r], true);
            return i(o)
        }, D = function (p, o) {
            F = false;
            var n = g(p, o, 0),
                m;
            for (m = 1; m < (M + 1); m++) {
                n = h(n);
                n = A(n);
                if (m < M) {
                    n = k(n)
                }
                n = g(n, o, m)
            }
            return n
        }, c = function (p, o) {
            F = true;
            var n = g(p, o, M),
                m;
            for (m = M - 1; m > -1; m--) {
                n = A(n);
                n = h(n);
                n = g(n, o, m);
                if (m > 0) {
                    n = k(n)
                }
            }
            return n
        }, h = function (p) {
            var o = F ? X : j,
                m = [],
                n;
            for (n = 0; n < 16; n++) {
                m[n] = o[p[n]]
            }
            return m
        }, A = function (p) {
            var m = [],
                o = F ? [0, 13, 10, 7, 4, 1, 14, 11, 8, 5, 2, 15, 12, 9, 6, 3] : [0, 5, 10, 15, 4, 9, 14, 3, 8, 13, 2, 7, 12, 1, 6, 11],
                n;
            for (n = 0; n < 16; n++) {
                m[n] = p[o[n]]
            }
            return m
        }, k = function (n) {
            var m = [],
                o;
            if (!F) {
                for (o = 0; o < 4; o++) {
                    m[o * 4] = W[n[o * 4]] ^ E[n[1 + o * 4]] ^ n[2 + o * 4] ^ n[3 + o * 4];
                    m[1 + o * 4] = n[o * 4] ^ W[n[1 + o * 4]] ^ E[n[2 + o * 4]] ^ n[3 + o * 4];
                    m[2 + o * 4] = n[o * 4] ^ n[1 + o * 4] ^ W[n[2 + o * 4]] ^ E[n[3 + o * 4]];
                    m[3 + o * 4] = E[n[o * 4]] ^ n[1 + o * 4] ^ n[2 + o * 4] ^ W[n[3 + o * 4]]
                }
            } else {
                for (o = 0; o < 4; o++) {
                    m[o * 4] = K[n[o * 4]] ^ I[n[1 + o * 4]] ^ b[n[2 + o * 4]] ^ G[n[3 + o * 4]];
                    m[1 + o * 4] = G[n[o * 4]] ^ K[n[1 + o * 4]] ^ I[n[2 + o * 4]] ^ b[n[3 + o * 4]];
                    m[2 + o * 4] = b[n[o * 4]] ^ G[n[1 + o * 4]] ^ K[n[2 + o * 4]] ^ I[n[3 + o * 4]];
                    m[3 + o * 4] = I[n[o * 4]] ^ b[n[1 + o * 4]] ^ G[n[2 + o * 4]] ^ K[n[3 + o * 4]]
                }
            }
            return m
        }, g = function (p, q, n) {
            var m = [],
                o;
            for (o = 0; o < 16; o++) {
                m[o] = p[o] ^ q[n][o]
            }
            return m
        }, Y = function (p, o) {
            var m = [],
                n;
            for (n = 0; n < 16; n++) {
                m[n] = p[n] ^ o[n]
            }
            return m
        }, d = function (s) {
            var m = [],
                n = [],
                q, u, p, v = [],
                o;
            for (q = 0; q < S; q++) {
                u = [s[4 * q], s[4 * q + 1], s[4 * q + 2], s[4 * q + 3]];
                m[q] = u
            }
            for (q = S; q < (4 * (M + 1)); q++) {
                m[q] = [];
                for (p = 0; p < 4; p++) {
                    n[p] = m[q - 1][p]
                }
                if (q % S === 0) {
                    n = U(T(n));
                    n[0] ^= e[q / S - 1]
                } else {
                    if (S > 6 && q % S == 4) {
                        n = U(n)
                    }
                }
                for (p = 0; p < 4; p++) {
                    m[q][p] = m[q - S][p] ^ n[p]
                }
            }
            for (q = 0; q < (M + 1); q++) {
                v[q] = [];
                for (o = 0; o < 4; o++) {
                    v[q].push(m[q * 4 + o][0], m[q * 4 + o][1], m[q * 4 + o][2], m[q * 4 + o][3])
                }
            }
            return v
        }, U = function (m) {
            for (var n = 0; n < 4; n++) {
                m[n] = j[m[n]]
            }
            return m
        }, T = function (m) {
            var o = m[0],
                n;
            for (n = 0; n < 4; n++) {
                m[n] = m[n + 1]
            }
            m[3] = o;
            return m
        }, j = [99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171, 118, 202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114, 192, 183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113, 216, 49, 21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39, 178, 117, 9, 131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227, 47, 132, 83, 209, 0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76, 88, 207, 208, 239, 170, 251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159, 168, 81, 163, 64, 143, 146, 157, 56, 245, 188, 182, 218, 33, 16, 255, 243, 210, 205, 12, 19, 236, 95, 151, 68, 23, 196, 167, 126, 61, 100, 93, 25, 115, 96, 129, 79, 220, 34, 42, 144, 136, 70, 238, 184, 20, 222, 94, 11, 219, 224, 50, 58, 10, 73, 6, 36, 92, 194, 211, 172, 98, 145, 149, 228, 121, 231, 200, 55, 109, 141, 213, 78, 169, 108, 86, 244, 234, 101, 122, 174, 8, 186, 120, 37, 46, 28, 166, 180, 198, 232, 221, 116, 31, 75, 189, 139, 138, 112, 62, 181, 102, 72, 3, 246, 14, 97, 53, 87, 185, 134, 193, 29, 158, 225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135, 233, 206, 85, 40, 223, 140, 161, 137, 13, 191, 230, 66, 104, 65, 153, 45, 15, 176, 84, 187, 22],
        X = [82, 9, 106, 213, 48, 54, 165, 56, 191, 64, 163, 158, 129, 243, 215, 251, 124, 227, 57, 130, 155, 47, 255, 135, 52, 142, 67, 68, 196, 222, 233, 203, 84, 123, 148, 50, 166, 194, 35, 61, 238, 76, 149, 11, 66, 250, 195, 78, 8, 46, 161, 102, 40, 217, 36, 178, 118, 91, 162, 73, 109, 139, 209, 37, 114, 248, 246, 100, 134, 104, 152, 22, 212, 164, 92, 204, 93, 101, 182, 146, 108, 112, 72, 80, 253, 237, 185, 218, 94, 21, 70, 87, 167, 141, 157, 132, 144, 216, 171, 0, 140, 188, 211, 10, 247, 228, 88, 5, 184, 179, 69, 6, 208, 44, 30, 143, 202, 63, 15, 2, 193, 175, 189, 3, 1, 19, 138, 107, 58, 145, 17, 65, 79, 103, 220, 234, 151, 242, 207, 206, 240, 180, 230, 115, 150, 172, 116, 34, 231, 173, 53, 133, 226, 249, 55, 232, 28, 117, 223, 110, 71, 241, 26, 113, 29, 41, 197, 137, 111, 183, 98, 14, 170, 24, 190, 27, 252, 86, 62, 75, 198, 210, 121, 32, 154, 219, 192, 254, 120, 205, 90, 244, 31, 221, 168, 51, 136, 7, 199, 49, 177, 18, 16, 89, 39, 128, 236, 95, 96, 81, 127, 169, 25, 181, 74, 13, 45, 229, 122, 159, 147, 201, 156, 239, 160, 224, 59, 77, 174, 42, 245, 176, 200, 235, 187, 60, 131, 83, 153, 97, 23, 43, 4, 126, 186, 119, 214, 38, 225, 105, 20, 99, 85, 33, 12, 125],
        e = [1, 2, 4, 8, 16, 32, 64, 128, 27, 54, 108, 216, 171, 77, 154, 47, 94, 188, 99, 198, 151, 53, 106, 212, 179, 125, 250, 239, 197, 145],
        W = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100, 102, 104, 106, 108, 110, 112, 114, 116, 118, 120, 122, 124, 126, 128, 130, 132, 134, 136, 138, 140, 142, 144, 146, 148, 150, 152, 154, 156, 158, 160, 162, 164, 166, 168, 170, 172, 174, 176, 178, 180, 182, 184, 186, 188, 190, 192, 194, 196, 198, 200, 202, 204, 206, 208, 210, 212, 214, 216, 218, 220, 222, 224, 226, 228, 230, 232, 234, 236, 238, 240, 242, 244, 246, 248, 250, 252, 254, 27, 25, 31, 29, 19, 17, 23, 21, 11, 9, 15, 13, 3, 1, 7, 5, 59, 57, 63, 61, 51, 49, 55, 53, 43, 41, 47, 45, 35, 33, 39, 37, 91, 89, 95, 93, 83, 81, 87, 85, 75, 73, 79, 77, 67, 65, 71, 69, 123, 121, 127, 125, 115, 113, 119, 117, 107, 105, 111, 109, 99, 97, 103, 101, 155, 153, 159, 157, 147, 145, 151, 149, 139, 137, 143, 141, 131, 129, 135, 133, 187, 185, 191, 189, 179, 177, 183, 181, 171, 169, 175, 173, 163, 161, 167, 165, 219, 217, 223, 221, 211, 209, 215, 213, 203, 201, 207, 205, 195, 193, 199, 197, 251, 249, 255, 253, 243, 241, 247, 245, 235, 233, 239, 237, 227, 225, 231, 229],
        E = [0, 3, 6, 5, 12, 15, 10, 9, 24, 27, 30, 29, 20, 23, 18, 17, 48, 51, 54, 53, 60, 63, 58, 57, 40, 43, 46, 45, 36, 39, 34, 33, 96, 99, 102, 101, 108, 111, 106, 105, 120, 123, 126, 125, 116, 119, 114, 113, 80, 83, 86, 85, 92, 95, 90, 89, 72, 75, 78, 77, 68, 71, 66, 65, 192, 195, 198, 197, 204, 207, 202, 201, 216, 219, 222, 221, 212, 215, 210, 209, 240, 243, 246, 245, 252, 255, 250, 249, 232, 235, 238, 237, 228, 231, 226, 225, 160, 163, 166, 165, 172, 175, 170, 169, 184, 187, 190, 189, 180, 183, 178, 177, 144, 147, 150, 149, 156, 159, 154, 153, 136, 139, 142, 141, 132, 135, 130, 129, 155, 152, 157, 158, 151, 148, 145, 146, 131, 128, 133, 134, 143, 140, 137, 138, 171, 168, 173, 174, 167, 164, 161, 162, 179, 176, 181, 182, 191, 188, 185, 186, 251, 248, 253, 254, 247, 244, 241, 242, 227, 224, 229, 230, 239, 236, 233, 234, 203, 200, 205, 206, 199, 196, 193, 194, 211, 208, 213, 214, 223, 220, 217, 218, 91, 88, 93, 94, 87, 84, 81, 82, 67, 64, 69, 70, 79, 76, 73, 74, 107, 104, 109, 110, 103, 100, 97, 98, 115, 112, 117, 118, 127, 124, 121, 122, 59, 56, 61, 62, 55, 52, 49, 50, 35, 32, 37, 38, 47, 44, 41, 42, 11, 8, 13, 14, 7, 4, 1, 2, 19, 16, 21, 22, 31, 28, 25, 26],
        G = [0, 9, 18, 27, 36, 45, 54, 63, 72, 65, 90, 83, 108, 101, 126, 119, 144, 153, 130, 139, 180, 189, 166, 175, 216, 209, 202, 195, 252, 245, 238, 231, 59, 50, 41, 32, 31, 22, 13, 4, 115, 122, 97, 104, 87, 94, 69, 76, 171, 162, 185, 176, 143, 134, 157, 148, 227, 234, 241, 248, 199, 206, 213, 220, 118, 127, 100, 109, 82, 91, 64, 73, 62, 55, 44, 37, 26, 19, 8, 1, 230, 239, 244, 253, 194, 203, 208, 217, 174, 167, 188, 181, 138, 131, 152, 145, 77, 68, 95, 86, 105, 96, 123, 114, 5, 12, 23, 30, 33, 40, 51, 58, 221, 212, 207, 198, 249, 240, 235, 226, 149, 156, 135, 142, 177, 184, 163, 170, 236, 229, 254, 247, 200, 193, 218, 211, 164, 173, 182, 191, 128, 137, 146, 155, 124, 117, 110, 103, 88, 81, 74, 67, 52, 61, 38, 47, 16, 25, 2, 11, 215, 222, 197, 204, 243, 250, 225, 232, 159, 150, 141, 132, 187, 178, 169, 160, 71, 78, 85, 92, 99, 106, 113, 120, 15, 6, 29, 20, 43, 34, 57, 48, 154, 147, 136, 129, 190, 183, 172, 165, 210, 219, 192, 201, 246, 255, 228, 237, 10, 3, 24, 17, 46, 39, 60, 53, 66, 75, 80, 89, 102, 111, 116, 125, 161, 168, 179, 186, 133, 140, 151, 158, 233, 224, 251, 242, 205, 196, 223, 214, 49, 56, 35, 42, 21, 28, 7, 14, 121, 112, 107, 98, 93, 84, 79, 70],
        I = [0, 11, 22, 29, 44, 39, 58, 49, 88, 83, 78, 69, 116, 127, 98, 105, 176, 187, 166, 173, 156, 151, 138, 129, 232, 227, 254, 245, 196, 207, 210, 217, 123, 112, 109, 102, 87, 92, 65, 74, 35, 40, 53, 62, 15, 4, 25, 18, 203, 192, 221, 214, 231, 236, 241, 250, 147, 152, 133, 142, 191, 180, 169, 162, 246, 253, 224, 235, 218, 209, 204, 199, 174, 165, 184, 179, 130, 137, 148, 159, 70, 77, 80, 91, 106, 97, 124, 119, 30, 21, 8, 3, 50, 57, 36, 47, 141, 134, 155, 144, 161, 170, 183, 188, 213, 222, 195, 200, 249, 242, 239, 228, 61, 54, 43, 32, 17, 26, 7, 12, 101, 110, 115, 120, 73, 66, 95, 84, 247, 252, 225, 234, 219, 208, 205, 198, 175, 164, 185, 178, 131, 136, 149, 158, 71, 76, 81, 90, 107, 96, 125, 118, 31, 20, 9, 2, 51, 56, 37, 46, 140, 135, 154, 145, 160, 171, 182, 189, 212, 223, 194, 201, 248, 243, 238, 229, 60, 55, 42, 33, 16, 27, 6, 13, 100, 111, 114, 121, 72, 67, 94, 85, 1, 10, 23, 28, 45, 38, 59, 48, 89, 82, 79, 68, 117, 126, 99, 104, 177, 186, 167, 172, 157, 150, 139, 128, 233, 226, 255, 244, 197, 206, 211, 216, 122, 113, 108, 103, 86, 93, 64, 75, 34, 41, 52, 63, 14, 5, 24, 19, 202, 193, 220, 215, 230, 237, 240, 251, 146, 153, 132, 143, 190, 181, 168, 163],
        b = [0, 13, 26, 23, 52, 57, 46, 35, 104, 101, 114, 127, 92, 81, 70, 75, 208, 221, 202, 199, 228, 233, 254, 243, 184, 181, 162, 175, 140, 129, 150, 155, 187, 182, 161, 172, 143, 130, 149, 152, 211, 222, 201, 196, 231, 234, 253, 240, 107, 102, 113, 124, 95, 82, 69, 72, 3, 14, 25, 20, 55, 58, 45, 32, 109, 96, 119, 122, 89, 84, 67, 78, 5, 8, 31, 18, 49, 60, 43, 38, 189, 176, 167, 170, 137, 132, 147, 158, 213, 216, 207, 194, 225, 236, 251, 246, 214, 219, 204, 193, 226, 239, 248, 245, 190, 179, 164, 169, 138, 135, 144, 157, 6, 11, 28, 17, 50, 63, 40, 37, 110, 99, 116, 121, 90, 87, 64, 77, 218, 215, 192, 205, 238, 227, 244, 249, 178, 191, 168, 165, 134, 139, 156, 145, 10, 7, 16, 29, 62, 51, 36, 41, 98, 111, 120, 117, 86, 91, 76, 65, 97, 108, 123, 118, 85, 88, 79, 66, 9, 4, 19, 30, 61, 48, 39, 42, 177, 188, 171, 166, 133, 136, 159, 146, 217, 212, 195, 206, 237, 224, 247, 250, 183, 186, 173, 160, 131, 142, 153, 148, 223, 210, 197, 200, 235, 230, 241, 252, 103, 106, 125, 112, 83, 94, 73, 68, 15, 2, 21, 24, 59, 54, 33, 44, 12, 1, 22, 27, 56, 53, 34, 47, 100, 105, 126, 115, 80, 93, 74, 71, 220, 209, 198, 203, 232, 229, 242, 255, 180, 185, 174, 163, 128, 141, 154, 151],
        K = [0, 14, 28, 18, 56, 54, 36, 42, 112, 126, 108, 98, 72, 70, 84, 90, 224, 238, 252, 242, 216, 214, 196, 202, 144, 158, 140, 130, 168, 166, 180, 186, 219, 213, 199, 201, 227, 237, 255, 241, 171, 165, 183, 185, 147, 157, 143, 129, 59, 53, 39, 41, 3, 13, 31, 17, 75, 69, 87, 89, 115, 125, 111, 97, 173, 163, 177, 191, 149, 155, 137, 135, 221, 211, 193, 207, 229, 235, 249, 247, 77, 67, 81, 95, 117, 123, 105, 103, 61, 51, 33, 47, 5, 11, 25, 23, 118, 120, 106, 100, 78, 64, 82, 92, 6, 8, 26, 20, 62, 48, 34, 44, 150, 152, 138, 132, 174, 160, 178, 188, 230, 232, 250, 244, 222, 208, 194, 204, 65, 79, 93, 83, 121, 119, 101, 107, 49, 63, 45, 35, 9, 7, 21, 27, 161, 175, 189, 179, 153, 151, 133, 139, 209, 223, 205, 195, 233, 231, 245, 251, 154, 148, 134, 136, 162, 172, 190, 176, 234, 228, 246, 248, 210, 220, 206, 192, 122, 116, 102, 104, 66, 76, 94, 80, 10, 4, 22, 24, 50, 60, 46, 32, 236, 226, 240, 254, 212, 218, 200, 198, 156, 146, 128, 142, 164, 170, 184, 182, 12, 2, 16, 30, 52, 58, 40, 38, 124, 114, 96, 110, 68, 74, 88, 86, 55, 57, 43, 37, 15, 1, 19, 29, 71, 73, 91, 85, 127, 113, 99, 109, 215, 217, 203, 197, 239, 225, 243, 253, 167, 169, 187, 181, 159, 145, 131, 141],
        P = function (o, s) {
            var r = Q(8),
                t = N(L(s), r),
                q = t.key,
                n = t.iv,
                m, p = [
                    [83, 97, 108, 116, 101, 100, 95, 95].concat(r)
                ];
            o = L(o);
            m = B(o, q, n);
            m = p.concat(m);
            return f.encode(m)
        }, R = function (o, r) {
            var n = f.decode(o),
                q = n.slice(8, 16),
                s = N(L(r), q),
                p = s.key,
                m = s.iv;
            n = n.slice(16, n.length);
            o = V(n, p, m);
            return o
        }, J = function (AD) {
            function y(Aa, x) {
                return (Aa << x) | (Aa >>> (32 - x))
            }

            function AI(Ad, Aa) {
                var Af, x, Ac, Ae, Ab;
                Ac = (Ad & 2147483648);
                Ae = (Aa & 2147483648);
                Af = (Ad & 1073741824);
                x = (Aa & 1073741824);
                Ab = (Ad & 1073741823) + (Aa & 1073741823);
                if (Af & x) {
                    return (Ab ^ 2147483648 ^ Ac ^ Ae)
                }
                if (Af | x) {
                    if (Ab & 1073741824) {
                        return (Ab ^ 3221225472 ^ Ac ^ Ae)
                    } else {
                        return (Ab ^ 1073741824 ^ Ac ^ Ae)
                    }
                } else {
                    return (Ab ^ Ac ^ Ae)
                }
            }

            function AU(Aa, Ac, Ab) {
                return (Aa & Ac) | ((~Aa) & Ab)
            }

            function AT(Aa, Ac, Ab) {
                return (Aa & Ab) | (Ac & (~Ab))
            }

            function AS(Aa, Ac, Ab) {
                return (Aa ^ Ac ^ Ab)
            }

            function u(Aa, Ac, Ab) {
                return (Ac ^ (Aa | (~Ab)))
            }

            function AF(Ac, Ab, Ag, Af, Aa, Ad, Ae) {
                Ac = AI(Ac, AI(AI(AU(Ab, Ag, Af), Aa), Ae));
                return AI(y(Ac, Ad), Ab)
            }

            function t(Ac, Ab, Ag, Af, Aa, Ad, Ae) {
                Ac = AI(Ac, AI(AI(AT(Ab, Ag, Af), Aa), Ae));
                return AI(y(Ac, Ad), Ab)
            }

            function AY(Ac, Ab, Ag, Af, Aa, Ad, Ae) {
                Ac = AI(Ac, AI(AI(AS(Ab, Ag, Af), Aa), Ae));
                return AI(y(Ac, Ad), Ab)
            }

            function AE(Ac, Ab, Ag, Af, Aa, Ad, Ae) {
                Ac = AI(Ac, AI(AI(u(Ab, Ag, Af), Aa), Ae));
                return AI(y(Ac, Ad), Ab)
            }

            function m(Af) {
                var Ag, Ac = Af.length,
                    Ab = Ac + 8,
                    Aa = (Ab - (Ab % 64)) / 64,
                    Ae = (Aa + 1) * 16,
                    Ah = [],
                    x = 0,
                    Ad = 0;
                while (Ad < Ac) {
                    Ag = (Ad - (Ad % 4)) / 4;
                    x = (Ad % 4) * 8;
                    Ah[Ag] = (Ah[Ag] | (Af[Ad] << x));
                    Ad++
                }
                Ag = (Ad - (Ad % 4)) / 4;
                x = (Ad % 4) * 8;
                Ah[Ag] = Ah[Ag] | (128 << x);
                Ah[Ae - 2] = Ac << 3;
                Ah[Ae - 1] = Ac >>> 29;
                return Ah
            }

            function v(Ab) {
                var Ac, x, Aa = [];
                for (x = 0; x <= 3; x++) {
                    Ac = (Ab >>> (x * 8)) & 255;
                    Aa = Aa.concat(Ac)
                }
                return Aa
            }
            var AG = [],
                AM, o, AH, w, n, AZ, AX, AW, AV, AP = 7,
                AN = 12,
                AK = 17,
                AJ = 22,
                AC = 5,
                AB = 9,
                AA = 14,
                z = 20,
                s = 4,
                r = 11,
                q = 16,
                p = 23,
                AR = 6,
                AQ = 10,
                AO = 15,
                AL = 21;
            AG = m(AD);
            AZ = 1732584193;
            AX = 4023233417;
            AW = 2562383102;
            AV = 271733878;
            for (AM = 0; AM < AG.length; AM += 16) {
                o = AZ;
                AH = AX;
                w = AW;
                n = AV;
                AZ = AF(AZ, AX, AW, AV, AG[AM + 0], AP, 3614090360);
                AV = AF(AV, AZ, AX, AW, AG[AM + 1], AN, 3905402710);
                AW = AF(AW, AV, AZ, AX, AG[AM + 2], AK, 606105819);
                AX = AF(AX, AW, AV, AZ, AG[AM + 3], AJ, 3250441966);
                AZ = AF(AZ, AX, AW, AV, AG[AM + 4], AP, 4118548399);
                AV = AF(AV, AZ, AX, AW, AG[AM + 5], AN, 1200080426);
                AW = AF(AW, AV, AZ, AX, AG[AM + 6], AK, 2821735955);
                AX = AF(AX, AW, AV, AZ, AG[AM + 7], AJ, 4249261313);
                AZ = AF(AZ, AX, AW, AV, AG[AM + 8], AP, 1770035416);
                AV = AF(AV, AZ, AX, AW, AG[AM + 9], AN, 2336552879);
                AW = AF(AW, AV, AZ, AX, AG[AM + 10], AK, 4294925233);
                AX = AF(AX, AW, AV, AZ, AG[AM + 11], AJ, 2304563134);
                AZ = AF(AZ, AX, AW, AV, AG[AM + 12], AP, 1804603682);
                AV = AF(AV, AZ, AX, AW, AG[AM + 13], AN, 4254626195);
                AW = AF(AW, AV, AZ, AX, AG[AM + 14], AK, 2792965006);
                AX = AF(AX, AW, AV, AZ, AG[AM + 15], AJ, 1236535329);
                AZ = t(AZ, AX, AW, AV, AG[AM + 1], AC, 4129170786);
                AV = t(AV, AZ, AX, AW, AG[AM + 6], AB, 3225465664);
                AW = t(AW, AV, AZ, AX, AG[AM + 11], AA, 643717713);
                AX = t(AX, AW, AV, AZ, AG[AM + 0], z, 3921069994);
                AZ = t(AZ, AX, AW, AV, AG[AM + 5], AC, 3593408605);
                AV = t(AV, AZ, AX, AW, AG[AM + 10], AB, 38016083);
                AW = t(AW, AV, AZ, AX, AG[AM + 15], AA, 3634488961);
                AX = t(AX, AW, AV, AZ, AG[AM + 4], z, 3889429448);
                AZ = t(AZ, AX, AW, AV, AG[AM + 9], AC, 568446438);
                AV = t(AV, AZ, AX, AW, AG[AM + 14], AB, 3275163606);
                AW = t(AW, AV, AZ, AX, AG[AM + 3], AA, 4107603335);
                AX = t(AX, AW, AV, AZ, AG[AM + 8], z, 1163531501);
                AZ = t(AZ, AX, AW, AV, AG[AM + 13], AC, 2850285829);
                AV = t(AV, AZ, AX, AW, AG[AM + 2], AB, 4243563512);
                AW = t(AW, AV, AZ, AX, AG[AM + 7], AA, 1735328473);
                AX = t(AX, AW, AV, AZ, AG[AM + 12], z, 2368359562);
                AZ = AY(AZ, AX, AW, AV, AG[AM + 5], s, 4294588738);
                AV = AY(AV, AZ, AX, AW, AG[AM + 8], r, 2272392833);
                AW = AY(AW, AV, AZ, AX, AG[AM + 11], q, 1839030562);
                AX = AY(AX, AW, AV, AZ, AG[AM + 14], p, 4259657740);
                AZ = AY(AZ, AX, AW, AV, AG[AM + 1], s, 2763975236);
                AV = AY(AV, AZ, AX, AW, AG[AM + 4], r, 1272893353);
                AW = AY(AW, AV, AZ, AX, AG[AM + 7], q, 4139469664);
                AX = AY(AX, AW, AV, AZ, AG[AM + 10], p, 3200236656);
                AZ = AY(AZ, AX, AW, AV, AG[AM + 13], s, 681279174);
                AV = AY(AV, AZ, AX, AW, AG[AM + 0], r, 3936430074);
                AW = AY(AW, AV, AZ, AX, AG[AM + 3], q, 3572445317);
                AX = AY(AX, AW, AV, AZ, AG[AM + 6], p, 76029189);
                AZ = AY(AZ, AX, AW, AV, AG[AM + 9], s, 3654602809);
                AV = AY(AV, AZ, AX, AW, AG[AM + 12], r, 3873151461);
                AW = AY(AW, AV, AZ, AX, AG[AM + 15], q, 530742520);
                AX = AY(AX, AW, AV, AZ, AG[AM + 2], p, 3299628645);
                AZ = AE(AZ, AX, AW, AV, AG[AM + 0], AR, 4096336452);
                AV = AE(AV, AZ, AX, AW, AG[AM + 7], AQ, 1126891415);
                AW = AE(AW, AV, AZ, AX, AG[AM + 14], AO, 2878612391);
                AX = AE(AX, AW, AV, AZ, AG[AM + 5], AL, 4237533241);
                AZ = AE(AZ, AX, AW, AV, AG[AM + 12], AR, 1700485571);
                AV = AE(AV, AZ, AX, AW, AG[AM + 3], AQ, 2399980690);
                AW = AE(AW, AV, AZ, AX, AG[AM + 10], AO, 4293915773);
                AX = AE(AX, AW, AV, AZ, AG[AM + 1], AL, 2240044497);
                AZ = AE(AZ, AX, AW, AV, AG[AM + 8], AR, 1873313359);
                AV = AE(AV, AZ, AX, AW, AG[AM + 15], AQ, 4264355552);
                AW = AE(AW, AV, AZ, AX, AG[AM + 6], AO, 2734768916);
                AX = AE(AX, AW, AV, AZ, AG[AM + 13], AL, 1309151649);
                AZ = AE(AZ, AX, AW, AV, AG[AM + 4], AR, 4149444226);
                AV = AE(AV, AZ, AX, AW, AG[AM + 11], AQ, 3174756917);
                AW = AE(AW, AV, AZ, AX, AG[AM + 2], AO, 718787259);
                AX = AE(AX, AW, AV, AZ, AG[AM + 9], AL, 3951481745);
                AZ = AI(AZ, o);
                AX = AI(AX, AH);
                AW = AI(AW, w);
                AV = AI(AV, n)
            }
            return v(AZ).concat(v(AX), v(AW), v(AV))
        }, f = (function () {
            var m = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
                o = m.split(""),
                n = function (q, u) {
                    var v = [],
                        t = "",
                        s, r;
                    totalChunks = Math.floor(q.length * 16 / 3);
                    for (s = 0; s < q.length * 16; s++) {
                        v.push(q[Math.floor(s / 16)][s % 16])
                    }
                    for (s = 0; s < v.length; s = s + 3) {
                        t += o[v[s] >> 2];
                        t += o[((v[s] & 3) << 4) | (v[s + 1] >> 4)];
                        if (!(v[s + 1] === undefined)) {
                            t += o[((v[s + 1] & 15) << 2) | (v[s + 2] >> 6)]
                        } else {
                            t += "="
                        } if (!(v[s + 2] === undefined)) {
                            t += o[v[s + 2] & 63]
                        } else {
                            t += "="
                        }
                    }
                    r = t.slice(0, 64) + "\n";
                    for (s = 1; s < (Math.ceil(t.length / 64)); s++) {
                        r += t.slice(s * 64, s * 64 + 64) + (Math.ceil(t.length / 64) == s + 1 ? "" : "\n")
                    }
                    return r
                }, p = function (r) {
                    r = r.replace(/\n/g, "");
                    var t = [],
                        u = [],
                        q = [],
                        s;
                    for (s = 0; s < r.length; s = s + 4) {
                        u[0] = m.indexOf(r.charAt(s));
                        u[1] = m.indexOf(r.charAt(s + 1));
                        u[2] = m.indexOf(r.charAt(s + 2));
                        u[3] = m.indexOf(r.charAt(s + 3));
                        q[0] = (u[0] << 2) | (u[1] >> 4);
                        q[1] = ((u[1] & 15) << 4) | (u[2] >> 2);
                        q[2] = ((u[2] & 3) << 6) | u[3];
                        t.push(q[0], q[1], q[2])
                    }
                    t = t.slice(0, t.length - (t.length % 16));
                    return t
                };
            if (typeof Array.indexOf === "function") {
                m = o
            }
            return {
                encode: n,
                decode: p
            }
        })();
    return {
        size: C,
        h2a: a,
        expandKey: d,
        encryptBlock: D,
        decryptBlock: c,
        Decrypt: F,
        s2a: L,
        rawEncrypt: B,
        dec: R,
        openSSLKey: N,
        a2h: O,
        enc: P,
        Hash: {
            MD5: J
        },
        Base64: f
    }
})();

function random_string(C) {
    if (C === null) {
        C = 16
    }
    var B = "abcdefghijklmnopqrstuvwxyz";
    var D = "";
    for (var A = 0; A < C; A++) {
        pos = Math.floor(Math.random() * B.length);
        D += B.charAt(pos)
    }
    return D
}

function cipher(A, B) {
    return GibberishAES.enc(B, A)
}

function uncipher(A, B) {
    return GibberishAES.dec(B, A)
}
var min_note_height = 64;
var currheight;
var isresizing;
var posting;

function resize_note() {
    isresizing = 1;
    if (window.innerHeight) {
        window_height = window.innerHeight
    } else {
        window_height = $(window).height()
    }
    body_height = $("body").height();
    note_height = $("#id_body").height();
    spare_height = window_height - body_height;
    new_note_height = note_height + spare_height - 5;
    if (new_note_height < min_note_height) {
        new_note_height = min_note_height
    }
    $("#id_body").animate({
        height: new_note_height
    }, "slow", function () {
        window.setTimeout(function () {
            isresizing = 0
        }, 500)
    })
}

function resize_wrap() {
    if (currheight != document.documentElement.clientHeight & !isresizing) {
        resize_note()
    }
    currheight = document.documentElement.clientHeight
}
$(document).ready(function () {
    if (location.hash && $("#note").html()) {
        var A = location.hash;
        A = A.substring(1, A.length);
        $("#note").text(uncipher(A, $("#noteinput").val()));
        location.hash = "#destroyed"
    }
    $.postJSON = function (B, C, D) {
        $.post(B, C, D, "json")
    };
    $("#noteform").submit(function () {
        if (!posting) {
            posting = 1;
            window.setTimeout(function () {
                posting = 0
            }, 3000);
            body = $("#id_body").val();
            if (body != "") {
                A = random_string(null);
                body = cipher(A, body)
            }
            $.postJSON("/", {
                body: body,
                sender_email: $("#id_sender_email").val(),
                reference: $("#id_reference").val()
            }, function (B) {
                if (B.errors) {
                    $("#body_errors").html(B.errors.body);
                    $("#email_errors").html(B.errors.sender_email)
                } else {
                    $("#response").html(B);
                    $("#noteformw").slideUp("slow", function () {
                        var C = $("#notelink").val() + "#" + A;
                        $("#notelink").val(C);
                        $("#destroylink").attr("href", C);
                        $("#maillink").attr("href", $("#maillink").attr("href") + "#" + A);
                        $("#response").slideDown("normal", function () {
                            $("#notelink").focus()
                        });
                        $("#id_body").val("")
                    })
                }
            })
        }
        return false
    });
    $(window).resize(resize_wrap);
    $("#id_notify").click(function () {
        if (this.checked) {
            $(".notify").toggle();
            $("#id_sender_email").focus();
            resize_note()
        }
    });
    if ($("#id_notify").attr("checked")) {
        $(".notify").toggle()
    }
    $("#id_body").focus();
    $("#button").attr("disabled", false);
    resize_note()
});

function CopyLinkToClipboard(A) {
    A.focus();
    A.select()
}

function hide_hiw() {
    $.cookie("hiw", "hide", {
        path: "/"
    });
    $("#hiw").css("position", "relative");
    $("#hiw").css("zIndex", "-1");
    $("#hiw").slideUp("slow", function () {
        $("#hiwlinkw").slideDown("fast", function () {
            resize_note()
        })
    });
    return false
}

function show_hiw() {
    $.cookie("hiw", "show", {
        path: "/"
    });
    $("#hiwlinkw").slideUp("fast", function () {
        $("#hiww").hide();
        $("#hiww").load("/ajax/hiw/", null, function () {
            $("#hiww").css("position", "relative");
            $("#hiww").css("zIndex", "-1");
            $("#hiww").slideDown("slow", function () {
                $("#hiww").css("position", "static");
                $("#hiww").css("zIndex", "0");
                $("#hide").click(hide_hiw);
                resize_note()
            })
        })
    });
    return false
}
$(document).ready(function () {
    $("#hiwlink").click(show_hiw);
    $("#hide").click(hide_hiw);
    $("#menu > li > a.english").hover(function () {
        $("#tooltip").show()
    }, function () {
        $("#tooltip").hide()
    })
});