(function(e){function t(t){for(var r,i,c=t[0],l=t[1],s=t[2],p=0,d=[];p<c.length;p++)i=c[p],Object.prototype.hasOwnProperty.call(o,i)&&o[i]&&d.push(o[i][0]),o[i]=0;for(r in l)Object.prototype.hasOwnProperty.call(l,r)&&(e[r]=l[r]);u&&u(t);while(d.length)d.shift()();return a.push.apply(a,s||[]),n()}function n(){for(var e,t=0;t<a.length;t++){for(var n=a[t],r=!0,c=1;c<n.length;c++){var l=n[c];0!==o[l]&&(r=!1)}r&&(a.splice(t--,1),e=i(i.s=n[0]))}return e}var r={},o={app:0},a=[];function i(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=e,i.c=r,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)i.d(n,r,function(t){return e[t]}.bind(null,r));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="";var c=window["webpackJsonp"]=window["webpackJsonp"]||[],l=c.push.bind(c);c.push=t,c=c.slice();for(var s=0;s<c.length;s++)t(c[s]);var u=l;a.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"3a1e":function(e,t,n){e.exports=n.p+"img/ferrenet.66f34de4.png"},"56d7":function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var r=n("2b0e"),o=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-app",[n("Header"),n("Footer"),n("v-main",[n("router-view")],1)],1)},a=[],i=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("v-navigation-drawer",{attrs:{clipped:e.$vuetify.breakpoint.lgAndUp,fixed:"",app:""},scopedSlots:e._u([{key:"prepend",fn:function(){return[r("v-list-item",{staticClass:"px-1"},[r("v-img",{attrs:{src:n("b640"),"max-height":"80px","max-width":"240px",contain:""}})],1)]},proxy:!0}]),model:{value:e.drawer,callback:function(t){e.drawer=t},expression:"drawer"}},[r("v-divider"),r("v-list",{attrs:{dense:""}},[[r("v-list-item",{attrs:{link:""},on:{click:e.IrPrincipal}},[r("v-list-item-action",[r("v-icon",{attrs:{color:"#ef6b01"}},[e._v("mdi-home")])],1),r("v-list-item-content",[r("v-list-item-title",{staticStyle:{color:"#424242"}},[e._v("Home")])],1)],1)]],2)],1),r("v-app-bar",{attrs:{"clipped-left":e.$vuetify.breakpoint.lgAndUp,color:"#ef6b01",dark:"",app:"",fixed:""}},[r("v-app-bar-nav-icon",{on:{click:function(t){t.stopPropagation(),e.drawer=!e.drawer}}}),r("v-img",{staticClass:"mx-2",attrs:{src:n("3a1e"),"max-height":"40","max-width":"200px",contain:""}}),r("v-spacer")],1)],1)},c=[],l={data:function(){return{drawer:null}},methods:{IrPrincipal:function(){"/"!==this.$route.path&&this.$router.push({name:"Home"})}}},s=l,u=n("2877"),p=n("6544"),d=n.n(p),f=n("40dc"),v=n("5bc1"),m=n("ce7e"),h=n("132d"),g=n("adda"),b=n("8860"),w=n("da13"),x=n("1800"),y=n("5d23"),_=n("f774"),V=n("2fa4"),j=Object(u["a"])(s,i,c,!1,null,null,null),k=j.exports;d()(j,{VAppBar:f["a"],VAppBarNavIcon:v["a"],VDivider:m["a"],VIcon:h["a"],VImg:g["a"],VList:b["a"],VListItem:w["a"],VListItemAction:x["a"],VListItemContent:y["a"],VListItemTitle:y["b"],VNavigationDrawer:_["a"],VSpacer:V["a"]});var O=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-footer",{attrs:{app:"",color:"#ef6b01"}},[n("span",{staticClass:"white--text text-center"},[e._v("© "+e._s((new Date).getFullYear()))])])},S=[],A={name:"Footer",data:function(){return{}}},I=A,P=n("553a"),$=Object(u["a"])(I,O,S,!1,null,null,null),F=$.exports;d()($,{VFooter:P["a"]});var L={name:"App",components:{Header:k,Footer:F},data:function(){return{}}},C=L,H=n("7496"),N=n("f6c4"),T=Object(u["a"])(C,o,a,!1,null,null,null),B=T.exports;d()(T,{VApp:H["a"],VMain:N["a"]});var D=n("9483");Object(D["a"])("".concat("","service-worker.js"),{ready:function(){console.log("App is being served from cache by a service worker.\nFor more details, visit https://goo.gl/AFskqB")},registered:function(){console.log("Service worker has been registered.")},cached:function(){console.log("Content has been cached for offline use.")},updatefound:function(){console.log("New content is downloading.")},updated:function(){console.log("New content is available; please refresh.")},offline:function(){console.log("No internet connection found. App is running in offline mode.")},error:function(e){console.error("Error during service worker registration:",e)}});var E=n("8c4f"),M=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-container",[n("StreamBarcodeReader",{on:{decode:function(t,n,r){return e.onDecode(t,n,r)},loaded:function(){return e.onLoaded()}}}),e._v(" Input Value: "+e._s(e.text||"Nothing")+" ")],1)},J=[],R=n("f337"),U={name:"Home",components:{StreamBarcodeReader:R["a"]},data:function(){return{text:"",id:null}},methods:{onDecode:function(e,t,n){var r=this;console.log(e,t,n),this.text=e,this.id&&clearTimeout(this.id),this.id=setTimeout((function(){r.text===e&&(r.text="")}),5e3)},onLoaded:function(){console.log("load")}}},q=U,Y=n("a523"),z=Object(u["a"])(q,M,J,!1,null,null,null),G=z.exports;d()(z,{VContainer:Y["a"]}),r["a"].use(E["a"]);var K=[{path:"/",name:"Home",component:G}],Q=new E["a"]({mode:"history",base:"",routes:K}),W=Q,X=n("2f62");r["a"].use(X["a"]);var Z=new X["a"].Store({state:{},mutations:{},actions:{},modules:{}}),ee=n("f309");r["a"].use(ee["a"]);var te=new ee["a"]({});r["a"].config.productionTip=!1,new r["a"]({router:W,store:Z,vuetify:te,render:function(e){return e(B)}}).$mount("#app")},b640:function(e,t,n){e.exports=n.p+"img/logo.133eb47c.jpg"}});
//# sourceMappingURL=app.8fca1565.js.map