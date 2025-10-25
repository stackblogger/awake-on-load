import { AwakeJsPlugin, AwakeJsOptions } from '../src/index';

describe('AwakeJsPlugin Core Functionality', () => {
  describe('Constructor and Configuration', () => {
    it('should initialize with default options', () => {
      const plugin = new AwakeJsPlugin();
      expect(plugin).toBeInstanceOf(AwakeJsPlugin);
    });

    it('should merge provided options with defaults', () => {
      const options: AwakeJsOptions = {
        timeout: 5000,
        enabled: false
      };
      const plugin = new AwakeJsPlugin(options);
      expect(plugin).toBeInstanceOf(AwakeJsPlugin);
    });

    it('should handle empty options object', () => {
      const plugin = new AwakeJsPlugin({});
      expect(plugin).toBeInstanceOf(AwakeJsPlugin);
    });

    it('should accept all configuration options', () => {
      const options: AwakeJsOptions = {
        enabled: true,
        timeout: 15000,
        include: [/\.html$/],
        exclude: [/admin\.html/],
        convertSrcToDataSrc: true
      };
      const plugin = new AwakeJsPlugin(options);
      expect(plugin).toBeInstanceOf(AwakeJsPlugin);
    });
  });

  describe('Configuration Validation', () => {
    it('should accept valid timeout values', () => {
      expect(() => new AwakeJsPlugin({ timeout: 0 })).not.toThrow();
      expect(() => new AwakeJsPlugin({ timeout: 1000 })).not.toThrow();
      expect(() => new AwakeJsPlugin({ timeout: 60000 })).not.toThrow();
      expect(() => new AwakeJsPlugin({ timeout: -1000 })).not.toThrow();
    });

    it('should accept valid boolean values', () => {
      expect(() => new AwakeJsPlugin({ enabled: true })).not.toThrow();
      expect(() => new AwakeJsPlugin({ enabled: false })).not.toThrow();
      expect(() => new AwakeJsPlugin({ convertSrcToDataSrc: true })).not.toThrow();
      expect(() => new AwakeJsPlugin({ convertSrcToDataSrc: false })).not.toThrow();
    });

    it('should accept valid regex arrays', () => {
      expect(() => new AwakeJsPlugin({ include: [/\.html$/] })).not.toThrow();
      expect(() => new AwakeJsPlugin({ exclude: [/admin/] })).not.toThrow();
      expect(() => new AwakeJsPlugin({ include: [], exclude: [] })).not.toThrow();
    });

    it('should accept complex regex patterns', () => {
      expect(() => new AwakeJsPlugin({ 
        include: [/^index\.html$/, /^admin\/.*\.html$/, /.*\.template\.html$/] 
      })).not.toThrow();
      expect(() => new AwakeJsPlugin({ 
        exclude: [/^admin\.html$/, /^private\/.*\.html$/, /.*\.test\.html$/] 
      })).not.toThrow();
    });
  });

  describe('Combined Configuration', () => {
    it('should accept all options together', () => {
      const options: AwakeJsOptions = {
        enabled: true,
        timeout: 5000,
        include: [/\.html$/],
        exclude: [/admin/],
        convertSrcToDataSrc: true
      };
      const plugin = new AwakeJsPlugin(options);
      expect(plugin).toBeInstanceOf(AwakeJsPlugin);
    });

    it('should accept partial configuration', () => {
      const plugin = new AwakeJsPlugin({
        timeout: 3000,
        convertSrcToDataSrc: false
      });
      expect(plugin).toBeInstanceOf(AwakeJsPlugin);
    });

    it('should handle undefined and null values', () => {
      const plugin = new AwakeJsPlugin({
        enabled: undefined,
        timeout: undefined,
        include: undefined,
        exclude: undefined,
        convertSrcToDataSrc: undefined
      });
      expect(plugin).toBeInstanceOf(AwakeJsPlugin);
    });

    it('should handle mixed valid and invalid values', () => {
      const plugin = new AwakeJsPlugin({
        enabled: true,
        timeout: 'invalid' as any,
        include: ['invalid'] as any,
        exclude: null as any,
        convertSrcToDataSrc: false
      });
      expect(plugin).toBeInstanceOf(AwakeJsPlugin);
    });
  });

  describe('Type Safety', () => {
    it('should accept valid AwakeJsOptions interface', () => {
      const validOptions: AwakeJsOptions = {
        enabled: true,
        timeout: 10000,
        include: [/\.html$/],
        exclude: [/admin/],
        convertSrcToDataSrc: true
      };
      const plugin = new AwakeJsPlugin(validOptions);
      expect(plugin).toBeInstanceOf(AwakeJsPlugin);
    });

    it('should handle optional properties', () => {
      const partialOptions: Partial<AwakeJsOptions> = {
        timeout: 5000,
        convertSrcToDataSrc: false
      };
      const plugin = new AwakeJsPlugin(partialOptions);
      expect(plugin).toBeInstanceOf(AwakeJsPlugin);
    });
  });
});
