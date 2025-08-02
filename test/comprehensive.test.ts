import { describe, expect, it } from 'vitest';
import { EzalMarkdown } from '../src';

describe('Comprehensive Markdown Test', () => {
	it('should handle all syntax elements and their combinations', async () => {
		const markdownContent = `
# 综合Markdown测试 {#main-heading}

这是一个测试文档，包含**所有**支持的Markdown语法*元素*及其~~组合~~。

## 段落和格式组合

这是一个段落，包含**粗体**、*斜体*、~~删除线~~和\`行内代码\`。还可以组合使用：***粗斜体***、**_粗斜体_**。

> 这是一个块引用，里面可以包含[链接](https://example.com)和\`代码\`。
>
> > 嵌套的块引用

## 列表测试

### 无序列表
- 第一项
  - 嵌套项
    - 更深嵌套
- **带格式**的项

- [ ] 任务1
- [x] 已完成任务

### 有序列表
1. 第一项
   1. 嵌套项
2. 第二项
3. 第三项

## 代码测试

行内代码：\`console.log("Hello")\`

代码块：

\`\`\`javascript
function hello() {
  // 这是一个代码块
  console.log("Hello, world!");
}
\`\`\`

## 表格测试

| 语法 | 描述 | 示例 |
|:-----|:----:|-----:|
| 标题 | 居中 | 右对齐 |
| \`code\` | **加粗** | *斜体* |
| [链接](#main-heading) | ![图片](icon.png) | ~~删除线~~ |

## 链接和图片

这是一个[内部链接](#main-heading)和一个[外部链接](https://example.com "标题")。

图片测试：
![替代文本](image.jpg "标题文本")

## 水平线

---

## 脚注

这是一个带有脚注的句子[^note].

[^note]: 这是脚注的内容。

## Tex

This is inline $\\LaTeX$.

$$\\text{This is block }\\LaTeX\\text{.}$$
`;

		const expectedHtml = [
			'<h1 id="main-heading">综合Markdown测试</h1>',
			'<p>这是一个测试文档，包含<b>所有</b>支持的Markdown语法<i>元素</i>及其<del>组合</del>。</p>',
			'<h2 id="段落和格式组合">段落和格式组合</h2>',
			'<p>这是一个段落，包含<b>粗体</b>、<i>斜体</i>、<del>删除线</del>和<code>行内代码</code>。还可以组合使用：<b><i>粗斜体</i></b>、<b><i>粗斜体</i></b>。</p>',
			'<blockquote>这是一个块引用，里面可以包含<a href="https://example.com" target="_blank">链接</a>和<code>代码</code>。<br><blockquote>嵌套的块引用</blockquote></blockquote>',
			'<h2 id="列表测试">列表测试</h2>',
			'<h3 id="无序列表">无序列表</h3>',
			'<ul><li>第一项<ul><li>嵌套项<ul><li>更深嵌套</li></ul></li></ul></li><li><b>带格式</b>的项</li></ul>',
			'<ul><li><input type="checkbox">任务1</li><li><input type="checkbox" checked>已完成任务</li></ul>',
			'<h3 id="有序列表">有序列表</h3>',
			'<ol><li>第一项<ol><li>嵌套项</li></ol></li><li>第二项</li><li>第三项</li></ol>',
			'<h2 id="代码测试">代码测试</h2>',
			'<p>行内代码：<code>console.log(&quot;Hello&quot;)</code></p>',
			'<p>代码块：</p>',
			'<pre><code>function hello() {\n  // 这是一个代码块\n  console.log(&quot;Hello, world!&quot;);\n}</code></pre>',
			'<h2 id="表格测试">表格测试</h2>',
			'<table><thead><tr><th style="text-align:left;">语法</th><th style="text-align:center;">描述</th><th style="text-align:right;">示例</th></tr></thead><tbody><tr><td style="text-align:left;">标题</td><td style="text-align:center;">居中</td><td style="text-align:right;">右对齐</td></tr><tr><td style="text-align:left;"><code>code</code></td><td style="text-align:center;"><b>加粗</b></td><td style="text-align:right;"><i>斜体</i></td></tr><tr><td style="text-align:left;"><a href="#main-heading">链接</a></td><td style="text-align:center;"><img src="icon.png" alt="图片"></td><td style="text-align:right;"><del>删除线</del></td></tr></tbody></table>',
			'<h2 id="链接和图片">链接和图片</h2>',
			'<p>这是一个<a href="#main-heading">内部链接</a>和一个<a href="https://example.com" title="标题" target="_blank">外部链接</a>。</p>',
			'<p>图片测试：</p>',
			'<img src="image.jpg" alt="替代文本" title="标题文本">',
			'<h2 id="水平线">水平线</h2>',
			'<hr>',
			'<h2 id="脚注">脚注</h2>',
			'<p>这是一个带有脚注的句子<a href="#note">note</a>.</p>',
			'<dl><dt id="note">note</dt><dd>这是脚注的内容。</dd></dl>',
			'<h2 id="tex">Tex</h2>',
			'<p>This is inline <span>$\\LaTeX$</span>.</p>',
			'<p>$$\\text{This is block }\\LaTeX\\text{.}$$</p>',
		].join('');

		const result = await EzalMarkdown.render(markdownContent);
		expect(result.html).toEqual(expectedHtml);
	});
});
