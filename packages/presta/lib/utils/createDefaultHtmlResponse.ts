import status from 'statuses'

export function createDefaultHtmlResponse({ statusCode }: { statusCode: number }) {
  return `<!-- built with presta https://npm.im/presta -->
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>${statusCode} — ${status.message[statusCode]}</title>
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
          <h1>${statusCode}</h1>
          <p class='mb1'>${status.message[statusCode]}</p>

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
  `
}
