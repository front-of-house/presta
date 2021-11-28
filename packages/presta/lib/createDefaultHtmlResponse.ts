import status from 'statuses'

export function createDefaultHtmlResponse({ statusCode }: { statusCode: number }) {
  return `<!-- built with presta https://npm.im/presta -->
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>${statusCode} — ${status.message[statusCode]}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;900&display=swap" rel="stylesheet"> 
        <link rel='stylesheet' href='https://unpkg.com/svbstrate@5.1.0/svbstrate.css' />
        <style>
          * {
            font-family: 'Inter', 'sans-serif';
          }
        </style>
      </head>
      <body class='w f aic jcc' style='height: 100vh'>
        <div class='p12 tac'>
          <h1>${statusCode}</h1>
          <p>${status.message[statusCode]}</p>
        </div>
      </body>
    </html>
  `
}
