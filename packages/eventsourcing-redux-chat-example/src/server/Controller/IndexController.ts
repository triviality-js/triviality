import { Request, Response } from 'express';

export class IndexController {

  public action(_req: Request, res: Response) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
      <head>
          <meta charset="utf-8">
          <title>Chat app</title>
          <link rel="stylesheet" href="/semantic-ui-css/semantic.min.css"/>
      </head>

      <body>
          <div id="app">Moment please..</div>
          <script src="/vendors.js"></script>
          <script src="/runtime.js"></script>
          <script src="/client.js"></script>
      </body>
      </html>
`);
  }

}
