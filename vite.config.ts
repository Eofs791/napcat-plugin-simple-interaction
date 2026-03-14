import { resolve, dirname } from 'path';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { builtinModules } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const nodeModules = [
    ...builtinModules,
    ...builtinModules.map((m) => `node:${m}`),
].flat();
const external: string[] = [];

// 自动生成的精简 package.json 插件
function generatePkgPlugin() {
    return {
        name: 'generate-pkg',
        // 在打包完成后执行
        writeBundle() {
            const pkgPath = resolve(__dirname, 'package.json');
            const distDir = resolve(__dirname, 'dist');
            
            if (fs.existsSync(pkgPath)) {
                const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
                // 仅保留运行时必要的字段
                const distPkg = {
                    name: pkg.name,
                    version: pkg.version,
                    type: pkg.type,
                    main: 'index.mjs', // 确保指向构建产物
                    description: pkg.description,
                    author: pkg.author,
                    napcat: pkg.napcat, // 保留 NapCat 配置信息
                };

                if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);
                
                fs.writeFileSync(
                    resolve(distDir, 'package.json'),
                    JSON.stringify(distPkg, null, 2)
                );
                console.log('[Build] package.json is generated');
            }
        },
    };
}

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            formats: ['es'],
            fileName: () => 'index.mjs',
        },
        rollupOptions: {
            external: [...nodeModules, ...external],
            output: {
                inlineDynamicImports: true,
            },
        },
        outDir: 'dist',
        emptyOutDir: true, // 每次构建前清空 dist
        minify: false,
    },
    plugins: [generatePkgPlugin()],
});