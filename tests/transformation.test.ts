import { AwakeJsPlugin } from '../src/index';

// Testable plugin class to access private methods
class TestableAwakeJsPlugin extends AwakeJsPlugin {
  public testShouldProcessFile(filename: string): boolean {
    return (this as any).shouldProcessFile(filename);
  }

  public testConvertSrcToDataSrc(html: string): string {
    return (this as any).convertSrcToDataSrc(html);
  }

  public testShouldConvertScript(src: string): boolean {
    return (this as any).shouldConvertScript(src);
  }

  public testShouldConvertLink(href: string): boolean {
    return (this as any).shouldConvertLink(href);
  }

  public testInjectLazyLoaderScript(html: string, script: string): string {
    return (this as any).injectLazyLoaderScript(html, script);
  }

  public testTransformHtml(html: string, script: string): string {
    return (this as any).transformHtml(html, script);
  }
}

describe('AwakeJsPlugin Transformation Logic', () => {
  let plugin: TestableAwakeJsPlugin;

  beforeEach(() => {
    plugin = new TestableAwakeJsPlugin();
  });

  describe('File Processing', () => {
    it('should process HTML files by default', () => {
      expect(plugin.testShouldProcessFile('index.html')).toBe(true);
      expect(plugin.testShouldProcessFile('about.html')).toBe(true);
      expect(plugin.testShouldProcessFile('contact.htm')).toBe(false);
    });

    it('should not process non-HTML files by default', () => {
      expect(plugin.testShouldProcessFile('style.css')).toBe(false);
      expect(plugin.testShouldProcessFile('script.js')).toBe(false);
      expect(plugin.testShouldProcessFile('image.png')).toBe(false);
    });

    it('should respect include patterns', () => {
      const pluginWithInclude = new TestableAwakeJsPlugin({
        include: [/\.html$/, /\.htm$/]
      });
      
      expect(pluginWithInclude.testShouldProcessFile('index.html')).toBe(true);
      expect(pluginWithInclude.testShouldProcessFile('about.htm')).toBe(true);
      expect(pluginWithInclude.testShouldProcessFile('style.css')).toBe(false);
    });

    it('should respect exclude patterns', () => {
      const pluginWithExclude = new TestableAwakeJsPlugin({
        exclude: [/admin/, /private/]
      });
      
      expect(pluginWithExclude.testShouldProcessFile('index.html')).toBe(true);
      expect(pluginWithExclude.testShouldProcessFile('admin.html')).toBe(false);
      expect(pluginWithExclude.testShouldProcessFile('private.html')).toBe(false);
    });

    it('should handle both include and exclude patterns', () => {
      const pluginWithBoth = new TestableAwakeJsPlugin({
        include: [/\.html$/],
        exclude: [/admin/]
      });
      
      expect(pluginWithBoth.testShouldProcessFile('index.html')).toBe(true);
      expect(pluginWithBoth.testShouldProcessFile('admin.html')).toBe(false);
      expect(pluginWithBoth.testShouldProcessFile('style.css')).toBe(false);
    });
  });

  describe('Script Conversion Logic', () => {
    it('should convert regular JS files', () => {
      expect(plugin.testShouldConvertScript('app.js')).toBe(true);
      expect(plugin.testShouldConvertScript('vendor.js')).toBe(true);
      expect(plugin.testShouldConvertScript('main.js')).toBe(true);
    });

    it('should convert webpack chunks', () => {
      expect(plugin.testShouldConvertScript('vendor.chunk.js')).toBe(true);
      expect(plugin.testShouldConvertScript('webpack.bundle.js')).toBe(true);
      expect(plugin.testShouldConvertScript('chunk.abc123.js')).toBe(true);
    });

    it('should not convert data URIs', () => {
      expect(plugin.testShouldConvertScript('data:text/javascript,console.log("test")')).toBe(false);
      expect(plugin.testShouldConvertScript('data:application/javascript,alert(1)')).toBe(false);
    });

    it('should not convert blob URIs', () => {
      expect(plugin.testShouldConvertScript('blob:https://example.com/123')).toBe(false);
      expect(plugin.testShouldConvertScript('blob:http://localhost:3000/abc')).toBe(false);
    });

    it('should convert external JS files', () => {
      expect(plugin.testShouldConvertScript('https://cdn.example.com/jquery.js')).toBe(true);
      expect(plugin.testShouldConvertScript('http://localhost:3000/app.js')).toBe(true);
    });

    it('should not convert non-JS files', () => {
      expect(plugin.testShouldConvertScript('style.css')).toBe(false);
      expect(plugin.testShouldConvertScript('image.png')).toBe(false);
      expect(plugin.testShouldConvertScript('data.json')).toBe(false);
    });
  });

  describe('Link Conversion Logic', () => {
    it('should convert CSS files', () => {
      expect(plugin.testShouldConvertLink('style.css')).toBe(true);
      expect(plugin.testShouldConvertLink('main.css')).toBe(true);
      expect(plugin.testShouldConvertLink('theme.css')).toBe(true);
    });

    it('should convert webpack CSS chunks', () => {
      expect(plugin.testShouldConvertLink('vendor.chunk.css')).toBe(true);
      expect(plugin.testShouldConvertLink('webpack.bundle.css')).toBe(true);
      expect(plugin.testShouldConvertLink('chunk.abc123.css')).toBe(true);
    });

    it('should not convert data URIs', () => {
      expect(plugin.testShouldConvertLink('data:text/css,body{color:red}')).toBe(false);
      expect(plugin.testShouldConvertLink('data:application/css,h1{font-size:2em}')).toBe(false);
    });

    it('should not convert blob URIs', () => {
      expect(plugin.testShouldConvertLink('blob:https://example.com/123')).toBe(false);
      expect(plugin.testShouldConvertLink('blob:http://localhost:3000/abc')).toBe(false);
    });

    it('should convert external CSS files', () => {
      expect(plugin.testShouldConvertLink('https://cdn.example.com/bootstrap.css')).toBe(true);
      expect(plugin.testShouldConvertLink('http://localhost:3000/style.css')).toBe(true);
    });

    it('should not convert non-CSS files', () => {
      expect(plugin.testShouldConvertLink('script.js')).toBe(false);
      expect(plugin.testShouldConvertLink('image.png')).toBe(false);
      expect(plugin.testShouldConvertLink('data.json')).toBe(false);
    });
  });

  describe('HTML Transformation', () => {
    it('should convert single script', () => {
      const html = '<script src="app.js"></script>';
      const result = plugin.testConvertSrcToDataSrc(html);
      expect(result).toBe('<script data-src="app.js"></script>');
    });

    it('should convert single link', () => {
      const html = '<link rel="stylesheet" href="style.css">';
      const result = plugin.testConvertSrcToDataSrc(html);
      expect(result).toBe('<link rel="stylesheet" data-href="style.css">');
    });

    it('should convert multiple scripts and links', () => {
      const html = `
        <link rel="stylesheet" href="style.css">
        <script src="vendor.js"></script>
        <script src="app.js"></script>
      `;
      const result = plugin.testConvertSrcToDataSrc(html);
      expect(result).toContain('data-href="style.css"');
      expect(result).toContain('data-src="vendor.js"');
      expect(result).toContain('data-src="app.js"');
    });

    it('should handle scripts with attributes', () => {
      const html = '<script type="text/javascript" src="app.js" async defer></script>';
      const result = plugin.testConvertSrcToDataSrc(html);
      expect(result).toContain('type="text/javascript"');
      expect(result).toContain('data-src="app.js"');
      expect(result).toContain('async');
      expect(result).toContain('defer');
    });

    it('should handle links with attributes', () => {
      const html = '<link rel="stylesheet" type="text/css" href="style.css" media="screen">';
      const result = plugin.testConvertSrcToDataSrc(html);
      expect(result).toContain('rel="stylesheet"');
      expect(result).toContain('type="text/css"');
      expect(result).toContain('data-href="style.css"');
      expect(result).toContain('media="screen"');
    });

    it('should not convert data URIs', () => {
      const html = '<script src="data:text/javascript,console.log(\'test\')"></script>';
      const result = plugin.testConvertSrcToDataSrc(html);
      expect(result).toBe('<script src="data:text/javascript,console.log(\'test\')"></script>');
    });

    it('should not convert blob URIs', () => {
      const html = '<script src="blob:https://example.com/123"></script>';
      const result = plugin.testConvertSrcToDataSrc(html);
      expect(result).toBe('<script src="blob:https://example.com/123"></script>');
    });

    it('should handle empty HTML', () => {
      const html = '';
      const result = plugin.testConvertSrcToDataSrc(html);
      expect(result).toBe('');
    });

    it('should handle HTML with no scripts or links', () => {
      const html = '<html><head><title>Test</title></head><body><h1>Hello</h1></body></html>';
      const result = plugin.testConvertSrcToDataSrc(html);
      expect(result).toBe(html);
    });
  });

  describe('Script Injection', () => {
    const testScript = '<script>console.log("test");</script>';

    it('should inject script before closing body tag', () => {
      const html = '<html><head></head><body><h1>Test</h1></body></html>';
      const result = plugin.testInjectLazyLoaderScript(html, testScript);
      expect(result).toBe('<html><head></head><body><h1>Test</h1>' + testScript + '\n</body></html>');
    });

    it('should inject script before closing html tag when no body', () => {
      const html = '<html><head></head><h1>Test</h1></html>';
      const result = plugin.testInjectLazyLoaderScript(html, testScript);
      expect(result).toBe('<html><head></head><h1>Test</h1>' + testScript + '\n</html>');
    });

    it('should append script when no body or html closing tags', () => {
      const html = '<h1>Test</h1>';
      const result = plugin.testInjectLazyLoaderScript(html, testScript);
      expect(result).toBe('<h1>Test</h1>' + testScript);
    });

    it('should handle empty HTML', () => {
      const html = '';
      const result = plugin.testInjectLazyLoaderScript(html, testScript);
      expect(result).toBe(testScript);
    });

    it('should handle HTML with only body tag', () => {
      const html = '<body></body>';
      const result = plugin.testInjectLazyLoaderScript(html, testScript);
      expect(result).toBe('<body>' + testScript + '\n</body>');
    });

    it('should handle HTML with only html tag', () => {
      const html = '<html></html>';
      const result = plugin.testInjectLazyLoaderScript(html, testScript);
      expect(result).toBe('<html>' + testScript + '\n</html>');
    });
  });

  describe('Transform HTML Integration', () => {
    it('should transform HTML with conversion enabled', () => {
      const pluginWithConversion = new TestableAwakeJsPlugin({ convertSrcToDataSrc: true });
      const html = '<script src="app.js"></script>';
      const script = '<script>console.log("test");</script>';
      
      const result = pluginWithConversion.testTransformHtml(html, script);
      
      expect(result).toContain('data-src="app.js"');
      expect(result).toContain('<script>console.log("test");</script>');
    });

    it('should transform HTML with conversion disabled', () => {
      const pluginWithoutConversion = new TestableAwakeJsPlugin({ convertSrcToDataSrc: false });
      const html = '<script src="app.js"></script>';
      const script = '<script>console.log("test");</script>';
      
      const result = pluginWithoutConversion.testTransformHtml(html, script);
      
      expect(result).toContain('src="app.js"');
      expect(result).not.toContain('data-src="app.js"');
      expect(result).toContain('<script>console.log("test");</script>');
    });

    it('should handle empty HTML', () => {
      const html = '';
      const script = '<script>console.log("test");</script>';
      
      const result = plugin.testTransformHtml(html, script);
      
      expect(result).toBe('<script>console.log("test");</script>');
    });
  });
});
