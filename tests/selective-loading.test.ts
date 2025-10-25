import { TriggyPlugin } from '../src/index';

class TestableTriggyPlugin extends TriggyPlugin {
  public testShouldConvertScript(src: string): boolean {
    return (this as any).shouldConvertScript(src);
  }

  public testShouldConvertLink(href: string): boolean {
    return (this as any).shouldConvertLink(href);
  }
}

describe('TriggyPlugin - Selective Loading', () => {
  describe('lazyLoadFiles configuration', () => {
    it('should only convert files specified in lazyLoadFiles array', () => {
      const plugin = new TestableTriggyPlugin({
        lazyLoadFiles: ['app.js', 'utils.js', 'styles.css']
      });

      // Files in lazyLoadFiles should be converted
      expect(plugin.testShouldConvertScript('app.js')).toBe(true);
      expect(plugin.testShouldConvertScript('utils.js')).toBe(true);
      expect(plugin.testShouldConvertLink('styles.css')).toBe(true);

      // Files not in lazyLoadFiles should NOT be converted
      expect(plugin.testShouldConvertScript('critical.js')).toBe(false);
      expect(plugin.testShouldConvertScript('vendor.js')).toBe(false);
      expect(plugin.testShouldConvertLink('bootstrap.css')).toBe(false);
    });

    it('should match files with partial names', () => {
      const plugin = new TestableTriggyPlugin({
        lazyLoadFiles: ['app', 'utils', 'styles']
      });

      // Should match files containing the specified strings
      expect(plugin.testShouldConvertScript('app.js')).toBe(true);
      expect(plugin.testShouldConvertScript('app.min.js')).toBe(true);
      expect(plugin.testShouldConvertScript('utils.js')).toBe(true);
      expect(plugin.testShouldConvertLink('styles.css')).toBe(true);
      expect(plugin.testShouldConvertLink('styles.min.css')).toBe(true);

      // Should not match unrelated files
      expect(plugin.testShouldConvertScript('critical.js')).toBe(false);
      expect(plugin.testShouldConvertLink('bootstrap.css')).toBe(false);
    });

    it('should work with full file paths', () => {
      const plugin = new TestableTriggyPlugin({
        lazyLoadFiles: ['/js/app.js', '/css/styles.css', 'vendor/utils.js']
      });

      expect(plugin.testShouldConvertScript('/js/app.js')).toBe(true);
      expect(plugin.testShouldConvertScript('vendor/utils.js')).toBe(true);
      expect(plugin.testShouldConvertLink('/css/styles.css')).toBe(true);

      expect(plugin.testShouldConvertScript('app.js')).toBe(false);
      expect(plugin.testShouldConvertLink('styles.css')).toBe(false);
    });

    it('should handle empty lazyLoadFiles array', () => {
      const plugin = new TestableTriggyPlugin({
        lazyLoadFiles: []
      });

      // Should fall back to default behavior (convert all .js/.css files)
      expect(plugin.testShouldConvertScript('app.js')).toBe(true);
      expect(plugin.testShouldConvertScript('utils.js')).toBe(true);
      expect(plugin.testShouldConvertLink('styles.css')).toBe(true);
      expect(plugin.testShouldConvertLink('bootstrap.css')).toBe(true);
    });

    it('should handle undefined lazyLoadFiles', () => {
      const plugin = new TestableTriggyPlugin({
        // lazyLoadFiles not specified
      });

      // Should fall back to default behavior
      expect(plugin.testShouldConvertScript('app.js')).toBe(true);
      expect(plugin.testShouldConvertScript('utils.js')).toBe(true);
      expect(plugin.testShouldConvertLink('styles.css')).toBe(true);
    });

    it('should still exclude data: and blob: URLs even with lazyLoadFiles', () => {
      const plugin = new TestableTriggyPlugin({
        lazyLoadFiles: ['app.js', 'styles.css']
      });

      expect(plugin.testShouldConvertScript('data:text/javascript,console.log("test")')).toBe(false);
      expect(plugin.testShouldConvertScript('blob:https://example.com/123')).toBe(false);
      expect(plugin.testShouldConvertLink('data:text/css,body{color:red}')).toBe(false);
      expect(plugin.testShouldConvertLink('blob:https://example.com/456')).toBe(false);
    });

    it('should still convert webpack chunks even with lazyLoadFiles', () => {
      const plugin = new TestableTriggyPlugin({
        lazyLoadFiles: ['app.js'] // Only app.js in the list
      });

      // Webpack chunks should still be converted regardless of lazyLoadFiles
      expect(plugin.testShouldConvertScript('main.abc123.js')).toBe(true);
      expect(plugin.testShouldConvertScript('chunk.def456.js')).toBe(true);
      expect(plugin.testShouldConvertLink('styles.ghi789.css')).toBe(true);
    });

    it('should be case sensitive', () => {
      const plugin = new TestableTriggyPlugin({
        lazyLoadFiles: ['App.js', 'STYLES.css']
      });

      expect(plugin.testShouldConvertScript('App.js')).toBe(true);
      expect(plugin.testShouldConvertScript('app.js')).toBe(false);
      expect(plugin.testShouldConvertLink('STYLES.css')).toBe(true);
      expect(plugin.testShouldConvertLink('styles.css')).toBe(false);
    });

    it('should work with multiple file extensions', () => {
      const plugin = new TestableTriggyPlugin({
        lazyLoadFiles: ['app', 'styles']
      });

      expect(plugin.testShouldConvertScript('app.js')).toBe(true);
      expect(plugin.testShouldConvertScript('app.min.js')).toBe(true);
      expect(plugin.testShouldConvertScript('app.ts')).toBe(true);
      expect(plugin.testShouldConvertLink('styles.css')).toBe(true);
      expect(plugin.testShouldConvertLink('styles.scss')).toBe(true);
    });
  });

  describe('integration with convertSrcToDataSrc', () => {
    it('should respect convertSrcToDataSrc: false even with lazyLoadFiles', () => {
      const plugin = new TestableTriggyPlugin({
        convertSrcToDataSrc: false,
        lazyLoadFiles: ['app.js', 'styles.css']
      });

      // Should not convert anything when convertSrcToDataSrc is false
      expect(plugin.testShouldConvertScript('app.js')).toBe(false);
      expect(plugin.testShouldConvertScript('utils.js')).toBe(false);
      expect(plugin.testShouldConvertLink('styles.css')).toBe(false);
      expect(plugin.testShouldConvertLink('bootstrap.css')).toBe(false);
    });

    it('should work with convertSrcToDataSrc: true and lazyLoadFiles', () => {
      const plugin = new TestableTriggyPlugin({
        convertSrcToDataSrc: true,
        lazyLoadFiles: ['app.js', 'styles.css']
      });

      expect(plugin.testShouldConvertScript('app.js')).toBe(true);
      expect(plugin.testShouldConvertScript('utils.js')).toBe(false);
      expect(plugin.testShouldConvertLink('styles.css')).toBe(true);
      expect(plugin.testShouldConvertLink('bootstrap.css')).toBe(false);
    });
  });
});
