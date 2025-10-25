import { Compiler, Compilation, sources } from 'webpack';
import * as fs from 'fs';
import * as path from 'path';

export interface TriggyOptions {
  enabled?: boolean;
  timeout?: number;
  exclude?: RegExp[];
  include?: RegExp[];
  convertSrcToDataSrc?: boolean;
}

export class TriggyPlugin {
  private options: TriggyOptions;

  constructor(options: TriggyOptions = {}) {
    this.options = {
      enabled: true,
      timeout: 10000,
      exclude: [],
      include: [/\.html$/],
      convertSrcToDataSrc: true,
      ...options
    };
  }

  apply(compiler: Compiler): void {
    const pluginName = 'TriggyPlugin';

    compiler.hooks.compilation.tap(pluginName, (compilation: Compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE
        },
        (assets) => {
          if (!this.options.enabled) return;

          const lazyLoaderScript = this.getLazyLoaderScript();

          Object.keys(assets).forEach((filename) => {
            if (this.shouldProcessFile(filename)) {
              const asset = assets[filename];
              const source = asset.source();
              const transformedSource = this.transformHtml(source.toString(), lazyLoaderScript);
              
              compilation.updateAsset(filename, new sources.RawSource(transformedSource));
            }
          });
        }
      );
    });
  }

  private shouldProcessFile(filename: string): boolean {
    if (this.options.include && this.options.include.length > 0) {
      const shouldInclude = this.options.include.some(pattern => pattern.test(filename));
      if (!shouldInclude) return false;
    }

    if (this.options.exclude && this.options.exclude.length > 0) {
      const shouldExclude = this.options.exclude.some(pattern => pattern.test(filename));
      if (shouldExclude) return false;
    }

    return true;
  }

  private getLazyLoaderScript(): string {
    const scriptPath = path.join(__dirname, 'lazy-loader.js');
    let script = fs.readFileSync(scriptPath, 'utf8');
    
    if (this.options.timeout !== 10000) {
      script = script.replace('10000', this.options.timeout!.toString());
    }
    
    return `<script>${script}</script>`;
  }

  private transformHtml(html: string, lazyLoaderScript: string): string {
    let transformedHtml = html;

    if (this.options.convertSrcToDataSrc) {
      transformedHtml = this.convertSrcToDataSrc(transformedHtml);
    }
    transformedHtml = this.injectLazyLoaderScript(transformedHtml, lazyLoaderScript);

    return transformedHtml;
  }

  private convertSrcToDataSrc(html: string): string {
    const scriptRegex = /<script([^>]*)\ssrc\s*=\s*["']([^"']+)["']([^>]*)>/gi;
    const linkRegex = /<link([^>]*)\shref\s*=\s*["']([^"']+)["']([^>]*)>/gi;

    let transformedHtml = html.replace(scriptRegex, (match, before, src, after) => {
      if (this.shouldConvertScript(src)) {
        return `<script${before} data-src="${src}"${after}>`;
      }
      return match;
    });

    transformedHtml = transformedHtml.replace(linkRegex, (match, before, href, after) => {
      if (this.shouldConvertLink(href)) {
        return `<link${before} data-href="${href}"${after}>`;
      }
      return match;
    });

    return transformedHtml;
  }

  private shouldConvertScript(src: string): boolean {
    if (src.startsWith('data:') || src.startsWith('blob:')) return false;
    if (src.includes('webpack') || src.includes('chunk')) return true;
    if (src.endsWith('.js')) return true;
    return false;
  }

  private shouldConvertLink(href: string): boolean {
    if (href.startsWith('data:') || href.startsWith('blob:')) return false;
    if (href.includes('webpack') || href.includes('chunk')) return true;
    if (href.endsWith('.css')) return true;
    return false;
  }

  private injectLazyLoaderScript(html: string, lazyLoaderScript: string): string {
    const bodyCloseRegex = /<\/body>/i;
    
    if (bodyCloseRegex.test(html)) {
      return html.replace(bodyCloseRegex, `${lazyLoaderScript}\n</body>`);
    }

    const htmlCloseRegex = /<\/html>/i;
    if (htmlCloseRegex.test(html)) {
      return html.replace(htmlCloseRegex, `${lazyLoaderScript}\n</html>`);
    }

    return html + lazyLoaderScript;
  }
}

export default TriggyPlugin;
