(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function e(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(s){if(s.ep)return;s.ep=!0;const o=e(s);fetch(s.href,o)}})();/*!
 * Signature Pad v5.0.7 | https://github.com/szimek/signature_pad
 * (c) 2025 Szymon Nowak | Released under the MIT license
 */class p{constructor(t,e,i,s){if(isNaN(t)||isNaN(e))throw new Error(`Point is invalid: (${t}, ${e})`);this.x=+t,this.y=+e,this.pressure=i||0,this.time=s||Date.now()}distanceTo(t){return Math.sqrt(Math.pow(this.x-t.x,2)+Math.pow(this.y-t.y,2))}equals(t){return this.x===t.x&&this.y===t.y&&this.pressure===t.pressure&&this.time===t.time}velocityFrom(t){return this.time!==t.time?this.distanceTo(t)/(this.time-t.time):0}}class y{static fromPoints(t,e){const i=this.calculateControlPoints(t[0],t[1],t[2]).c2,s=this.calculateControlPoints(t[1],t[2],t[3]).c1;return new y(t[1],i,s,t[2],e.start,e.end)}static calculateControlPoints(t,e,i){const s=t.x-e.x,o=t.y-e.y,n=e.x-i.x,h=e.y-i.y,a={x:(t.x+e.x)/2,y:(t.y+e.y)/2},r={x:(e.x+i.x)/2,y:(e.y+i.y)/2},c=Math.sqrt(s*s+o*o),d=Math.sqrt(n*n+h*h),m=a.x-r.x,_=a.y-r.y,u=c+d==0?0:d/(c+d),g={x:r.x+m*u,y:r.y+_*u},x=e.x-g.x,E=e.y-g.y;return{c1:new p(a.x+x,a.y+E),c2:new p(r.x+x,r.y+E)}}constructor(t,e,i,s,o,n){this.startPoint=t,this.control2=e,this.control1=i,this.endPoint=s,this.startWidth=o,this.endWidth=n}length(){let e=0,i,s;for(let o=0;o<=10;o+=1){const n=o/10,h=this.point(n,this.startPoint.x,this.control1.x,this.control2.x,this.endPoint.x),a=this.point(n,this.startPoint.y,this.control1.y,this.control2.y,this.endPoint.y);if(o>0){const r=h-i,c=a-s;e+=Math.sqrt(r*r+c*c)}i=h,s=a}return e}point(t,e,i,s,o){return e*(1-t)*(1-t)*(1-t)+3*i*(1-t)*(1-t)*t+3*s*(1-t)*t*t+o*t*t*t}}class b{constructor(){try{this._et=new EventTarget}catch{this._et=document}}addEventListener(t,e,i){this._et.addEventListener(t,e,i)}dispatchEvent(t){return this._et.dispatchEvent(t)}removeEventListener(t,e,i){this._et.removeEventListener(t,e,i)}}function k(l,t=250){let e=0,i=null,s,o,n;const h=()=>{e=Date.now(),i=null,s=l.apply(o,n),i||(o=null,n=[])};return function(...r){const c=Date.now(),d=t-(c-e);return o=this,n=r,d<=0||d>t?(i&&(clearTimeout(i),i=null),e=c,s=l.apply(o,n),i||(o=null,n=[])):i||(i=window.setTimeout(h,d)),s}}class v extends b{constructor(t,e={}){var i,s,o;super(),this.canvas=t,this._drawingStroke=!1,this._isEmpty=!0,this._lastPoints=[],this._data=[],this._lastVelocity=0,this._lastWidth=0,this._handleMouseDown=n=>{!this._isLeftButtonPressed(n,!0)||this._drawingStroke||this._strokeBegin(this._pointerEventToSignatureEvent(n))},this._handleMouseMove=n=>{if(!this._isLeftButtonPressed(n,!0)||!this._drawingStroke){this._strokeEnd(this._pointerEventToSignatureEvent(n),!1);return}this._strokeMoveUpdate(this._pointerEventToSignatureEvent(n))},this._handleMouseUp=n=>{this._isLeftButtonPressed(n)||this._strokeEnd(this._pointerEventToSignatureEvent(n))},this._handleTouchStart=n=>{n.targetTouches.length!==1||this._drawingStroke||(n.cancelable&&n.preventDefault(),this._strokeBegin(this._touchEventToSignatureEvent(n)))},this._handleTouchMove=n=>{if(n.targetTouches.length===1){if(n.cancelable&&n.preventDefault(),!this._drawingStroke){this._strokeEnd(this._touchEventToSignatureEvent(n),!1);return}this._strokeMoveUpdate(this._touchEventToSignatureEvent(n))}},this._handleTouchEnd=n=>{n.targetTouches.length===0&&(n.cancelable&&n.preventDefault(),this.canvas.removeEventListener("touchmove",this._handleTouchMove),this._strokeEnd(this._touchEventToSignatureEvent(n)))},this._handlePointerDown=n=>{!n.isPrimary||!this._isLeftButtonPressed(n)||this._drawingStroke||(n.preventDefault(),this._strokeBegin(this._pointerEventToSignatureEvent(n)))},this._handlePointerMove=n=>{if(n.isPrimary){if(!this._isLeftButtonPressed(n,!0)||!this._drawingStroke){this._strokeEnd(this._pointerEventToSignatureEvent(n),!1);return}n.preventDefault(),this._strokeMoveUpdate(this._pointerEventToSignatureEvent(n))}},this._handlePointerUp=n=>{!n.isPrimary||this._isLeftButtonPressed(n)||(n.preventDefault(),this._strokeEnd(this._pointerEventToSignatureEvent(n)))},this.velocityFilterWeight=e.velocityFilterWeight||.7,this.minWidth=e.minWidth||.5,this.maxWidth=e.maxWidth||2.5,this.throttle=(i=e.throttle)!==null&&i!==void 0?i:16,this.minDistance=(s=e.minDistance)!==null&&s!==void 0?s:5,this.dotSize=e.dotSize||0,this.penColor=e.penColor||"black",this.backgroundColor=e.backgroundColor||"rgba(0,0,0,0)",this.compositeOperation=e.compositeOperation||"source-over",this.canvasContextOptions=(o=e.canvasContextOptions)!==null&&o!==void 0?o:{},this._strokeMoveUpdate=this.throttle?k(v.prototype._strokeUpdate,this.throttle):v.prototype._strokeUpdate,this._ctx=t.getContext("2d",this.canvasContextOptions),this.clear(),this.on()}clear(){const{_ctx:t,canvas:e}=this;t.fillStyle=this.backgroundColor,t.clearRect(0,0,e.width,e.height),t.fillRect(0,0,e.width,e.height),this._data=[],this._reset(this._getPointGroupOptions()),this._isEmpty=!0}fromDataURL(t,e={}){return new Promise((i,s)=>{const o=new Image,n=e.ratio||window.devicePixelRatio||1,h=e.width||this.canvas.width/n,a=e.height||this.canvas.height/n,r=e.xOffset||0,c=e.yOffset||0;this._reset(this._getPointGroupOptions()),o.onload=()=>{this._ctx.drawImage(o,r,c,h,a),i()},o.onerror=d=>{s(d)},o.crossOrigin="anonymous",o.src=t,this._isEmpty=!1})}toDataURL(t="image/png",e){switch(t){case"image/svg+xml":return typeof e!="object"&&(e=void 0),`data:image/svg+xml;base64,${btoa(this.toSVG(e))}`;default:return typeof e!="number"&&(e=void 0),this.canvas.toDataURL(t,e)}}on(){this.canvas.style.touchAction="none",this.canvas.style.msTouchAction="none",this.canvas.style.userSelect="none";const t=/Macintosh/.test(navigator.userAgent)&&"ontouchstart"in document;window.PointerEvent&&!t?this._handlePointerEvents():(this._handleMouseEvents(),"ontouchstart"in window&&this._handleTouchEvents())}off(){this.canvas.style.touchAction="auto",this.canvas.style.msTouchAction="auto",this.canvas.style.userSelect="auto",this.canvas.removeEventListener("pointerdown",this._handlePointerDown),this.canvas.removeEventListener("mousedown",this._handleMouseDown),this.canvas.removeEventListener("touchstart",this._handleTouchStart),this._removeMoveUpEventListeners()}_getListenerFunctions(){var t;const e=window.document===this.canvas.ownerDocument?window:(t=this.canvas.ownerDocument.defaultView)!==null&&t!==void 0?t:this.canvas.ownerDocument;return{addEventListener:e.addEventListener.bind(e),removeEventListener:e.removeEventListener.bind(e)}}_removeMoveUpEventListeners(){const{removeEventListener:t}=this._getListenerFunctions();t("pointermove",this._handlePointerMove),t("pointerup",this._handlePointerUp),t("mousemove",this._handleMouseMove),t("mouseup",this._handleMouseUp),t("touchmove",this._handleTouchMove),t("touchend",this._handleTouchEnd)}isEmpty(){return this._isEmpty}fromData(t,{clear:e=!0}={}){e&&this.clear(),this._fromData(t,this._drawCurve.bind(this),this._drawDot.bind(this)),this._data=this._data.concat(t)}toData(){return this._data}_isLeftButtonPressed(t,e){return e?t.buttons===1:(t.buttons&1)===1}_pointerEventToSignatureEvent(t){return{event:t,type:t.type,x:t.clientX,y:t.clientY,pressure:"pressure"in t?t.pressure:0}}_touchEventToSignatureEvent(t){const e=t.changedTouches[0];return{event:t,type:t.type,x:e.clientX,y:e.clientY,pressure:e.force}}_getPointGroupOptions(t){return{penColor:t&&"penColor"in t?t.penColor:this.penColor,dotSize:t&&"dotSize"in t?t.dotSize:this.dotSize,minWidth:t&&"minWidth"in t?t.minWidth:this.minWidth,maxWidth:t&&"maxWidth"in t?t.maxWidth:this.maxWidth,velocityFilterWeight:t&&"velocityFilterWeight"in t?t.velocityFilterWeight:this.velocityFilterWeight,compositeOperation:t&&"compositeOperation"in t?t.compositeOperation:this.compositeOperation}}_strokeBegin(t){if(!this.dispatchEvent(new CustomEvent("beginStroke",{detail:t,cancelable:!0})))return;const{addEventListener:i}=this._getListenerFunctions();switch(t.event.type){case"mousedown":i("mousemove",this._handleMouseMove),i("mouseup",this._handleMouseUp);break;case"touchstart":i("touchmove",this._handleTouchMove),i("touchend",this._handleTouchEnd);break;case"pointerdown":i("pointermove",this._handlePointerMove),i("pointerup",this._handlePointerUp);break}this._drawingStroke=!0;const s=this._getPointGroupOptions(),o=Object.assign(Object.assign({},s),{points:[]});this._data.push(o),this._reset(s),this._strokeUpdate(t)}_strokeUpdate(t){if(!this._drawingStroke)return;if(this._data.length===0){this._strokeBegin(t);return}this.dispatchEvent(new CustomEvent("beforeUpdateStroke",{detail:t}));const e=this._createPoint(t.x,t.y,t.pressure),i=this._data[this._data.length-1],s=i.points,o=s.length>0&&s[s.length-1],n=o?e.distanceTo(o)<=this.minDistance:!1,h=this._getPointGroupOptions(i);if(!o||!(o&&n)){const a=this._addPoint(e,h);o?a&&this._drawCurve(a,h):this._drawDot(e,h),s.push({time:e.time,x:e.x,y:e.y,pressure:e.pressure})}this.dispatchEvent(new CustomEvent("afterUpdateStroke",{detail:t}))}_strokeEnd(t,e=!0){this._removeMoveUpEventListeners(),this._drawingStroke&&(e&&this._strokeUpdate(t),this._drawingStroke=!1,this.dispatchEvent(new CustomEvent("endStroke",{detail:t})))}_handlePointerEvents(){this._drawingStroke=!1,this.canvas.addEventListener("pointerdown",this._handlePointerDown)}_handleMouseEvents(){this._drawingStroke=!1,this.canvas.addEventListener("mousedown",this._handleMouseDown)}_handleTouchEvents(){this.canvas.addEventListener("touchstart",this._handleTouchStart)}_reset(t){this._lastPoints=[],this._lastVelocity=0,this._lastWidth=(t.minWidth+t.maxWidth)/2,this._ctx.fillStyle=t.penColor,this._ctx.globalCompositeOperation=t.compositeOperation}_createPoint(t,e,i){const s=this.canvas.getBoundingClientRect();return new p(t-s.left,e-s.top,i,new Date().getTime())}_addPoint(t,e){const{_lastPoints:i}=this;if(i.push(t),i.length>2){i.length===3&&i.unshift(i[0]);const s=this._calculateCurveWidths(i[1],i[2],e),o=y.fromPoints(i,s);return i.shift(),o}return null}_calculateCurveWidths(t,e,i){const s=i.velocityFilterWeight*e.velocityFrom(t)+(1-i.velocityFilterWeight)*this._lastVelocity,o=this._strokeWidth(s,i),n={end:o,start:this._lastWidth};return this._lastVelocity=s,this._lastWidth=o,n}_strokeWidth(t,e){return Math.max(e.maxWidth/(t+1),e.minWidth)}_drawCurveSegment(t,e,i){const s=this._ctx;s.moveTo(t,e),s.arc(t,e,i,0,2*Math.PI,!1),this._isEmpty=!1}_drawCurve(t,e){const i=this._ctx,s=t.endWidth-t.startWidth,o=Math.ceil(t.length())*2;i.beginPath(),i.fillStyle=e.penColor;for(let n=0;n<o;n+=1){const h=n/o,a=h*h,r=a*h,c=1-h,d=c*c,m=d*c;let _=m*t.startPoint.x;_+=3*d*h*t.control1.x,_+=3*c*a*t.control2.x,_+=r*t.endPoint.x;let u=m*t.startPoint.y;u+=3*d*h*t.control1.y,u+=3*c*a*t.control2.y,u+=r*t.endPoint.y;const g=Math.min(t.startWidth+r*s,e.maxWidth);this._drawCurveSegment(_,u,g)}i.closePath(),i.fill()}_drawDot(t,e){const i=this._ctx,s=e.dotSize>0?e.dotSize:(e.minWidth+e.maxWidth)/2;i.beginPath(),this._drawCurveSegment(t.x,t.y,s),i.closePath(),i.fillStyle=e.penColor,i.fill()}_fromData(t,e,i){for(const s of t){const{points:o}=s,n=this._getPointGroupOptions(s);if(o.length>1)for(let h=0;h<o.length;h+=1){const a=o[h],r=new p(a.x,a.y,a.pressure,a.time);h===0&&this._reset(n);const c=this._addPoint(r,n);c&&e(c,n)}else this._reset(n),i(o[0],n)}}toSVG({includeBackgroundColor:t=!1}={}){const e=this._data,i=Math.max(window.devicePixelRatio||1,1),s=0,o=0,n=this.canvas.width/i,h=this.canvas.height/i,a=document.createElementNS("http://www.w3.org/2000/svg","svg");if(a.setAttribute("xmlns","http://www.w3.org/2000/svg"),a.setAttribute("xmlns:xlink","http://www.w3.org/1999/xlink"),a.setAttribute("viewBox",`${s} ${o} ${n} ${h}`),a.setAttribute("width",n.toString()),a.setAttribute("height",h.toString()),t&&this.backgroundColor){const r=document.createElement("rect");r.setAttribute("width","100%"),r.setAttribute("height","100%"),r.setAttribute("fill",this.backgroundColor),a.appendChild(r)}return this._fromData(e,(r,{penColor:c})=>{const d=document.createElement("path");if(!isNaN(r.control1.x)&&!isNaN(r.control1.y)&&!isNaN(r.control2.x)&&!isNaN(r.control2.y)){const m=`M ${r.startPoint.x.toFixed(3)},${r.startPoint.y.toFixed(3)} C ${r.control1.x.toFixed(3)},${r.control1.y.toFixed(3)} ${r.control2.x.toFixed(3)},${r.control2.y.toFixed(3)} ${r.endPoint.x.toFixed(3)},${r.endPoint.y.toFixed(3)}`;d.setAttribute("d",m),d.setAttribute("stroke-width",(r.endWidth*2.25).toFixed(3)),d.setAttribute("stroke",c),d.setAttribute("fill","none"),d.setAttribute("stroke-linecap","round"),a.appendChild(d)}},(r,{penColor:c,dotSize:d,minWidth:m,maxWidth:_})=>{const u=document.createElement("circle"),g=d>0?d:(m+_)/2;u.setAttribute("r",g.toString()),u.setAttribute("cx",r.x.toString()),u.setAttribute("cy",r.y.toString()),u.setAttribute("fill",c),a.appendChild(u)}),a.outerHTML}}class M{addSignature(t){throw new Error("Method not implemented")}getSignatures(){throw new Error("Method not implemented")}getSignatureById(t){throw new Error("Method not implemented")}updateSignature(t,e){throw new Error("Method not implemented")}deleteSignature(t){throw new Error("Method not implemented")}}class C extends M{constructor(){super(),this.signatures=[]}addSignature(t){const e={id:Date.now(),data:t,createdAt:new Date};return this.signatures.push(e),e}getSignatures(){return this.signatures}getSignatureById(t){return this.signatures.find(e=>e.id===t)}updateSignature(t,e){const i=this.getSignatureById(t);return i?(i.data=e,i.updatedAt=new Date,i):null}deleteSignature(t){const e=this.signatures.findIndex(i=>i.id===t);return e!==-1?this.signatures.splice(e,1)[0]:null}}const S=new C,f=document.getElementById("signatureCanvas");function P(){const l=Math.max(window.devicePixelRatio||1,1);f.width=f.offsetWidth*l,f.height=f.offsetHeight*l,f.getContext("2d").scale(l,l)}window.addEventListener("resize",P);P();const w=new v(f);document.getElementById("saveBtn").addEventListener("click",()=>{if(w.isEmpty())alert("Please provide a signature first.");else{const l=w.toDataURL(),t=S.addSignature(l);console.log("Saved signature:",t),alert("Signature saved locally!"),w.clear()}});document.getElementById("displayBtn").addEventListener("click",()=>{const l=S.getSignatures(),t=document.getElementById("signatureContainer");t.innerHTML="",l.length===0?t.innerHTML="<p>No signatures saved.</p>":l.forEach(e=>{const i=document.createElement("img");i.src=e.data,i.alt="Saved Signature",t.appendChild(i)})});
