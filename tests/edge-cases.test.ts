import { AwakeOnLoadPlugin } from '../src/index';

// Testable plugin class to access private methods
class TestableAwakeOnLoadPlugin extends AwakeOnLoadPlugin {
  public testConvertSrcToDataSrc(html: string): string {
    return (this as any).convertSrcToDataSrc(html);
  }

  public testInjectLazyLoaderScript(html: string, script: string): string {
    return (this as any).injectLazyLoaderScript(html, script);
  }
}

describe('AwakeOnLoadPlugin Edge Cases', () => {
  let plugin: TestableAwakeOnLoadPlugin;

  beforeEach(() => {
    plugin = new TestableAwakeOnLoadPlugin();
  });

  describe('HTML Edge Cases', () => {
    it('should handle HTML with only whitespace', () => {
      const html = '   \n\t  ';
      const result = plugin.testConvertSrcToDataSrc(html);
      expect(result).toBe(html);
    });

    it('should handle HTML with only comments', () => {
      const html = '<!-- This is a comment -->';
      const result = plugin.testConvertSrcToDataSrc(html);
      expect(result).toBe(html);
    });

    it('should handle HTML with mixed content', () => {
      const html = `
        <!-- Comment -->
        <script src="app.js"></script>
        <p>Some text</p>
        <link href="style.css" rel="stylesheet">
      `;
      const result = plugin.testConvertSrcToDataSrc(html);
      expect(result).toContain('data-src="app.js"');
      expect(result).toContain('data-href="style.css"');
    });

    it('should handle self-closing script tags', () => {
      const html = '<script src="app.js" />';
      const result = plugin.testConvertSrcToDataSrc(html);
      expect(result).toBe('<script data-src="app.js" />');
    });

    it('should handle self-closing link tags', () => {
      const html = '<link href="style.css" rel="stylesheet" />';
      const result = plugin.testConvertSrcToDataSrc(html);
      expect(result).toBe('<link data-href="style.css" rel="stylesheet" />');
    });

    it('should handle malformed script tags', () => {
      const html = '<script src="app.js" <script src="other.js">';
      const result = plugin.testConvertSrcToDataSrc(html);
      expect(result).toContain('data-src="other.js"');
    });

    it('should handle malformed link tags', () => {
      const html = '<link href="style.css" <link href="other.css">';
      const result = plugin.testConvertSrcToDataSrc(html);
      expect(result).toContain('data-href="other.css"');
    });

    it('should handle scripts with no src attribute', () => {
      const html = '<script>console.log("inline");</script>';
      const result = plugin.testConvertSrcToDataSrc(html);
      expect(result).toBe('<script>console.log("inline");</script>');
    });

    it('should handle HTML with nested tags', () => {
      const html = '<div><script src="app.js"></script></div>';
      const result = plugin.testConvertSrcToDataSrc(html);
      expect(result).toBe('<div><script data-src="app.js"></script></div>');
    });
  });

  describe('URL Edge Cases', () => {
    it('should handle URLs with encoded characters', () => {
      const html = '<script src="app%20with%20spaces.js"></script>';
      const result = plugin.testConvertSrcToDataSrc(html);
      expect(result).toBe('<script data-src="app%20with%20spaces.js"></script>');
    });

    it('should handle URLs with special characters', () => {
      const html = '<script src="app-with_underscores.js"></script>';
      const result = plugin.testConvertSrcToDataSrc(html);
      expect(result).toBe('<script data-src="app-with_underscores.js"></script>');
    });

    it('should handle relative URLs', () => {
      const html = '<script src="./js/app.js"></script>';
      const result = plugin.testConvertSrcToDataSrc(html);
      expect(result).toBe('<script data-src="./js/app.js"></script>');
    });

    it('should handle absolute URLs', () => {
      const html = '<script src="/js/app.js"></script>';
      const result = plugin.testConvertSrcToDataSrc(html);
      expect(result).toBe('<script data-src="/js/app.js"></script>');
    });

    it('should handle protocol-relative URLs', () => {
      const html = '<script src="//cdn.example.com/app.js"></script>';
      const result = plugin.testConvertSrcToDataSrc(html);
      expect(result).toBe('<script data-src="//cdn.example.com/app.js"></script>');
    });

    it('should handle URLs with ports', () => {
      const html = '<script src="http://localhost:3000/app.js"></script>';
      const result = plugin.testConvertSrcToDataSrc(html);
      expect(result).toBe('<script data-src="http://localhost:3000/app.js"></script>');
    });

    it('should handle URLs with paths', () => {
      const html = '<script src="https://example.com/path/to/app.js"></script>';
      const result = plugin.testConvertSrcToDataSrc(html);
      expect(result).toBe('<script data-src="https://example.com/path/to/app.js"></script>');
    });

    it('should handle URLs with query parameters', () => {
      const html = '<script src="app.js?v=1.0.0&debug=true"></script>';
      const result = plugin.testConvertSrcToDataSrc(html);
      expect(result).toBe('<script src="app.js?v=1.0.0&debug=true"></script>'); // Not converted due to query params
    });

    it('should handle URLs with hash fragments', () => {
      const html = '<script src="app.js#main"></script>';
      const result = plugin.testConvertSrcToDataSrc(html);
      expect(result).toBe('<script src="app.js#main"></script>'); // Not converted due to hash fragment
    });

    it('should handle Unicode characters in URLs', () => {
      const html = '<script src="приложение.js"></script>';
      const result = plugin.testConvertSrcToDataSrc(html);
      expect(result).toBe('<script data-src="приложение.js"></script>');
    });
  });

  describe('Script Injection Edge Cases', () => {
    const testScript = '<script>console.log("test");</script>';

    it('should handle HTML with nested tags', () => {
      const html = '<html><body><div><p>Content</p></div></body></html>';
      const result = plugin.testInjectLazyLoaderScript(html, testScript);
      expect(result).toBe('<html><body><div><p>Content</p></div>' + testScript + '\n</body></html>');
    });

    it('should handle HTML with uppercase tags', () => {
      const html = '<HTML><BODY><H1>Test</H1></BODY></HTML>';
      const result = plugin.testInjectLazyLoaderScript(html, testScript);
      expect(result).toBe('<HTML><BODY><H1>Test</H1>' + testScript + '\n</body></HTML>');
    });

    it('should handle HTML with mixed case tags', () => {
      const html = '<Html><Body><H1>Test</H1></Body></Html>';
      const result = plugin.testInjectLazyLoaderScript(html, testScript);
      expect(result).toBe('<Html><Body><H1>Test</H1>' + testScript + '\n</body></Html>');
    });

    it('should handle HTML with attributes on body tag', () => {
      const html = '<body class="main" id="app"><h1>Test</h1></body>';
      const result = plugin.testInjectLazyLoaderScript(html, testScript);
      expect(result).toBe('<body class="main" id="app"><h1>Test</h1>' + testScript + '\n</body>');
    });

    it('should handle HTML with attributes on html tag', () => {
      const html = '<html lang="en"><head></head><h1>Test</h1></html>';
      const result = plugin.testInjectLazyLoaderScript(html, testScript);
      expect(result).toBe('<html lang="en"><head></head><h1>Test</h1>' + testScript + '\n</html>');
    });

    it('should handle HTML with multiple body tags', () => {
      const html = '<body><h1>First</h1></body><body><h1>Second</h1></body>';
      const result = plugin.testInjectLazyLoaderScript(html, testScript);
      expect(result).toBe('<body><h1>First</h1>' + testScript + '\n</body><body><h1>Second</h1></body>');
    });

    it('should handle HTML with multiple html tags', () => {
      const html = '<html><h1>First</h1></html><html><h1>Second</h1></html>';
      const result = plugin.testInjectLazyLoaderScript(html, testScript);
      expect(result).toBe('<html><h1>First</h1>' + testScript + '\n</html><html><h1>Second</h1></html>');
    });
  });

  describe('Special Characters and Formatting', () => {
    it('should handle quotes in attribute values', () => {
      const html = '<script src="app.js" data-info="test \'quoted\' value"></script>';
      const result = plugin.testConvertSrcToDataSrc(html);
      expect(result).toContain('data-src="app.js"');
      expect(result).toContain('data-info="test \'quoted\' value"');
    });

    it('should handle newlines in HTML', () => {
      const html = '<script\n  src="app.js"\n  async\n></script>';
      const result = plugin.testConvertSrcToDataSrc(html);
      expect(result).toContain('data-src="app.js"');
    });

    it('should handle tabs in HTML', () => {
      const html = '<script\tsrc="app.js"\tasync></script>';
      const result = plugin.testConvertSrcToDataSrc(html);
      expect(result).toContain('data-src="app.js"');
    });

    it('should handle multiple spaces in HTML', () => {
      const html = '<script    src="app.js"    async></script>';
      const result = plugin.testConvertSrcToDataSrc(html);
      expect(result).toContain('data-src="app.js"');
    });

    it('should handle single quotes in script src', () => {
      const html = "<script src='app.js'></script>";
      const result = plugin.testConvertSrcToDataSrc(html);
      expect(result).toBe('<script data-src="app.js"></script>');
    });

    it('should handle single quotes in link href', () => {
      const html = "<link rel='stylesheet' href='style.css'>";
      const result = plugin.testConvertSrcToDataSrc(html);
      expect(result).toBe('<link rel=\'stylesheet\' data-href="style.css">');
    });
  });

  describe('Real-world HTML Scenarios', () => {
    it('should handle a complete HTML page', () => {
      const realWorldHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>My App</title>
          <link rel="stylesheet" href="https://cdn.example.com/bootstrap.css">
          <link rel="stylesheet" href="styles/main.css">
        </head>
        <body>
          <header>
            <nav>
              <a href="/">Home</a>
              <a href="/about">About</a>
            </nav>
          </header>
          
          <main>
            <h1>Welcome to My App</h1>
            <p>This is a sample application.</p>
          </main>
          
          <footer>
            <p>&copy; 2024 My App</p>
          </footer>
          
          <script src="https://cdn.example.com/jquery.min.js"></script>
          <script src="vendor.bundle.js"></script>
          <script src="app.bundle.js"></script>
        </body>
        </html>
      `;
      
      const result = plugin.testConvertSrcToDataSrc(realWorldHtml);
      
      expect(result).toContain('data-src="https://cdn.example.com/jquery.min.js"');
      expect(result).toContain('data-src="vendor.bundle.js"');
      expect(result).toContain('data-src="app.bundle.js"');
      expect(result).toContain('data-href="https://cdn.example.com/bootstrap.css"');
      expect(result).toContain('data-href="styles/main.css"');
    });

    it('should handle React application HTML template', () => {
      const reactHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <link rel="icon" href="/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#000000" />
          <meta name="description" content="Web site created using create-react-app" />
          <link rel="apple-touch-icon" href="/logo192.png" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="stylesheet" href="/static/css/main.abc123.css">
        </head>
        <body>
          <noscript>You need to enable JavaScript to run this app.</noscript>
          <div id="root"></div>
          <script src="/static/js/runtime-main.def456.js"></script>
          <script src="/static/js/2.ghi789.js"></script>
          <script src="/static/js/main.jkl012.js"></script>
        </body>
        </html>
      `;
      
      const result = plugin.testConvertSrcToDataSrc(reactHtml);
      
      expect(result).toContain('data-src="/static/js/runtime-main.def456.js"');
      expect(result).toContain('data-src="/static/js/2.ghi789.js"');
      expect(result).toContain('data-src="/static/js/main.jkl012.js"');
      expect(result).toContain('data-href="/static/css/main.abc123.css"');
    });

    it('should handle Vue.js application HTML template', () => {
      const vueHtml = `
        <!DOCTYPE html>
        <html lang="">
        <head>
          <meta charset="utf-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width,initial-scale=1.0">
          <link rel="icon" href="/favicon.ico">
          <title>vue-app</title>
          <link href="/css/app.css" rel="stylesheet">
          <link href="/css/chunk-vendors.css" rel="stylesheet">
        </head>
        <body>
          <noscript>
            <strong>We're sorry but vue-app doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
          </noscript>
          <div id="app"></div>
          <script src="/js/chunk-vendors.js"></script>
          <script src="/js/app.js"></script>
        </body>
        </html>
      `;
      
      const result = plugin.testConvertSrcToDataSrc(vueHtml);
      
      expect(result).toContain('data-src="/js/chunk-vendors.js"');
      expect(result).toContain('data-src="/js/app.js"');
      expect(result).toContain('data-href="/css/app.css"');
      expect(result).toContain('data-href="/css/chunk-vendors.css"');
    });
  });

  describe('Empty and Minimal Cases', () => {
    it('should handle empty string HTML', () => {
      const html = '';
      const result = plugin.testConvertSrcToDataSrc(html);
      expect(result).toBe('');
    });

    it('should handle script injection with empty HTML', () => {
      const html = '';
      const script = '<script>test</script>';
      const result = plugin.testInjectLazyLoaderScript(html, script);
      expect(result).toBe('<script>test</script>');
    });
  });
});
