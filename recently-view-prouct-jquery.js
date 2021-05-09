(function (a) {
   var r = a.fn.domManip,
      d = "_tmplitem",
      q = /^[^<]*(<[\w\W]+>)[^>]*$|\{\{\! /,
      b = {},
      f = {},
      e,
      p = { key: 0, data: {} },
      h = 0,
      c = 0,
      l = [];
   function g(e, d, g, i) {
      var c = {
         data: i || (d ? d.data : {}),
         _wrap: d ? d._wrap : null,
         tmpl: null,
         parent: d || null,
         nodes: [],
         calls: u,
         nest: w,
         wrap: x,
         html: v,
         update: t,
      };
      e && a.extend(c, e, { nodes: [], parent: d });
      if (g) {
         c.tmpl = g;
         c._ctnt = c._ctnt || c.tmpl(a, c);
         c.key = ++h;
         (l.length ? f : b)[h] = c;
      }
      return c;
   }
   a.each(
      {
         appendTo: "append",
         prependTo: "prepend",
         insertBefore: "before",
         insertAfter: "after",
         replaceAll: "replaceWith",
      },
      function (f, d) {
         a.fn[f] = function (n) {
            var g = [],
               i = a(n),
               k,
               h,
               m,
               l,
               j = this.length === 1 && this[0].parentNode;
            e = b || {};
            if (
               j &&
               j.nodeType === 11 &&
               j.childNodes.length === 1 &&
               i.length === 1
            ) {
               i[d](this[0]);
               g = this;
            } else {
               for (h = 0, m = i.length; h < m; h++) {
                  c = h;
                  k = (h > 0 ? this.clone(true) : this).get();
                  a.fn[d].apply(a(i[h]), k);
                  g = g.concat(k);
               }
               c = 0;
               g = this.pushStack(g, f, i.selector);
            }
            l = e;
            e = null;
            a.tmpl.complete(l);
            return g;
         };
      }
   );
   a.fn.extend({
      tmpl: function (d, c, b) {
         return a.tmpl(this[0], d, c, b);
      },
      tmplItem: function () {
         return a.tmplItem(this[0]);
      },
      template: function (b) {
         return a.template(b, this[0]);
      },
      domManip: function (d, l, j) {
         if (d[0] && d[0].nodeType) {
            var f = a.makeArray(arguments),
               g = d.length,
               i = 0,
               h;
            while (i < g && !(h = a.data(d[i++], "tmplItem")));
            if (g > 1) f[0] = [a.makeArray(d)];
            if (h && c)
               f[2] = function (b) {
                  a.tmpl.afterManip(this, b, j);
               };
            r.apply(this, f);
         } else r.apply(this, arguments);
         c = 0;
         !e && a.tmpl.complete(b);
         return this;
      },
   });
   a.extend({
      tmpl: function (d, h, e, c) {
         var j,
            k = !c;
         if (k) {
            c = p;
            d = a.template[d] || a.template(null, d);
            f = {};
         } else if (!d) {
            d = c.tmpl;
            b[c.key] = c;
            c.nodes = [];
            c.wrapped && n(c, c.wrapped);
            return a(i(c, null, c.tmpl(a, c)));
         }
         if (!d) return [];
         if (typeof h === "function") h = h.call(c || {});
         e && e.wrapped && n(e, e.wrapped);
         j = a.isArray(h)
            ? a.map(h, function (a) {
                 return a ? g(e, c, d, a) : null;
              })
            : [g(e, c, d, h)];
         return k ? a(i(c, null, j)) : j;
      },
      tmplItem: function (b) {
         var c;
         if (b instanceof a) b = b[0];
         while (
            b &&
            b.nodeType === 1 &&
            !(c = a.data(b, "tmplItem")) &&
            (b = b.parentNode)
         );
         return c || p;
      },
      template: function (c, b) {
         if (b) {
            if (typeof b === "string") b = o(b);
            else if (b instanceof a) b = b[0] || {};
            if (b.nodeType)
               b = a.data(b, "tmpl") || a.data(b, "tmpl", o(b.innerHTML));
            return typeof c === "string" ? (a.template[c] = b) : b;
         }
         return c
            ? typeof c !== "string"
               ? a.template(null, c)
               : a.template[c] || a.template(null, q.test(c) ? c : a(c))
            : null;
      },
      encode: function (a) {
         return ("" + a)
            .split("<")
            .join("&lt;")
            .split(">")
            .join("&gt;")
            .split('"')
            .join("&#34;")
            .split("'")
            .join("&#39;");
      },
   });
   a.extend(a.tmpl, {
      tag: {
         tmpl: {
            _default: { $2: "null" },
            open: "if($notnull_1){_=_.concat($item.nest($1,$2));}",
         },
         wrap: {
            _default: { $2: "null" },
            open: "$item.calls(_,$1,$2);_=[];",
            close: "call=$item.calls();_=call._.concat($item.wrap(call,_));",
         },
         each: {
            _default: { $2: "$index, $value" },
            open: "if($notnull_1){$.each($1a,function($2){with(this){",
            close: "}});}",
         },
         "if": { open: "if(($notnull_1) && $1a){", close: "}" },
         "else": {
            _default: { $1: "true" },
            open: "}else if(($notnull_1) && $1a){",
         },
         html: { open: "if($notnull_1){_.push($1a);}" },
         "=": {
            _default: { $1: "$data" },
            open: "if($notnull_1){_.push($.encode($1a));}",
         },
         "!": { open: "" },
      },
      complete: function () {
         b = {};
      },
      afterManip: function (f, b, d) {
         var e =
            b.nodeType === 11
               ? a.makeArray(b.childNodes)
               : b.nodeType === 1
               ? [b]
               : [];
         d.call(f, b);
         m(e);
         c++;
      },
   });
   function i(e, g, f) {
      var b,
         c = f
            ? a.map(f, function (a) {
                 return typeof a === "string"
                    ? e.key
                       ? a.replace(
                            /(<\w+)(?=[\s>])(?![^>]*_tmplitem)([^>]*)/g,
                            "$1 " + d + '="' + e.key + '" $2'
                         )
                       : a
                    : i(a, e, a._ctnt);
              })
            : e;
      if (g) return c;
      c = c.join("");
      c.replace(
         /^\s*([^<\s][^<]*)?(<[\w\W]+>)([^>]*[^>\s])?\s*$/,
         function (f, c, e, d) {
            b = a(e).get();
            m(b);
            if (c) b = j(c).concat(b);
            if (d) b = b.concat(j(d));
         }
      );
      return b ? b : j(c);
   }
   function j(c) {
      var b = document.createElement("div");
      b.innerHTML = c;
      return a.makeArray(b.childNodes);
   }
   function o(b) {
      return new Function(
         "jQuery",
         "$item",
         "var $=jQuery,call,_=[],$data=$item.data;with($data){_.push('" +
            a
               .trim(b)
               .replace(/([\\'])/g, "\\$1")
               .replace(/[\r\t\n]/g, " ")
               .replace(/\$\{([^\}]*)\}/g, "{{= $1}}")
               .replace(
                  /\{\{(\/?)(\w+|.)(?:\(((?:[^\}]|\}(?!\}))*?)?\))?(?:\s+(.*?)?)?(\(((?:[^\}]|\}(?!\}))*?)\))?\s*\}\}/g,
                  function (m, l, j, d, b, c, e) {
                     var i = a.tmpl.tag[j],
                        h,
                        f,
                        g;
                     if (!i) throw "Template command not found: " + j;
                     h = i._default || [];
                     if (c && !/\w$/.test(b)) {
                        b += c;
                        c = "";
                     }
                     if (b) {
                        b = k(b);
                        e = e ? "," + k(e) + ")" : c ? ")" : "";
                        f = c
                           ? b.indexOf(".") > -1
                              ? b + c
                              : "(" + b + ").call($item" + e
                           : b;
                        g = c
                           ? f
                           : "(typeof(" +
                             b +
                             ")==='function'?(" +
                             b +
                             ").call($item):(" +
                             b +
                             "))";
                     } else g = f = h.$1 || "null";
                     d = k(d);
                     return (
                        "');" +
                        i[l ? "close" : "open"]
                           .split("$notnull_1")
                           .join(
                              b
                                 ? "typeof(" +
                                      b +
                                      ")!=='undefined' && (" +
                                      b +
                                      ")!=null"
                                 : "true"
                           )
                           .split("$1a")
                           .join(g)
                           .split("$1")
                           .join(f)
                           .split("$2")
                           .join(
                              d
                                 ? d.replace(
                                      /\s*([^\(]+)\s*(\((.*?)\))?/g,
                                      function (d, c, b, a) {
                                         a = a ? "," + a + ")" : b ? ")" : "";
                                         return a
                                            ? "(" + c + ").call($item" + a
                                            : d;
                                      }
                                   )
                                 : h.$2 || ""
                           ) +
                        "_.push('"
                     );
                  }
               ) +
            "');}return _;"
      );
   }
   function n(c, b) {
      c._wrap = i(
         c,
         true,
         a.isArray(b) ? b : [q.test(b) ? b : a(b).html()]
      ).join("");
   }
   function k(a) {
      return a ? a.replace(/\\'/g, "'").replace(/\\\\/g, "\\") : null;
   }
   function s(b) {
      var a = document.createElement("div");
      a.appendChild(b.cloneNode(true));
      return a.innerHTML;
   }
   function m(o) {
      var n = "_" + c,
         k,
         j,
         l = {},
         e,
         p,
         i;
      for (e = 0, p = o.length; e < p; e++) {
         if ((k = o[e]).nodeType !== 1) continue;
         j = k.getElementsByTagName("*");
         for (i = j.length - 1; i >= 0; i--) m(j[i]);
         m(k);
      }
      function m(j) {
         var p,
            i = j,
            k,
            e,
            m;
         if ((m = j.getAttribute(d))) {
            while (
               i.parentNode &&
               (i = i.parentNode).nodeType === 1 &&
               !(p = i.getAttribute(d))
            );
            if (p !== m) {
               i = i.parentNode
                  ? i.nodeType === 11
                     ? 0
                     : i.getAttribute(d) || 0
                  : 0;
               if (!(e = b[m])) {
                  e = f[m];
                  e = g(e, b[i] || f[i], null, true);
                  e.key = ++h;
                  b[h] = e;
               }
               c && o(m);
            }
            j.removeAttribute(d);
         } else if (c && (e = a.data(j, "tmplItem"))) {
            o(e.key);
            b[e.key] = e;
            i = a.data(j.parentNode, "tmplItem");
            i = i ? i.key : 0;
         }
         if (e) {
            k = e;
            while (k && k.key != i) {
               k.nodes.push(j);
               k = k.parent;
            }
            delete e._ctnt;
            delete e._wrap;
            a.data(j, "tmplItem", e);
         }
         function o(a) {
            a = a + n;
            e = l[a] =
               l[a] || g(e, b[e.parent.key + n] || e.parent, null, true);
         }
      }
   }
   function u(a, d, c, b) {
      if (!a) return l.pop();
      l.push({ _: a, tmpl: d, item: this, data: c, options: b });
   }
   function w(d, c, b) {
      return a.tmpl(a.template(d), c, b, this);
   }
   function x(b, d) {
      var c = b.options || {};
      c.wrapped = d;
      return a.tmpl(a.template(b.tmpl), b.data, c, b.item);
   }
   function v(d, c) {
      var b = this._wrap;
      return a.map(
         a(a.isArray(b) ? b.join("") : b).filter(d || "*"),
         function (a) {
            return c ? a.innerText || a.textContent : a.outerHTML || s(a);
         }
      );
   }
   function t() {
      var b = this.nodes;
      a.tmpl(null, null, null, this).insertBefore(b[0]);
      a(b).remove();
   }
})(jQuery);

/**
 * Cookie plugin
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

jQuery.cookie = function (b, j, m) {
   if (typeof j != "undefined") {
      m = m || {};
      if (j === null) {
         j = "";
         m.expires = -1;
      }
      var e = "";
      if (
         m.expires &&
         (typeof m.expires == "number" || m.expires.toUTCString)
      ) {
         var f;
         if (typeof m.expires == "number") {
            f = new Date();
            f.setTime(f.getTime() + m.expires * 24 * 60 * 60 * 1000);
         } else {
            f = m.expires;
         }
         e = "; expires=" + f.toUTCString();
      }
      var l = m.path ? "; path=" + m.path : "";
      var g = m.domain ? "; domain=" + m.domain : "";
      var a = m.secure ? "; secure" : "";
      document.cookie = [b, "=", encodeURIComponent(j), e, l, g, a].join("");
   } else {
      var d = null;
      if (document.cookie && document.cookie != "") {
         var k = document.cookie.split(";");
         for (var h = 0; h < k.length; h++) {
            var c = jQuery.trim(k[h]);
            if (c.substring(0, b.length + 1) == b + "=") {
               d = decodeURIComponent(c.substring(b.length + 1));
               break;
            }
         }
      }
      return d;
   }
};

/**
 * Module to show Recently Viewed Products
 *
 * Copyright (c) 2014 Caroline Schnapp (11heavens.com)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

Shopify.Products = (function () {
   var a = {
      howManyToShow: 3,
      howManyToStoreInMemory: 10,
      wrapperId: "recently-viewed-products",
      templateId: "recently-viewed-product-template",
      onComplete: null,
   };
   var c = [];
   var h = null;
   var d = null;
   var e = 0;
   var b = {
      configuration: {
         expires: 90,
         path: "/",
         domain: window.location.hostname,
      },
      name: "shopify_recently_viewed",
      write: function (i) {
         jQuery.cookie(this.name, i.join(" "), this.configuration);
      },
      read: function () {
         var i = [];
         var j = jQuery.cookie(this.name);
         if (j !== null) {
            i = j.split(" ");
         }
         return i;
      },
      destroy: function () {
         jQuery.cookie(this.name, null, this.configuration);
      },
      remove: function (k) {
         var j = this.read();
         var i = jQuery.inArray(k, j);
         if (i !== -1) {
            j.splice(i, 1);
            this.write(j);
         }
      },
   };
   var f = function () {
      h.show();
      if (a.onComplete) {
         try {
            a.onComplete();
         } catch (i) {}
      }
   };
   var g = function () {
      if (c.length && e < a.howManyToShow) {
         jQuery.ajax({
            dataType: "json",
            url: "/products/" + c[0] + ".js",
            cache: false,
            success: function (i) {
               d.tmpl(i).appendTo(h);
               c.shift();
               e++;
               g();
            },
            error: function () {
               b.remove(c[0]);
               c.shift();
               g();
            },
         });
      } else {
         f();
      }
   };
   return {
      resizeImage: function (m, j) {
         if (j == null) {
            return m;
         }
         if (j == "master") {
            return m.replace(/http(s)?:/, "");
         }
         var i = m.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?/i);
         if (i != null) {
            var k = m.split(i[0]);
            var l = i[0];
            return (k[0] + "_" + j + l).replace(/http(s)?:/, "");
         } else {
            return null;
         }
      },
      showRecentlyViewed: function (i) {
         var i = i || {};
         jQuery.extend(a, i);
         c = b.read();
         d = jQuery("#" + a.templateId);
         h = jQuery("#" + a.wrapperId);
         a.howManyToShow = Math.min(c.length, a.howManyToShow);
         if (a.howManyToShow && d.length && h.length) {
            g();
         }
      },
      getConfig: function () {
         return a;
      },
      clearList: function () {
         b.destroy();
      },
      recordRecentlyViewed: function (l) {
         var l = l || {};
         jQuery.extend(a, l);
         var j = b.read();
         if (window.location.pathname.indexOf("/products/") !== -1) {
            var k = window.location.pathname.match(
               /\/products\/([a-z0-9\-]+)/
            )[1];
            var i = jQuery.inArray(k, j);
            if (i === -1) {
               j.unshift(k);
               j = j.splice(0, a.howManyToStoreInMemory);
            } else {
               j.splice(i, 1);
               j.unshift(k);
            }
            b.write(j);
         }
      },
   };
})();
var Shopify = Shopify || {};
// ---------------------------------------------------------------------------
// Money format handler
// ---------------------------------------------------------------------------
Shopify.money_format = "${{amount}}";
Shopify.formatMoney = function (cents, format) {
   if (typeof cents == "string") {
      cents = cents.replace(".", "");
   }
   var value = "";
   var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
   var formatString = format || this.money_format;

   function defaultOption(opt, def) {
      return typeof opt == "undefined" ? def : opt;
   }

   function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = defaultOption(precision, 2);
      thousands = defaultOption(thousands, ",");
      decimal = defaultOption(decimal, ".");

      if (isNaN(number) || number == null) {
         return 0;
      }

      number = (number / 100.0).toFixed(precision);

      var parts = number.split("."),
         dollars = parts[0].replace(
            /(\d)(?=(\d\d\d)+(?!\d))/g,
            "$1" + thousands
         ),
         cents = parts[1] ? decimal + parts[1] : "";

      return dollars + cents;
   }

   switch (formatString.match(placeholderRegex)[1]) {
      case "amount":
         value = formatWithDelimiters(cents, 2);
         break;
      case "amount_no_decimals":
         value = formatWithDelimiters(cents, 0);
         break;
      case "amount_with_comma_separator":
         value = formatWithDelimiters(cents, 2, ".", ",");
         break;
      case "amount_no_decimals_with_comma_separator":
         value = formatWithDelimiters(cents, 0, ".", ",");
         break;
   }

   return formatString.replace(placeholderRegex, value);
};
