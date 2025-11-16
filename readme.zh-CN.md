[简体中文](readme.zh-CN.md) | [English](readme.md)
# ezal-markdown
![test](https://github.com/JonnyJong/ezal-markdown/actions/workflows/test.yml/badge.svg)

一个简单、异步的 markdown 渲染器。

## 安装
```sh
npm install ezal-markdown
# or
yarn add ezal-markdown
# or
pnpm add ezal-markdown
```

## 使用
```ts
import { EzalMarkdown } from 'ezal-markdown';

// 直接渲染 Markdown 文本
EzalMarkdown.render(markdownText).then((result) => {
	const output = result.html; // 获取渲染后的 HTML
});
// 创建渲染器实例
const renderer = new EzalMarkdown();
renderer.render(markdownText).then((result) => {
	const output = result.html; // 获取渲染后的 HTML
});
```

### 解析 FrontMatter

> [!NOTE]
> 此功能需要额外安装 [yaml](https://www.npmjs.com/package/yaml) 包（可选依赖）。

```ts
import { EzalMarkdown, extractFrontmatter } from 'ezal-markdown';

// 单独解析 Frontmatter
extractFrontmatter(markdownText).then((result) => {
	result.data; // 获取解析后的数据
});

// 渲染时同时解析 Frontmatter
EzalMarkdown.render(markdownText, { enableFrontmatter: true }).then((result) => {
	result.frontmatter.data; // 获取解析后的数据
});
const renderer = new EzalMarkdown();
renderer.render(markdownText, { enableFrontmatter: true }).then((result) => {
	result.frontmatter.data; // 获取解析后的数据
});
```

### 注册插件
```ts
import { EzalMarkdown } from 'ezal-markdown';

// 全局注册插件（所有实例都会生效）
EzalMarkdown.set(pluginA, pluginB);
// 为特定实例注册插件（仅对该实例生效）
const renderer = new EzalMarkdown();
renderer.set(pluginA, pluginB);
```

## 构建/开发
```sh
pnpm i
pnpm compile
pnpm test
```

## 文档

### 插件
EzalMarkdown 中各语法通过插件实现。

插件分为两种级别三种类型：
- 级别：
  - block：块级，最先解析（如段落、列表等）
  - inline：行级（如加粗、链接等）
- 类型：
  - `RendererPlugin`：渲染插件，仅用于渲染，在 EzalMarkdown 用于渲染普通文本
  - `CommonPlugin`：一般插件，通过文本匹配并处理渲染
  - `ASTPlugin`：AST 插件，在 AST 上解析、替换为自定义节点并渲染

### 内置插件

| 名称                            | 类型 | 级别 | 顺序 | 优先级 | 说明                            |
| ------------------------------- | ---- | ---- | ---- | ------ | ------------------------------- |
| text                            | 渲染 | 行级 | N/A  | N/A    | 渲染文本节点                    |
| emphasis-and-links              | AST  | 行级 | post | 0      | 强调、删除线、链接、图像        |
| autolink                        | 普通 | 行级 | 0    | 0      | 自动链接 `<https://jonnys.top>` |
| code                            | 普通 | 行级 | 0    | 0      | 行内代码 `` `code` ``           |
| entity-reference                | 普通 | 行级 | 0    | 0      | 实体引用                        |
| decimal-character-reference     | 普通 | 行级 | 0    | 0      | 十进制字符引用                  |
| hexadecimal-character-reference | 普通 | 行级 | 0    | 0      | 十六进制字符引用                |
| escape                          | 普通 | 行级 | 0    | 0      | 字符转义                        |
| html                            | 普通 | 行级 | 0    |        | 原始 HTML                       |
| linebreak                       | 普通 | 行级 | 0    | 0      | 硬换行                          |
| softbreak                       | 普通 | 行级 | 0    | 0      | 软换行                          |
| atx-heading                     | 普通 | 块级 | 0    | 0      | ATX 标题 `# Heading`            |
| setext-heading                  | 普通 | 块级 | 0    | 0      | Setext 标题                     |
| blockquote                      | 普通 | 块级 | -1   | 0      | 引用块 `> Quote`                |
| indented-codeblock              | 普通 | 块级 | -2   | 0      | 缩进代码块                      |
| fenced-codeblock                | 普通 | 块级 | 0    | 0      | 围栏代码块                      |
| html                            | 普通 | 块级 | 0    | 0      | HTML 块                         |
| table                           | 普通 | 块级 | -1   | 0      | 表格                            |
| thematic-break                  | 普通 | 块级 | 0    | 0      | 主题分隔符                      |
| list                            | 普通 | 块级 | 0    | 0      | 列表                            |
| list-post                       | AST  | 块级 | post | 1      | 列表后处理                      |
| link-reference-define           | AST  | 块级 | post | 1      | 链接引用定义                    |
| paragraph                       | AST  | 块级 | post | 0      | 段落                            |

### 渲染流程
```mermaid
flowchart LR
    A[开始] --> B[创建渲染上下文]
    B --> C[统一换行符为 LF]
    C --> D[提取 FrontMatter]
    D --> E[生成 AST]
    E --> F[转换 AST 为 HTML]
    F --> G[结束]

    subgraph E[生成 AST]
        E1[按 maxLevel 到 atomic 顺序解析]
        E1 --> E2[调用插件 start 匹配]
        E2 --> E3[调用插件 parse 解析]
        E3 --> E4[转换为 Node]
        E4 --> E5[处理未匹配区域]
        E5 --> E6[规格化 AST]
    end

    subgraph F[转换 AST 为 HTML]
        F1[从最内层节点开始]
        F1 --> F2[从左到右渲染]
        F2 --> F3[调用插件 render]
    end
```

详细渲染步骤：
1. 预处理
   - 创建渲染上下文（包括 Anchors、Toc、Counter 等工具类）
   - 初始化各插件的上下文（如果定义了 `context` 函数）
   - 统一换行符为 LF 格式
2. AST 生成
   - 从最高级别（`maxLevel`）到原子级别（`atomic`）逐级解析：
     1. 调用插件的 `start` 方法查找所有可能匹配的起点
     2. 遍历有效起点，调用插件的 `parse` 方法解析内容
     3. 将解析结果转换为 AST 节点
   - 处理未匹配的文本区域（转换为 `TextNode`）
   - AST 规格化：
     - 移除前后多余的换行节点
     - 分段处理（如果启用）
     - 合并、替换或移除多余的换行节点
3. HTML 生成
   - 深度优先遍历 AST
   - 从最内层节点开始，从左到右依次渲染
   - 调用各插件的 `render` 方法生成 HTML 片段
   - 组合所有片段得到最终 HTML 输出

### 钩子
在各阶段前后都可以设置钩子，可设置钩子的阶段如下：
- 预处理：`prePreprocessing`、`postPreprocessing`
- 读取 frontmatter：`preFrontmatter`、`postFrontmatter`
- 分词：`preTokenize`、`postTokenize`
  - 规范化：`preNormalize`、`postNormalize`
- 转换：`preTransform`、`postTransform`
