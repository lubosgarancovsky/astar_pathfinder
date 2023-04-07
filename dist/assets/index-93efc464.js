(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const e of i)if(e.type==="childList")for(const n of e.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&o(n)}).observe(document,{childList:!0,subtree:!0});function r(i){const e={};return i.integrity&&(e.integrity=i.integrity),i.referrerPolicy&&(e.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?e.credentials="include":i.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function o(i){if(i.ep)return;i.ep=!0;const e=r(i);fetch(i.href,e)}})();class O{constructor(){this.hasStart=!1,this.hasEnd=!1}}class k{constructor(t,r,o,i,e){this.row=t,this.col=r,this.x=r*o,this.y=t*o,this.size=o,this.color="#FFFFFF",this.type="empty",this.ctx=i,this.f=0,this.g=0,this.h=0,this.controller=e,this.neighbours=[],this.parent=void 0}updateNeighbours(t,r,o){let i=this.row,e=this.col;e<o-1&&t[i][e+1].type!="barrier"&&this.neighbours.push(t[i][e+1]),e>0&&t[i][e-1].type!="barrier"&&this.neighbours.push(t[i][e-1]),i<r-1&&t[i+1][e].type!="barrier"&&this.neighbours.push(t[i+1][e]),i>0&&t[i-1][e].type!="barrier"&&this.neighbours.push(t[i-1][e])}handleClick(t,r,o){t>=this.x&&r>=this.y&&t<=this.x+this.size&&r<=this.y+this.size&&(o==="start"&&(this.type==="barrier"||this.type==="empty")&&(this.controller.hasStart||(this.type="start",this.color="#322bfc",this.controller.hasStart=!0)),o==="finish"&&(this.type==="barrier"||this.type==="empty")&&(this.controller.hasEnd||(this.type="finish",this.color="#ff3838",this.controller.hasEnd=!0)),o==="barrier"&&this.type==="empty"&&(this.type="barrier",this.color="#242424"),o==="eraser"&&(this.type==="finish"&&(this.controller.hasEnd=!1),this.type==="start"&&(this.controller.hasStart=!1),this.type="empty",this.color="#FFFFFF"),this.draw())}draw(){this.ctx.fillStyle=this.color,this.ctx.strokeStyle="#dedede",this.ctx.fillRect(this.x,this.y,this.size,this.size),this.ctx.strokeRect(this.x,this.y,this.size,this.size)}setVisited(){this.color="#baffc4",this.draw()}setCurrent(){this.color="#2eff4c",this.draw()}setPath(){this.color="#ff1717",this.draw()}setHighlighted(){this.color="#32f3fa",this.draw()}reset(){this.color="#FFFFFF",this.type="empty",this.draw()}}const u=document.querySelector("#canvas"),P=u.getContext("2d"),g=document.querySelector(".start"),b=document.querySelector(".finish"),w=document.querySelector(".barrier"),v=document.querySelector(".eraser"),H=document.querySelector(".begin"),N=document.querySelector(".reset"),q=document.querySelector(".delayInput"),z=document.querySelector(".columnInput"),S=u.clientWidth,F=u.clientHeight;u.width=S;u.height=F;let a=z.value,d=Math.floor(S/a),f=Math.floor(F/d);console.log(` RowSize: ${f} colSize: ${a} spotSize: ${d}`);let h=[[]],E=!1,y="barrier";document.addEventListener("mousedown",R);document.addEventListener("mousemove",C);document.addEventListener("mouseup",()=>{E=!1});g.addEventListener("click",()=>{y="start",m(g)});b.addEventListener("click",()=>{y="finish",m(b)});w.addEventListener("click",()=>{y="barrier",m(w)});v.addEventListener("click",()=>{y="eraser",m(v)});H.addEventListener("click",D);N.addEventListener("click",$);const p=new O;function m(s){let t=[g,b,w,v,g];for(let r of t)r.classList.remove("active");s.classList.add("active")}function R(s){E=!0,C(s)}function C(s){if(E){let t=s.clientX-u.getBoundingClientRect().left,r=s.clientY-u.getBoundingClientRect().top;for(let o=0;o<f;o++)for(let i=0;i<a;i++)h[o][i].handleClick(t,r,y)}}function M(){for(let s=0;s<f;s++){for(let t=0;t<a;t++)h[s].push(new k(s,t,d,P,p));h.push(new Array)}for(let s=0;s<f;s++)for(let t=0;t<a;t++)h[s][t].draw(P)}const I=s=>new Promise(t=>setTimeout(t,q.value));function B(s,t){let r=Math.abs(s.row-t.row),o=Math.abs(s.col-t.col);return r+o}M();async function D(){if(!p.hasStart){alert("You have to specify the starting node");return}if(!p.hasEnd){alert("You have to specify the ending node");return}let s=null,t=null,r=[],o=[],i=[];for(let e=0;e<f;e++)for(let n=0;n<a;n++)h[e][n].updateNeighbours(h,f,a),h[e][n].type==="start"&&(s=h[e][n]),h[e][n].type==="finish"&&(t=h[e][n]);if(s==null||t==null||s==null||t==null)return[];for(r.push(s);r.length>0;){q.value>0&&await I();let e=0;for(let l=0;l<r.length;l++)r[l].f<r[e].f&&(e=l);let n=r[e];for(let l of r)l.setCurrent();if(n===t){let l=n;for(i.push(l);l.parent;)l=l.parent,i.push(l);let c=i.reverse();return Y(c,s,t),c}r.splice(e,1),o.push(n),n.setVisited();let L=n.neighbours;for(let l=0;l<L.length;l++){let c=L[l];if(!o.includes(c)){let x=n.g+1;if(!r.includes(c))r.push(c);else if(x>=c.g)continue;c.g=x,c.h=B(c,t),c.f=c.g+c.h,c.parent=n}}}return alert("There isn't any valid path availible"),[]}async function Y(s,t,r){for(let o=0;o<s.length;o++)await I(),s[o].setPath();t.setHighlighted(),r.setHighlighted()}function $(){h=[[]],a=z.value,d=Math.floor(S/a),f=Math.floor(F/d),p.hasEnd=!1,p.hasStart=!1,M()}
