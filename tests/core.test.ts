import { AwakeOnLoadPlugin, AwakeOnLoadOptions } from '../src/index';

describe('AwakeOnLoadPlugin Core Functionality', () => {
  describe('Constructor and Configuration', () => {
    it('should initialize with default options', () => {
      const plugin = new AwakeOnLoadPlugin();
      expect(plugin).toBeInstanceOf(AwakeOnLoadPlugin);
    });

    it('should merge provided options with defaults', () => {
      const options: AwakeOnLoadOptions = {
        timeout: 5000,
        enabled: false
      };
      const plugin = new AwakeOnLoadPlugin(options);
      expect(plugin).toBeInstanceOf(AwakeOnLoadPlugin);
    });

    it('should handle empty options object', () => {
      const plugin = new AwakeOnLoadPlugin({});
      expect(plugin).toBeInstanceOf(AwakeOnLoadPlugin);
    });

    it('should accept all configuration options', () => {
      const options: AwakeOnLoadOptions = {
        enabled: true,
        timeout: 15000,
        include: [/\.html$/],
        exclude: [/admin\.html/],
        convertSrcToDataSrc: true
      };
      const plugin = new AwakeOnLoadPlugin(options);
      expect(plugin).toBeInstanceOf(AwakeOnLoadPlugin);
    });
  });

  describe('Configuration Validation', () => {
    it('should accept valid timeout values', () => {
      expect(() => new AwakeOnLoadPlugin({ timeout: 0 })).not.toThrow();
      expect(() => new AwakeOnLoadPlugin({ timeout: 1000 })).not.toThrow();
      expect(() => new AwakeOnLoadPlugin({ timeout: 60000 })).not.toThrow();
      expect(() => new AwakeOnLoadPlugin({ timeout: -1000 })).not.toThrow();
    });

    it('should accept valid boolean values', () => {
      expect(() => new AwakeOnLoadPlugin({ enabled: true })).not.toThrow();
      expect(() => new AwakeOnLoadPlugin({ enabled: false })).not.toThrow();
      expect(() => new AwakeOnLoadPlugin({ convertSrcToDataSrc: true })).not.toThrow();
      expect(() => new AwakeOnLoadPlugin({ convertSrcToDataSrc: false })).not.toThrow();
    });

    it('should accept valid regex arrays', () => {
      expect(() => new AwakeOnLoadPlugin({ include: [/\.html$/] })).not.toThrow();
      expect(() => new AwakeOnLoadPlugin({ exclude: [/admin/] })).not.toThrow();
      expect(() => new AwakeOnLoadPlugin({ include: [], exclude: [] })).not.toThrow();
    });

    it('should accept complex regex patterns', () => {
      expect(() => new AwakeOnLoadPlugin({ 
        include: [/^index\.html$/, /^admin\/.*\.html$/, /.*\.template\.html$/] 
      })).not.toThrow();
      expect(() => new AwakeOnLoadPlugin({ 
        exclude: [/^admin\.html$/, /^private\/.*\.html$/, /.*\.test\.html$/] 
      })).not.toThrow();
    });
  });

  describe('Combined Configuration', () => {
    it('should accept all options together', () => {
      const options: AwakeOnLoadOptions = {
        enabled: true,
        timeout: 5000,
        include: [/\.html$/],
        exclude: [/admin/],
        convertSrcToDataSrc: true
      };
      const plugin = new AwakeOnLoadPlugin(options);
      expect(plugin).toBeInstanceOf(AwakeOnLoadPlugin);
    });

    it('should accept partial configuration', () => {
      const plugin = new AwakeOnLoadPlugin({
        timeout: 3000,
        convertSrcToDataSrc: false
      });
      expect(plugin).toBeInstanceOf(AwakeOnLoadPlugin);
    });

    it('should handle undefined and null values', () => {
      const plugin = new AwakeOnLoadPlugin({
        enabled: undefined,
        timeout: undefined,
        include: undefined,
        exclude: undefined,
        convertSrcToDataSrc: undefined
      });
      expect(plugin).toBeInstanceOf(AwakeOnLoadPlugin);
    });

    it('should handle mixed valid and invalid values', () => {
      const plugin = new AwakeOnLoadPlugin({
        enabled: true,
        timeout: 'invalid' as any,
        include: ['invalid'] as any,
        exclude: null as any,
        convertSrcToDataSrc: false
      });
      expect(plugin).toBeInstanceOf(AwakeOnLoadPlugin);
    });
  });

  describe('Type Safety', () => {
    it('should accept valid AwakeOnLoadOptions interface', () => {
      const validOptions: AwakeOnLoadOptions = {
        enabled: true,
        timeout: 10000,
        include: [/\.html$/],
        exclude: [/admin/],
        convertSrcToDataSrc: true
      };
      const plugin = new AwakeOnLoadPlugin(validOptions);
      expect(plugin).toBeInstanceOf(AwakeOnLoadPlugin);
    });

    it('should handle optional properties', () => {
      const partialOptions: Partial<AwakeOnLoadOptions> = {
        timeout: 5000,
        convertSrcToDataSrc: false
      };
      const plugin = new AwakeOnLoadPlugin(partialOptions);
      expect(plugin).toBeInstanceOf(AwakeOnLoadPlugin);
    });
  });
});
