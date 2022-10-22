var a=Object.create;var i=Object.defineProperty;var o=Object.getOwnPropertyDescriptor;var n=Object.getOwnPropertyNames;var h=Object.getPrototypeOf,p=Object.prototype.hasOwnProperty;var r=e=>i(e,"__esModule",{value:!0});var f=(e,t)=>{r(e);for(var l in t)i(e,l,{get:t[l],enumerable:!0})},m=(e,t,l)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of n(t))!p.call(e,s)&&s!=="default"&&i(e,s,{get:()=>t[s],enumerable:!(l=o(t,s))||l.enumerable});return e},g=e=>m(r(i(e!=null?a(h(e)):{},"default",e&&e.__esModule&&"default"in e?{get:()=>e.default,enumerable:!0}:{value:e,enumerable:!0})),e);f(exports,{createDefaultHtmlResponse:()=>d});var c=g(require("statuses"));function d({statusCode:e}){return`<!-- built with presta https://npm.im/presta -->
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>${e} \u2014\xA0${c.default.message[e]}</title>
        <link rel="icon" type="image/png" href="https://presta.run/favicon.png">
        <link rel="icon" type="image/svg" href="https://presta.run/favicon.svg">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;900&display=swap" rel="stylesheet"> 
        <link rel='stylesheet' href='https://unpkg.com/svbstrate@5.1.0/svbstrate.css' />
        <style>
          html,body {
            font-family: 'Inter', 'sans-serif';
            color: #23283D;
            background-color: #DADEF0;
          }
          #favicon {
            fill: #23283D;
          }
          @media (prefers-color-scheme: dark) {
            html,body {
              color: #DADEF0;
              background-color: #23283D;
            }
            #favicon {
              fill: #DADEF0;
            }
          }
        </style>
      </head>
      <body class='w f aic jcc' style='height: 100vh'>
        <div class='p12 tac'>
          <h1>${e}</h1>
          <p class='mb1'>${c.default.message[e]}</p>

          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#a)">
              <path id="favicon" fill-rule="evenodd" clip-rule="evenodd" d="M10.4 7c-.3 0-.8.2-1 .5L1.1 22.1c-.2.3 0 .6.3.6l4 .3-2.1 2.6c-.2.3-.1.6.2.6l16.8 1.3c.4 0 .8-.2 1-.4L32 13.9c.2-.2.1-.5-.2-.5l-6.4-.5 2.2-4c.2-.3 0-.5-.3-.6L10.4 7ZM24 12.8l1.9-3.4-15.5-1.2-7.7 13.4 3.6.3 7.5-9.4c.3-.3.7-.5 1-.4l9.2.7ZM7.6 22l7.1-8.9 8.7.7-5.2 9L7.6 22Zm-1 1.1 11.6 1c.3 0 .8-.3 1-.6l5.5-9.6 5.5.5-9.7 12L5 25.2l1.7-2Z" fill="#23283D"/>
            </g>
            <defs>
              <clipPath id="a">
                <path fill="#fff" d="M0 0h32v32H0z"/>
              </clipPath>
            </defs>
          </svg>
        </div>
      </body>
    </html>
  `}0&&(module.exports={createDefaultHtmlResponse});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vbGliL3V0aWxzL2NyZWF0ZURlZmF1bHRIdG1sUmVzcG9uc2UudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCBzdGF0dXMgZnJvbSAnc3RhdHVzZXMnXG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVEZWZhdWx0SHRtbFJlc3BvbnNlKHsgc3RhdHVzQ29kZSB9OiB7IHN0YXR1c0NvZGU6IG51bWJlciB9KSB7XG4gIHJldHVybiBgPCEtLSBidWlsdCB3aXRoIHByZXN0YSBodHRwczovL25wbS5pbS9wcmVzdGEgLS0+XG4gICAgPCFET0NUWVBFIGh0bWw+XG4gICAgPGh0bWw+XG4gICAgICA8aGVhZD5cbiAgICAgICAgPG1ldGEgY2hhcnNldD1cIlVURi04XCIgLz5cbiAgICAgICAgPG1ldGEgbmFtZT1cInZpZXdwb3J0XCIgY29udGVudD1cIndpZHRoPWRldmljZS13aWR0aCxpbml0aWFsLXNjYWxlPTFcIiAvPlxuICAgICAgICA8dGl0bGU+JHtzdGF0dXNDb2RlfSBcdTIwMTRcdTAwQTAke3N0YXR1cy5tZXNzYWdlW3N0YXR1c0NvZGVdfTwvdGl0bGU+XG4gICAgICAgIDxsaW5rIHJlbD1cImljb25cIiB0eXBlPVwiaW1hZ2UvcG5nXCIgaHJlZj1cImh0dHBzOi8vcHJlc3RhLnJ1bi9mYXZpY29uLnBuZ1wiPlxuICAgICAgICA8bGluayByZWw9XCJpY29uXCIgdHlwZT1cImltYWdlL3N2Z1wiIGhyZWY9XCJodHRwczovL3ByZXN0YS5ydW4vZmF2aWNvbi5zdmdcIj5cbiAgICAgICAgPGxpbmsgcmVsPVwicHJlY29ubmVjdFwiIGhyZWY9XCJodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tXCI+XG4gICAgICAgIDxsaW5rIHJlbD1cInByZWNvbm5lY3RcIiBocmVmPVwiaHR0cHM6Ly9mb250cy5nc3RhdGljLmNvbVwiIGNyb3Nzb3JpZ2luPlxuICAgICAgICA8bGluayBocmVmPVwiaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3MyP2ZhbWlseT1JbnRlcjp3Z2h0QDQwMDs5MDAmZGlzcGxheT1zd2FwXCIgcmVsPVwic3R5bGVzaGVldFwiPiBcbiAgICAgICAgPGxpbmsgcmVsPSdzdHlsZXNoZWV0JyBocmVmPSdodHRwczovL3VucGtnLmNvbS9zdmJzdHJhdGVANS4xLjAvc3Zic3RyYXRlLmNzcycgLz5cbiAgICAgICAgPHN0eWxlPlxuICAgICAgICAgIGh0bWwsYm9keSB7XG4gICAgICAgICAgICBmb250LWZhbWlseTogJ0ludGVyJywgJ3NhbnMtc2VyaWYnO1xuICAgICAgICAgICAgY29sb3I6ICMyMzI4M0Q7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjREFERUYwO1xuICAgICAgICAgIH1cbiAgICAgICAgICAjZmF2aWNvbiB7XG4gICAgICAgICAgICBmaWxsOiAjMjMyODNEO1xuICAgICAgICAgIH1cbiAgICAgICAgICBAbWVkaWEgKHByZWZlcnMtY29sb3Itc2NoZW1lOiBkYXJrKSB7XG4gICAgICAgICAgICBodG1sLGJvZHkge1xuICAgICAgICAgICAgICBjb2xvcjogI0RBREVGMDtcbiAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogIzIzMjgzRDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICNmYXZpY29uIHtcbiAgICAgICAgICAgICAgZmlsbDogI0RBREVGMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIDwvc3R5bGU+XG4gICAgICA8L2hlYWQ+XG4gICAgICA8Ym9keSBjbGFzcz0ndyBmIGFpYyBqY2MnIHN0eWxlPSdoZWlnaHQ6IDEwMHZoJz5cbiAgICAgICAgPGRpdiBjbGFzcz0ncDEyIHRhYyc+XG4gICAgICAgICAgPGgxPiR7c3RhdHVzQ29kZX08L2gxPlxuICAgICAgICAgIDxwIGNsYXNzPSdtYjEnPiR7c3RhdHVzLm1lc3NhZ2Vbc3RhdHVzQ29kZV19PC9wPlxuXG4gICAgICAgICAgPHN2ZyB3aWR0aD1cIjMyXCIgaGVpZ2h0PVwiMzJcIiB2aWV3Qm94PVwiMCAwIDMyIDMyXCIgZmlsbD1cIm5vbmVcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI+XG4gICAgICAgICAgICA8ZyBjbGlwLXBhdGg9XCJ1cmwoI2EpXCI+XG4gICAgICAgICAgICAgIDxwYXRoIGlkPVwiZmF2aWNvblwiIGZpbGwtcnVsZT1cImV2ZW5vZGRcIiBjbGlwLXJ1bGU9XCJldmVub2RkXCIgZD1cIk0xMC40IDdjLS4zIDAtLjguMi0xIC41TDEuMSAyMi4xYy0uMi4zIDAgLjYuMy42bDQgLjMtMi4xIDIuNmMtLjIuMy0uMS42LjIuNmwxNi44IDEuM2MuNCAwIC44LS4yIDEtLjRMMzIgMTMuOWMuMi0uMi4xLS41LS4yLS41bC02LjQtLjUgMi4yLTRjLjItLjMgMC0uNS0uMy0uNkwxMC40IDdaTTI0IDEyLjhsMS45LTMuNC0xNS41LTEuMi03LjcgMTMuNCAzLjYuMyA3LjUtOS40Yy4zLS4zLjctLjUgMS0uNGw5LjIuN1pNNy42IDIybDcuMS04LjkgOC43LjctNS4yIDlMNy42IDIyWm0tMSAxLjEgMTEuNiAxYy4zIDAgLjgtLjMgMS0uNmw1LjUtOS42IDUuNS41LTkuNyAxMkw1IDI1LjJsMS43LTJaXCIgZmlsbD1cIiMyMzI4M0RcIi8+XG4gICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICA8ZGVmcz5cbiAgICAgICAgICAgICAgPGNsaXBQYXRoIGlkPVwiYVwiPlxuICAgICAgICAgICAgICAgIDxwYXRoIGZpbGw9XCIjZmZmXCIgZD1cIk0wIDBoMzJ2MzJIMHpcIi8+XG4gICAgICAgICAgICAgIDwvY2xpcFBhdGg+XG4gICAgICAgICAgICA8L2RlZnM+XG4gICAgICAgICAgPC9zdmc+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9ib2R5PlxuICAgIDwvaHRtbD5cbiAgYFxufVxuIl0sCiAgIm1hcHBpbmdzIjogIm1sQkFBQSxtREFBbUIsdUJBRVosV0FBbUMsQ0FBRSxjQUFzQyxDQUNoRixNQUFPO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQU1RLGVBQWdCLFVBQU8sUUFBUTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsZ0JBNkJoQztBQUFBLDJCQUNXLFVBQU8sUUFBUTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7IiwKICAibmFtZXMiOiBbXQp9Cg==
