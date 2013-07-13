(function() {
    var i = (function() {
        var L = {};
        var M = [];
        L.inc = function(O, N) {
            return true
        };
        L.register = function(P, N) {
            var R = P.split(".");
            var Q = L;
            var O = null;
            while (O = R.shift()) {
                if (R.length) {
                    if (Q[O] === undefined) {
                        Q[O] = {}
                    }
                    Q = Q[O]
                } else {
                    if (Q[O] === undefined) {
                        try {
                            Q[O] = N(L)
                        } catch (S) {
                        }
                    }
                }
            }
        };
        L.regShort = function(N, O) {
            if (L[N] !== undefined) {
                throw"[" + N + "] : short : has been register"
            }
            L[N] = O
        };
        L.IE = /msie/i.test(navigator.userAgent);
        L.E = function(N) {
            if (typeof N === "string") {
                return document.getElementById(N)
            } else {
                return N
            }
        };
        L.C = function(N) {
            var O;
            N = N.toUpperCase();
            if (N == "TEXT") {
                O = document.createTextNode("")
            } else {
                if (N == "BUFFER") {
                    O = document.createDocumentFragment()
                } else {
                    O = document.createElement(N)
                }
            }
            return O
        };
        L.log = function(N) {
            M.push("[" + ((new Date()).getTime() % 100000) + "]: " + N)
        };
        L.getErrorLogInformationList = function(N) {
            return M.splice(0, N || M.length)
        };
        return L
    })();
    $Import = i.inc;
    i.register("core.str.trim", function(L) {
        return function(P) {
            if (typeof P !== "string") {
                throw"trim need a string as parameter"
            }
            var M = P.length;
            var O = 0;
            var N = /(\u3000|\s|\t|\u00A0)/;
            while (O < M) {
                if (!N.test(P.charAt(O))) {
                    break
                }
                O += 1
            }
            while (M > O) {
                if (!N.test(P.charAt(M - 1))) {
                    break
                }
                M -= 1
            }
            return P.slice(O, M)
        }
    });
    i.register("core.evt.addEvent", function(L) {
        return function(M, P, O) {
            var N = L.E(M);
            if (N == null) {
                return false
            }
            P = P || "click";
            if ((typeof O).toLowerCase() != "function") {
                return
            }
            if (N.attachEvent) {
                N.attachEvent("on" + P, O)
            } else {
                if (N.addEventListener) {
                    N.addEventListener(P, O, false)
                } else {
                    N["on" + P] = O
                }
            }
            return true
        }
    });
    i.register("core.obj.parseParam", function(L) {
        return function(O, N, M) {
            var P, Q = {};
            N = N || {};
            for (P in O) {
                Q[P] = O[P];
                if (N[P] != null) {
                    if (M) {
                        if (O.hasOwnProperty[P]) {
                            Q[P] = N[P]
                        }
                    } else {
                        Q[P] = N[P]
                    }
                }
            }
            return Q
        }
    });
    i.register("core.arr.isArray", function(L) {
        return function(M) {
            return Object.prototype.toString.call(M) === "[object Array]"
        }
    });
    i.register("core.json.queryToJson", function(L) {
        return function(O, S) {
            var U = L.core.str.trim(O).split("&");
            var T = {};
            var N = function(W) {
                if (S) {
                    return decodeURIComponent(W)
                } else {
                    return W
                }
            };
            for (var Q = 0, R = U.length; Q < R; Q++) {
                if (U[Q]) {
                    var P = U[Q].split("=");
                    var M = P[0];
                    var V = P[1];
                    if (P.length < 2) {
                        V = M;
                        M = "$nullName"
                    }
                    if (!T[M]) {
                        T[M] = N(V)
                    } else {
                        if (L.core.arr.isArray(T[M]) != true) {
                            T[M] = [T[M]]
                        }
                        T[M].push(N(V))
                    }
                }
            }
            return T
        }
    });
    i.register("core.obj.isEmpty", function(L) {
        return function(P, O) {
            var N = true;
            for (var M in P) {
                if (O) {
                    N = false;
                    break
                } else {
                    if (P.hasOwnProperty(M)) {
                        N = false;
                        break
                    }
                }
            }
            return N
        }
    });
    i.register("core.util.cookie", function(M) {
        var L = {set: function(Q, T, S) {
                var N = [];
                var R, P;
                var O = M.core.obj.parseParam({expire: null, path: "/", domain: null, secure: null, encode: true}, S);
                if (O.encode == true) {
                    T = escape(T)
                }
                N.push(Q + "=" + T);
                if (O.path != null) {
                    N.push("path=" + O.path)
                }
                if (O.domain != null) {
                    N.push("domain=" + O.domain)
                }
                if (O.secure != null) {
                    N.push(O.secure)
                }
                if (O.expire != null) {
                    R = new Date();
                    P = R.getTime() + O.expire * 3600000;
                    R.setTime(P);
                    N.push("expires=" + R.toGMTString())
                }
                document.cookie = N.join(";")
            }, get: function(P) {
                P = P.replace(/([\.\[\]\$])/g, "\\$1");
                var O = new RegExp(P + "=([^;]*)?;", "i");
                var Q = document.cookie + ";";
                var N = Q.match(O);
                if (N) {
                    return N[1] || ""
                } else {
                    return""
                }
            }, remove: function(N, O) {
                O = O || {};
                O.expire = -10;
                L.set(N, "", O)
            }};
        return L
    });
    i.register("core.str.parseURL", function(L) {
        return function(O) {
            var N = /^(?:([A-Za-z]+):(\/{0,3}))?([0-9.\-A-Za-z]+\.[0-9A-Za-z]+)?(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
            var S = ["url", "scheme", "slash", "host", "port", "path", "query", "hash"];
            var Q = N.exec(O);
            var R = {};
            for (var P = 0, M = S.length; P < M; P += 1) {
                R[S[P]] = Q[P] || ""
            }
            return R
        }
    });
    i.register("core.json.jsonToQuery", function(L) {
        var M = function(O, N) {
            O = O == null ? "" : O;
            O = L.core.str.trim(O.toString());
            if (N) {
                return encodeURIComponent(O)
            } else {
                return O
            }
        };
        return function(R, P) {
            var S = [];
            if (typeof R == "object") {
                for (var O in R) {
                    if (O === "$nullName") {
                        S = S.concat(R[O]);
                        continue
                    }
                    if (R[O] instanceof Array) {
                        for (var Q = 0, N = R[O].length; Q < N; Q++) {
                            S.push(O + "=" + M(R[O][Q], P))
                        }
                    } else {
                        if (typeof R[O] != "function") {
                            S.push(O + "=" + M(R[O], P))
                        }
                    }
                }
            }
            if (S.length) {
                return S.join("&")
            } else {
                return""
            }
        }
    });
    i.register("core.util.URL", function(L) {
        return function(Q, N) {
            var P = L.core.obj.parseParam({isEncodeQuery: false, isEncodeHash: false}, N || {});
            var O = {};
            var S = L.core.str.parseURL(Q);
            var M = L.core.json.queryToJson(S.query);
            var R = L.core.json.queryToJson(S.hash);
            O.setParam = function(T, U) {
                M[T] = U;
                return this
            };
            O.getParam = function(T) {
                return M[T]
            };
            O.setParams = function(U) {
                for (var T in U) {
                    O.setParam(T, U[T])
                }
                return this
            };
            O.setHash = function(T, U) {
                R[T] = U;
                return this
            };
            O.getHash = function(T) {
                return R[T]
            };
            O.valueOf = O.toString = function() {
                var T = [];
                var U = L.core.json.jsonToQuery(M, P.isEncodeQuery);
                var V = L.core.json.jsonToQuery(R, P.isEncodeQuery);
                if (S.scheme != "") {
                    T.push(S.scheme + ":");
                    T.push(S.slash)
                }
                if (S.host != "") {
                    T.push(S.host);
                    if (S.port != "") {
                        T.push(":");
                        T.push(S.port)
                    }
                }
                T.push("/");
                T.push(S.path);
                if (U != "") {
                    T.push("?" + U)
                }
                if (V != "") {
                    T.push("#" + V)
                }
                return T.join("")
            };
            return O
        }
    });
    i.register("core.util.browser", function(R) {
        var L = navigator.userAgent.toLowerCase();
        var U = window.external || "";
        var N, O, P, V, Q;
        var M = function(W) {
            var X = 0;
            return parseFloat(W.replace(/\./g, function() {
                return(X++ == 1) ? "" : "."
            }))
        };
        try {
            if ((/windows|win32/i).test(L)) {
                Q = "windows"
            } else {
                if ((/macintosh/i).test(L)) {
                    Q = "macintosh"
                } else {
                    if ((/rhino/i).test(L)) {
                        Q = "rhino"
                    }
                }
            }
            if ((O = L.match(/applewebkit\/([^\s]*)/)) && O[1]) {
                N = "webkit";
                V = M(O[1])
            } else {
                if ((O = L.match(/presto\/([\d.]*)/)) && O[1]) {
                    N = "presto";
                    V = M(O[1])
                } else {
                    if (O = L.match(/msie\s([^;]*)/)) {
                        N = "trident";
                        V = 1;
                        if ((O = L.match(/trident\/([\d.]*)/)) && O[1]) {
                            V = M(O[1])
                        }
                    } else {
                        if (/gecko/.test(L)) {
                            N = "gecko";
                            V = 1;
                            if ((O = L.match(/rv:([\d.]*)/)) && O[1]) {
                                V = M(O[1])
                            }
                        }
                    }
                }
            }
            if (/world/.test(L)) {
                P = "world"
            } else {
                if (/360se/.test(L)) {
                    P = "360"
                } else {
                    if ((/maxthon/.test(L)) || typeof U.max_version == "number") {
                        P = "maxthon"
                    } else {
                        if (/tencenttraveler\s([\d.]*)/.test(L)) {
                            P = "tt"
                        } else {
                            if (/se\s([\d.]*)/.test(L)) {
                                P = "sogou"
                            }
                        }
                    }
                }
            }
        } catch (T) {
        }
        var S = {OS: Q, CORE: N, Version: V, EXTRA: (P ? P : false), IE: /msie/.test(L), OPERA: /opera/.test(L), MOZ: /gecko/.test(L) && !/(compatible|webkit)/.test(L), IE5: /msie 5 /.test(L), IE55: /msie 5.5/.test(L), IE6: /msie 6/.test(L), IE7: /msie 7/.test(L), IE8: /msie 8/.test(L), IE9: /msie 9/.test(L), SAFARI: !/chrome\/([\d.]*)/.test(L) && /\/([\d.]*) safari/.test(L), CHROME: /chrome\/([\d.]*)/.test(L), IPAD: /\(ipad/i.test(L), IPHONE: /\(iphone/i.test(L), ITOUCH: /\(itouch/i.test(L), MOBILE: /mobile/i.test(L)};
        return S
    });
    i.register("core.dom.isNode", function(L) {
        return function(M) {
            return(M != undefined) && Boolean(M.nodeName) && Boolean(M.nodeType)
        }
    });
    i.register("core.util.hideContainer", function(N) {
        var O;
        var L = function() {
            if (O) {
                return
            }
            O = N.C("div");
            O.style.cssText = "position:absolute;top:-9999px;left:-9999px;";
            document.getElementsByTagName("head")[0].appendChild(O)
        };
        var M = {appendChild: function(P) {
                if (N.core.dom.isNode(P)) {
                    L();
                    O.appendChild(P)
                }
            }, removeChild: function(P) {
                if (N.core.dom.isNode(P)) {
                    O && O.removeChild(P)
                }
            }};
        return M
    });
    window.WB2 = window.WB2 || {};
    WB2.Module = {loginButton: {versions: {"1.0": {js: "loginButton{ver}.js?version=20130425", css: "/t3/style/css/common/card.css?version=20120327"}, latest: {js: "loginButton.js?version=20130425", css: "/t4/appstyle/widget/css/loginButton/loginButton.css"}}}, followButton: {versions: {"1.0": {js: "followButton{ver}.js", css: "/t3/style/css/common/card.css?version=20120924"}, latest: {js: "followButton.js?version=20121210", css: "/t4/appstyle/widget/css/followButton/followButtonSdk.css"}}}, publish: {versions: {"1.0": {js: "publish{ver}.js?version=20120703", css: "/t3/style/css/thirdpart/rlsbox.css?version=20120327"}, "1.1": {js: "publish{ver}.js?version=20120731", css: "/t35/appstyle/opent/css/widgets/js_weibo_send/js_weibo_send.css"}, latest: {js: "publish.js?version=20130522", css: "/t4/appstyle/widget/css/weiboPublish/weiboPublish.css"}}}, hoverCard: {versions: {"1.0": {js: "hoverCard{ver}.js?version=20120327", css: "/t3/style/css/common/card.css?version=20120327"}, latest: {js: "hoverCard.js?version=20130425", css: "/t4/appstyle/widget/css/weiboCard/weiboCard.css"}}}, recommend: {versions: {"1.0": {js: "recommend{ver}.js"}, latest: {js: "recommend.js", css: "/t3/style/css/thirdpart/interested.css"}}}, selector: {versions: {"1.0": {js: "selector{ver}.js?version=20120327", css: "/t3/style/css/thirdpart/csuser.css"}, latest: {js: "selector.js?version=20130506", css: "/t4/appstyle/widget/css/selector/selector.css"}}}, shareRecommend: {versions: {"1.0": {js: "shareRecommend{ver}.js?version=20121206"}, latest: {js: "shareRecommend.js?version=20130425", css: "/t4/appstyle/widget/css/weiboFamous/weiboFamous.css"}}}, like: {versions: {"1.0": {js: "like{ver}.js?version=20130513"}, latest: {js: "like.js?version=20130524", css: "/t4/appstyle/widget/css/praiseButton/praiseButton.css?version=20130527"}}}, iframeWidget: {versions: {latest: {js: "iframeWidget.js?version=20130515"}}}, invite: {versions: {"1.0": {js: "invite{ver}.js?version=20121225"}, latest: {js: "invite.js?version=20121225", css: "http://img.t.sinajs.cn/t4/appstyle/V5_invite/css/module/frame/layer_frame.css"}}}, quote: {versions: {"1.0": {js: "quote{ver}.js?version=20121225"}, latest: {js: "quote.js?version=20121225"}}}};
    i.register("core.func.getType", function(L) {
        return function(M) {
            var N;
            return((N = typeof(M)) == "object" ? M == null && "null" || Object.prototype.toString.call(M).slice(8, -1) : N).toLowerCase()
        }
    });
    i.register("core.dom.ready", function(R) {
        var N = [];
        var W = false;
        var V = R.core.func.getType;
        var S = R.core.util.browser;
        var Q = R.core.evt.addEvent;
        var T = function() {
            if (!W) {
                if (document.readyState === "complete") {
                    return true
                }
            }
            return W
        };
        var O = function() {
            if (W == true) {
                return
            }
            W = true;
            for (var Y = 0, X = N.length; Y < X; Y++) {
                if (V(N[Y]) === "function") {
                    try {
                        N[Y].call()
                    } catch (Z) {
                    }
                }
            }
            N = []
        };
        var L = function() {
            if (T()) {
                O();
                return
            }
            try {
                document.documentElement.doScroll("left")
            } catch (X) {
                setTimeout(arguments.callee, 25);
                return
            }
            O()
        };
        var M = function() {
            if (T()) {
                O();
                return
            }
            setTimeout(arguments.callee, 25)
        };
        var P = function() {
            Q(document, "DOMContentLoaded", O)
        };
        var U = function() {
            Q(window, "load", O)
        };
        if (!T()) {
            if (R.IE && window === window.top) {
                L()
            }
            P();
            M();
            U()
        }
        return function(X) {
            if (T()) {
                if (V(X) === "function") {
                    X.call()
                }
            } else {
                N.push(X)
            }
        }
    });
    i.register("conf.api.wbml", function(L) {
        window.WB2 = window.WB2 || {};
        return function() {
            var N = L.core.util.browser;
            var Q = [{tagName: "login-button", widgetName: "loginButton"}, {tagName: "publish", widgetName: "publish"}, {tagName: "share-recommend", widgetName: "shareRecommend"}, {tagName: "like", widgetName: "like"}, {tagName: "follow-button", widgetName: "iframeWidget"}, {tagName: "share-button", widgetName: "iframeWidget"}, {tagName: "list", widgetName: "iframeWidget"}, {tagName: "show", widgetName: "iframeWidget"}, {tagName: "topic", widgetName: "iframeWidget"}, {tagName: "comments", widgetName: "iframeWidget"}, {tagName: "livestream", widgetName: "iframeWidget"}, {tagName: "bulkfollow", widgetName: "iframeWidget"}, {tagName: "hotlist", widgetName: "iframeWidget"}, {tagName: "invite", widgetName: "invite"}, {tagName: "quote", widgetName: "quote"}];
            var P = function(R, W) {
                W = W || "wb";
                var S = navigator.userAgent.toLowerCase();
                var U = W + ":" + R;
                if (N.IE) {
                    try {
                        var V = document.namespaces;
                        if (V && V[W]) {
                            return document.getElementsByTagName(R).length == 0 ? document.getElementsByTagName(U) : document.getElementsByTagName(R)
                        }
                    } catch (T) {
                    }
                    return document.getElementsByTagName(U)
                } else {
                    if (N.MOZ) {
                        return document.getElementsByTagNameNS(document.body.namespaceURI, U)
                    } else {
                        return document.getElementsByTagName(U)
                    }
                }
            };
            var O = function(V, U) {
                var T = V.attributes;
                var R = {};
                for (var S = T.length - 1; S >= 0; S--) {
                    var W = T[S];
                    if (W.specified) {
                        R[T[S].name] = T[S].value
                    }
                }
                R.dom = V;
                R.tagName = U;
                return R
            };
            var M = function() {
                var Z = [];
                for (var U = 0, Y = Q.length; U < Y; U++) {
                    var R = Q[U];
                    var S = R.tagName;
                    var V = R.widgetName;
                    var X = P(S);
                    for (var T = 0, W = X.length; T < W; T++) {
                        X[T].innerHTML = '<span style="background:url(http://timg.sjs.sinajs.cn/t4/appstyle/widget/images/library/base/loading1.gif) no-repeat;height:18px;padding:0 0 2px 20px;">Loading...</span>';
                        Z.push({tag: S, widget: V, params: O(X[T], S)})
                    }
                }
                var Y = Z.length;
                if (Y > 0) {
                    WB2.anyWhere(function(ab) {
                        for (var ad = 0, aa = Z.length; ad < aa; ad++) {
                            var ac = Z[ad];
                            (function(ae) {
                                setTimeout(function() {
                                    ab.widget[ae.widget](ae.params)
                                }, ad * 50)
                            })(ac)
                        }
                    })
                }
            };
            (function() {
                try {
                    if (document.namespaces && !document.namespaces.item.wb) {
                        document.namespaces.add("wb")
                    }
                } catch (R) {
                }
            }());
            WB2.initCustomTag = M;
            L.core.dom.ready(function() {
                M()
            })
        }
    });
    var w;
    var e = true;
    var a = [];
    var K = 2;
    var y = "https://api.weibo.com/" + K + "/oauth2/query";
    var c;
    var t = "https://api.weibo.com/" + K + "/oauth2/authorize";
    var r = {};
    var v = true;
    var G = i.core.obj.parseParam, k = i.core.evt.addEvent, b = i.core.str.trim, f = i.core.util.browser, D = i.core.util.cookie, u = i.core.json.queryToJson;
    var j = function(L) {
        if (WB2.DEBUG) {
            if (window.console && window.console.log) {
                window.console.log(L)
            }
        }
    };
    var p = function(P) {
        var N = {url: "", charset: "UTF-8", timeout: 30 * 1000, args: {}, onComplete: null, onTimeout: null, responseName: null, varkey: "callback"};
        var Q = -1;
        N = G(N, P);
        var O = N.responseName || ("STK_" + Math.floor(Math.random() * 1000) + new Date().getTime().toString());
        N.args[N.varkey] = O;
        var L = N.onComplete;
        var M = N.onTimeout;
        window[O] = function(R) {
            if (Q != 2 && L != null) {
                Q = 1;
                L(R)
            }
        };
        N.onComplete = null;
        N.onTimeout = function() {
            if (Q != 1 && M != null) {
                Q = 2;
                M()
            }
        };
        return m(N)
    };
    var m = function(Q) {
        var P, L;
        var M = {url: "", charset: "UTF-8", timeout: 30 * 1000, args: {}, onComplete: null, onTimeout: null, uniqueID: null};
        M = G(M, Q);
        if (M.url == "") {
            throw"url is null"
        }
        P = document.createElement("script");
        P.charset = "UTF-8";
        var R = /msie/i.test(navigator.userAgent);
        if (M.onComplete != null) {
            if (R) {
                P.onreadystatechange = function() {
                    if (P.readyState.toLowerCase() == "complete" || P.readyState.toLowerCase() == "loaded") {
                        clearTimeout(L);
                        M.onComplete();
                        P.onreadystatechange = null
                    }
                }
            } else {
                P.onload = function() {
                    clearTimeout(L);
                    M.onComplete();
                    P.onload = null
                }
            }
        }
        var O = function(T) {
            if (T) {
                var S = [];
                for (var U in T) {
                    S.push(U + "=" + encodeURIComponent(b(T[U])))
                }
                if (S.length) {
                    return S.join("&")
                } else {
                    return""
                }
            }
        };
        var N = O(M.args);
        if (M.url.indexOf("?") == -1) {
            if (N != "") {
                N = "?" + N
            }
        } else {
            if (N != "") {
                N = "&" + N
            }
        }
        P.src = M.url + N;
        document.getElementsByTagName("head")[0].appendChild(P);
        if (M.timeout > 0 && M.onTimeout != null) {
            L = setTimeout(function() {
                M.onTimeout()
            }, M.timeout)
        }
        return P
    };
    var I = function() {
        this.started = 1;
        this.taskList = [];
        this.setStatue = function(L) {
            this.started = L
        };
        this.start = function() {
            this.setStatue(0);
            var N, P, M, O;
            var L = this.taskList.shift();
            var P = L[0], M = L[1], O = L[2];
            P.apply(O, M)
        };
        this.next = function() {
            this.setStatue(1);
            if (this.taskList.length > 0) {
                this.start()
            }
        };
        this.add = function(N, M) {
            var L = {args: [], pointer: window, top: false};
            L = G(L, M);
            if (L.top) {
                this.taskList.unshift([N, L.args, L.pointer])
            } else {
                this.taskList.push([N, L.args, L.pointer])
            }
            if (this.started) {
                this.start()
            }
        }
    };
    var h = new I();
    function x(M) {
        var L = WB2._config.version, O = WB2.anyWhere._instances, N = O[L];
        if (N) {
            if (N.contentWindow._ready) {
                N.contentWindow.request(M)
            } else {
                WB2.addToCallbacks(N.contentWindow, M)
            }
        } else {
            WB2.delayCall(M)
        }
    }
    function l(M) {
        var L = {requestType: "anywhere", callback: M};
        E(L)
    }
    function E(L) {
        var N = L || {};
        var M = function() {
            x(N);
            h.next()
        };
        var O = function(P) {
            if (r.bundle) {
                P && P()
            } else {
                m({url: WB2._config.host + "/open/api/js/api/bundle.js?version=" + WB2._config.cdn_version, onComplete: function() {
                        r.bundle = 1;
                        P && P()
                    }})
            }
        };
        h.add(O, {args: [M]})
    }
    function F() {
        var O = document.getElementsByTagName("script");
        var Q = O.length, P = 0, M, L, T, N, R;
        if (Q > 0) {
            M = O[P++];
            while (M) {
                if (M.src.indexOf("api/js/wb.js") != -1) {
                    L = M.src.split("?").pop();
                    break
                }
                M = O[P++]
            }
        }
        L = L.toLowerCase();
        var S = u(L);
        T = S.appkey || "";
        N = S.secret || "";
        R = S.version || 1;
        return{appkey: T, secret: N, version: R}
    }
    function C(O, N) {
        var M, L;
        if (O != null) {
            if (N == true) {
                a.unshift(O)
            } else {
                a.push(O)
            }
        }
        if (WB2.checkLogin()) {
            for (M = 0, L = a.length; M < L; M++) {
                a[M].call()
            }
            a = []
        }
    }
    function o(M) {
        var L = i.core.util.URL(t), N = 600, O = 455;
        L.setParam("client_id", M.appkey);
        L.setParam("response_type", "token");
        L.setParam("display", "js");
        L.setParam("transport", "html5");
        L.setParam("referer", encodeURI(document.location.href));
        c = window.open(L, "oauth_login_window", "width=" + N + ",height=" + O + ",toolbar=no,menubar=no,resizable=no,status=no,left=" + (screen.width - N) / 2 + ",top=" + (screen.height - O) / 2);
        if (c) {
            c.focus()
        }
        return
    }
    function J(L) {
        if ((/\api.weibo\.com$/).test(L.origin)) {
            var M = L.data;
            M = unescape(M);
            M = u(M);
            if (M.error_code) {
                M.success = -1;
                M.status = -1
            } else {
                M.success = 1;
                M.status = 1
            }
            n(M)
        }
    }
    function n(L) {
        B(L.status);
        if (L.success == 1) {
            d.save(L);
            C()
        } else {
            a.pop()
        }
    }
    function A(L) {
        if (!e) {
            return
        }
        C(L, true);
        if (!WB2.checkLogin()) {
            if (window.postMessage && !f.IE) {
                o({appkey: WB2._config.appkey})
            } else {
                E({appkey: WB2._config.appkey, requestType: "login", callback: n})
            }
        }
    }
    function q(M) {
        if (!WB2.checkLogin()) {
            return
        }
        if (WB2._config.appkey != null) {
            d.del();
            B(-1);
            try {
                p({url: "https://api.weibo.com/2/account/end_session.json?source=" + WB2._config.appkey, onComplete: function(N) {
                        M && M(N.data)
                    }})
            } catch (L) {
                throw"JavaScript SDK: logout error"
            }
        }
    }
    function B(L) {
        if (L == null) {
            return
        }
        w = L
    }
    function z() {
        return w == 1
    }
    var d = {load: function() {
            if (!i.core.obj.isEmpty(WB2.oauthData)) {
                return WB2.oauthData
            } else {
                var M = D.get("weibojs_" + WB2._config.appkey);
                M = unescape(M);
                var L = u(M);
                return L
            }
        }, save: function(L) {
            WB2.oauthData = L;
            var M = "access_token=" + (L.access_token || "") + "&refresh_token=" + (L.refresh_token || "") + "&expires_in=" + (L.expires_in || 0) + "&uid=" + (L.uid || "") + "&status=" + (L.status || w || -1);
            D.set("weibojs_" + WB2._config.appkey, M, {path: "/", domain: document.domain})
        }, del: function() {
            WB2.oauthData = {};
            D.remove("weibojs_" + WB2._config.appkey, {path: "/", domain: document.domain})
        }};
    function g(M) {
        var N = M || d.load();
        var O = N.access_token || "";
        var L = N.expires_in || "";
        if (O != "") {
            w = 1
        }
        p({url: y, onComplete: function(P) {
                P = P || {};
                if (P.status == 1 && P.access_token) {
                    d.save(P)
                }
                if (P.error) {
                    e = false;
                    WB2.log(P.error);
                    return
                }
                w = P.status;
                C()
            }, args: {source: WB2._config.appkey}})
    }
    var H = function(L) {
        if (L.access_token) {
            w = 1;
            e = true;
            var M = {status: w, access_token: L.access_token};
            d.save(M)
        }
    };
    window.WB2 = window.WB2 || {};
    WB2.widget = {};
    var s = F();
    WB2._config = {};
    WB2._config.version = s.version;
    WB2._config.appkey = s.appkey;
    WB2._config.secret = s.secret;
    WB2._config.host = "http://js.t.sinajs.cn";
    WB2._config.cssHost = "http://img.t.sinajs.cn";
    WB2._config.cdn_version = "20130425";
    WB2.oauthData = {};
    WB2.DEBUG = v;
    WB2.log = j;
    WB2.init = H;
    WB2.login = A;
    WB2.logout = q;
    WB2.checkLogin = z;
    WB2.anyWhere = l;
    WB2.anyWhere._instances = {};
    WB2.Cookie = d;
    WB2.regIframeRequest = E;
    WB2._config.appkey && g();
    i.conf.api.wbml();
    if (window.postMessage && !f.IE) {
        i.core.evt.addEvent(window, "message", J)
    }
})();