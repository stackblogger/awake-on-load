import { TriggyPlugin, TriggyOptions } from '../src/index';

describe('TriggyPlugin Core Functionality', () => {
  describe('Constructor and Configuration', () => {
    it('should initialize with default options', () => {
      const plugin = new TriggyPlugin();
      expect(plugin).toBeInstanceOf(TriggyPlugin);
    });

    it('should merge provided options with defaults', () => {
      const options: TriggyOptions = {
        timeout: 5000,
        enabled: false
      };
      const plugin = new TriggyPlugin(options);
      expect(plugin).toBeInstanceOf(TriggyPlugin);
    });

    it('should handle empty options object', () => {
      const plugin = new TriggyPlugin({});
      expect(plugin).toBeInstanceOf(TriggyPlugin);
    });

    it('should accept all configuration options', () => {
      const options: TriggyOptions = {
        enabled: true,
        timeout: 15000,
        include: [/\.html$/],
        exclude: [/admin\.html/],
        convertSrcToDataSrc: true
      };
      const plugin = new TriggyPlugin(options);
      expect(plugin).toBeInstanceOf(TriggyPlugin);
    });
  });

  describe('Configuration Validation', () => {
    it('should accept valid timeout values', () => {
      expect(() => new TriggyPlugin({ timeout: 0 })).not.toThrow();
      expect(() => new TriggyPlugin({ timeout: 1000 })).not.toThrow();
      expect(() => new TriggyPlugin({ timeout: 60000 })).not.toThrow();
      expect(() => new TriggyPlugin({ timeout: -1000 })).not.toThrow();
    });

    it('should accept valid boolean values', () => {
      expect(() => new TriggyPlugin({ enabled: true })).not.toThrow();
      expect(() => new TriggyPlugin({ enabled: false })).not.toThrow();
      expect(() => new TriggyPlugin({ convertSrcToDataSrc: true })).not.toThrow();
      expect(() => new TriggyPlugin({ convertSrcToDataSrc: false })).not.toThrow();
    });

    it('should accept valid regex arrays', () => {
      expect(() => new TriggyPlugin({ include: [/\.html$/] })).not.toThrow();
      expect(() => new TriggyPlugin({ exclude: [/admin/] })).not.toThrow();
      expect(() => new TriggyPlugin({ include: [], exclude: [] })).not.toThrow();
    });

    it('should accept complex regex patterns', () => {
      expect(() => new TriggyPlugin({ 
        include: [/^index\.html$/, /^admin\/.*\.html$/, /.*\.template\.html$/] 
      })).not.toThrow();
      expect(() => new TriggyPlugin({ 
        exclude: [/^admin\.html$/, /^private\/.*\.html$/, /.*\.test\.html$/] 
      })).not.toThrow();
    });
  });

  describe('Combined Configuration', () => {
    it('should accept all options together', () => {
      const options: TriggyOptions = {
        enabled: true,
        timeout: 5000,
        include: [/\.html$/],
        exclude: [/admin/],
        convertSrcToDataSrc: true
      };
      const plugin = new TriggyPlugin(options);
      expect(plugin).toBeInstanceOf(TriggyPlugin);
    });

    it('should accept partial configuration', () => {
      const plugin = new TriggyPlugin({
        timeout: 3000,
        convertSrcToDataSrc: false
      });
      expect(plugin).toBeInstanceOf(TriggyPlugin);
    });

    it('should handle undefined and null values', () => {
      const plugin = new TriggyPlugin({
        enabled: undefined,
        timeout: undefined,
        include: undefined,
        exclude: undefined,
        convertSrcToDataSrc: undefined
      });
      expect(plugin).toBeInstanceOf(TriggyPlugin);
    });

    it('should handle mixed valid and invalid values', () => {
      const plugin = new TriggyPlugin({
        enabled: true,
        timeout: 'invalid' as any,
        include: ['invalid'] as any,
        exclude: null as any,
        convertSrcToDataSrc: false
      });
      expect(plugin).toBeInstanceOf(TriggyPlugin);
    });
  });

  describe('Type Safety', () => {
    it('should accept valid TriggyOptions interface', () => {
      const validOptions: TriggyOptions = {
        enabled: true,
        timeout: 10000,
        include: [/\.html$/],
        exclude: [/admin/],
        convertSrcToDataSrc: true
      };
      const plugin = new TriggyPlugin(validOptions);
      expect(plugin).toBeInstanceOf(TriggyPlugin);
    });

    it('should handle optional properties', () => {
      const partialOptions: Partial<TriggyOptions> = {
        timeout: 5000,
        convertSrcToDataSrc: false
      };
      const plugin = new TriggyPlugin(partialOptions);
      expect(plugin).toBeInstanceOf(TriggyPlugin);
    });
  });
});
