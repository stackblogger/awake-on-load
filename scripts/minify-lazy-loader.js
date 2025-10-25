const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

async function minifyLazyLoader() {
  try {
    const inputPath = path.join(__dirname, '../src/lazy-loader.js');
    const outputPath = path.join(__dirname, '../dist/lazy-loader.js');
    
    const inputCode = fs.readFileSync(inputPath, 'utf8');
    
    const result = await minify(inputCode, {
      compress: {
        drop_console: false,
        drop_debugger: true,
        pure_funcs: ['console.log']
      },
      mangle: {
        keep_fnames: true
      },
      format: {
        comments: false
      }
    });
    
    if (result.error) {
      throw result.error;
    }
    
    fs.writeFileSync(outputPath, result.code);
    
    const originalSize = inputCode.length;
    const minifiedSize = result.code.length;
    const savings = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
    
    console.log(`Lazy loader minified successfully!`);
    console.log(`   Original: ${originalSize} bytes`);
    console.log(`   Minified: ${minifiedSize} bytes`);
    console.log(`   Savings: ${savings}% (${originalSize - minifiedSize} bytes saved)`);
    
  } catch (error) {
    console.error('Error minifying lazy loader:', error);
    process.exit(1);
  }
}

minifyLazyLoader();
