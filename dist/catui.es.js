/*!
 * Catui - Modern modular Front-End UI library
 * MIT Licensed
 */
(function(s, N) {
  var d = s.document, S = "1.0.0", c = {
    modules: {},
    status: {},
    timeout: 10,
    event: {}
    // 이벤트 저장소
  }, O = {
    $c: "modules/cui",
    popup: "modules/popup",
    date: "modules/date",
    page: "modules/page",
    tpl: "modules/tpl",
    form: "modules/form",
    table: "modules/table",
    element: "modules/element",
    upload: "modules/upload",
    tree: "modules/tree",
    dropdown: "modules/dropdown",
    util: "modules/util",
    carousel: "modules/carousel",
    slider: "modules/slider",
    rate: "modules/rate",
    colorpicker: "modules/colorpicker",
    transfer: "modules/transfer",
    editor: "modules/editor",
    flow: "modules/flow",
    code: "modules/code"
    // 코드 하이라이트
  }, g = function(e, t) {
    t = t || "Catui", s.console && console.error && console.error(t + " error hint: " + e);
  }, $ = function() {
    return { error: g };
  }, n = function() {
    this.v = S;
  };
  n.prototype.getPath = function() {
    return "/src/";
  }, n.prototype.config = function(e) {
    e = e || {};
    for (var t in e)
      c[t] = e[t];
    return this;
  }, n.prototype.define = function(e, t) {
    var r = this, f = [], o = function() {
      return typeof e == "function" ? (t = e, ["$c"]) : e;
    }();
    return typeof t != "function" ? g("define callback is not a function") : (r.use(o, function() {
      f = Array.prototype.slice.call(arguments), f.unshift(function(a, i) {
        n[a] = i, c.status[a] = !0;
      }), t.apply(r, f);
    }), r);
  }, n.prototype.use = function(e, t, r) {
    var f = this, o = s.Catui, a = d.head || d.getElementsByTagName("head")[0], i = typeof e == "string" ? [e] : e, l = 0;
    typeof t != "function" && (t = function() {
    });
    for (var p = function() {
      for (var u = [], h = 0; h < i.length; h++)
        u.push(o[i[h]] || s[i[h]]);
      t.apply(o, u);
    }, y = function(u) {
      return o[u] || s[u] || c.status[u] ? (c.status[u] = !0, l++, l >= i.length && p(), !0) : !1;
    }, J = function(u) {
      var h = O[u] || u;
      if (!y(u)) {
        var v = d.createElement("script");
        v.src = f.getPath() + h + ".js", v.async = !0, v.onload = function() {
          setTimeout(function() {
            s[u] && (o[u] = s[u]), c.status[u] = !0, l++, l >= i.length && p();
          }, 10);
        }, v.onerror = function() {
          g("Failed to load module: " + u), l++, l >= i.length && p();
        }, a.appendChild(v);
      }
    }, C = 0; C < i.length; C++)
      J(i[C]);
    return f;
  }, n.prototype.onevent = function(e, t, r) {
    return typeof e != "string" || typeof r != "function" ? this : n.event(e, t, null, r);
  }, n.prototype.event = n.event = function(e, t, r, p) {
    var o = c.event[e] || {}, a = (t || "").match(/\((.*)\)$/) || [], i = (t || "").replace(a[0] || "", ""), l = a[1] || "", p = p || function() {
    };
    if (p !== null)
      return o[i] = o[i] || {}, o[i][l] = p, c.event[e] = o, this;
    var y = (o[i] || {})[l];
    if (typeof y == "function")
      return y.call(this, r);
  }, n.prototype.off = function(e, t) {
    var r = c.event[e] || {}, f = (t || "").match(/\((.*)\)$/) || [], o = (t || "").replace(f[0] || "", ""), a = f[1] || "";
    return r[o] && delete r[o][a], this;
  }, n.prototype.each = function(e, t) {
    var r;
    if (typeof t != "function") return this;
    if (e.length !== N)
      for (r = 0; r < e.length && t.call(e[r], r, e[r]) !== !1; r++)
        ;
    else
      for (r in e)
        if (e.hasOwnProperty(r) && t.call(e[r], r, e[r]) === !1)
          break;
    return this;
  }, n.prototype.data = function(e, t, r) {
    if (e = e || "catui", r = r || localStorage, !(!s.JSON || !s.JSON.parse)) {
      if (t === null)
        return r.removeItem(e);
      if (typeof t == "object")
        return r.setItem(e, JSON.stringify(t));
      if (typeof t == "string") {
        var f = JSON.parse(r.getItem(e) || "{}");
        return f[t];
      }
      return JSON.parse(r.getItem(e) || "{}");
    }
  }, n.prototype.sessionData = function(e, t) {
    return this.data(e, t, sessionStorage);
  }, n.prototype.device = function(e) {
    var t = navigator.userAgent.toLowerCase(), r = {
      mobile: /android|iphone|ipad|ipod|mobile/i.test(t),
      ios: /iphone|ipad|ipod/i.test(t),
      android: /android/i.test(t),
      weixin: /micromessenger/i.test(t)
    };
    return e ? r[e] : r;
  }, n.prototype.hint = $, n.prototype.link = function(e, t, r) {
    var f = d.head || d.getElementsByTagName("head")[0], o = d.createElement("link");
    return typeof t == "string" && (r = t), o.href = e, o.rel = "stylesheet", o.id = r || "", f.appendChild(o), typeof t == "function" && (o.onload = t), this;
  };
  var m = new n();
  s.Catui = m, m.link(m.getPath() + "css/catui.css", "catui-css"), m.use("$c", function() {
    console.log("Catui v" + m.v + " ready");
  });
})(window);
