[简体中文](readme.zh-CN.md) | [English](readme.md)
# ezal-markdown
![test](https://github.com/JonnyJong/ezal-markdown/actions/workflows/test.yml/badge.svg)

A simple, asynchronous markdown renderer.

## Installation
```sh
npm install ezal-markdown
# or
yarn add ezal-markdown
# or
pnpm add ezal-markdown
```

## Usage
```ts
import { EzalMarkdown } from 'ezal-markdown';

// Directly render Markdown text
EzalMarkdown.render(markdownText).then((result) => {
	const output = result.html; // Get the rendered HTML
});
// Create a renderer instance
const renderer = new EzalMarkdown();
renderer.render(markdownText).then((result) => {
	const output = result.html; // Get the rendered HTML
});
```

### Parsing FrontMatter

> [!NOTE]
> This feature requires optional dependency [yaml](https://www.npmjs.com/package/yaml) package.

```ts
import { EzalMarkdown, extractFrontmatter } from 'ezal-markdown';

// Parse Frontmatter separately
extractFrontmatter(markdownText).then((result) => {
	result.data; // Get parsed data
});

// Parse Frontmatter while rendering
EzalMarkdown.render(markdownText, { enableFrontmatter: true }).then((result) => {
	result.frontmatter.data; // Get parsed data
});
const renderer = new EzalMarkdown();
renderer.render(markdownText, { enableFrontmatter: true }).then((result) => {
	result.frontmatter.data; // Get parsed data
});
```

### Register Plugins
```ts
import { EzalMarkdown } from 'ezal-markdown';

// Register plugins globally (affects all instances)
EzalMarkdown.set(pluginA, pluginB);
// Register plugins for a specific instance (only affects that instance)
const renderer = new EzalMarkdown();
renderer.set(pluginA, pluginB);
```

## Build/Development
```sh
pnpm i
pnpm compile
pnpm test
```

## Documentation

### Plugins
All syntax in EzalMarkdown is implemented through plugins.

Plugins are divided into two levels and three types:
- Levels:
  - block: Block-level, parsed first (e.g., paragraphs, lists, etc.)
  - inline: Inline-level (e.g., bold, links, etc.)
- Types:
  - `RendererPlugin`: Renderer plugin, used only for rendering, used in EzalMarkdown to render plain text
  - `CommonPlugin`: Common plugin, processes and renders by text matching
  - `ASTPlugin`: AST plugin, parses, replaces with custom nodes, and renders on the AST

### Built-in Plugins

| Name                            | Type     | Level  | Order | Priority | Description                            |
| ------------------------------- | -------- | ------ | ----- | -------- | -------------------------------------- |
| text                            | Renderer | inline | N/A   | N/A      | Renders text nodes                     |
| emphasis-and-links              | AST      | inline | post  | 0        | Emphasis, strikethrough, links, images |
| autolink                        | Common   | inline | 0     | 0        | Autolink `<https://jonnys.top>`        |
| code                            | Common   | inline | 0     | 0        | Inline code `` `code` ``               |
| entity-reference                | Common   | inline | 0     | 0        | Entity reference                       |
| decimal-character-reference     | Common   | inline | 0     | 0        | Decimal character reference            |
| hexadecimal-character-reference | Common   | inline | 0     | 0        | Hexadecimal character reference        |
| escape                          | Common   | inline | 0     | 0        | Character escape                       |
| html                            | Common   | inline | 0     |          | Raw HTML                               |
| linebreak                       | Common   | inline | 0     | 0        | Hard line break                        |
| softbreak                       | Common   | inline | 0     | 0        | Soft line break                        |
| atx-heading                     | Common   | block  | 0     | 0        | ATX heading `# Heading`                |
| setext-heading                  | Common   | block  | 0     | 0        | Setext heading                         |
| blockquote                      | Common   | block  | -1    | 0        | Blockquote `> Quote`                   |
| indented-codeblock              | Common   | block  | -2    | 0        | Indented code block                    |
| fenced-codeblock                | Common   | block  | 0     | 0        | Fenced code block                      |
| html                            | Common   | block  | 0     | 0        | HTML block                             |
| table                           | Common   | block  | -1    | 0        | Table                                  |
| thematic-break                  | Common   | block  | 0     | 0        | Thematic break                         |
| list                            | Common   | block  | 0     | 0        | List                                   |
| list-post                       | AST      | block  | post  | 1        | List post-processing                   |
| link-reference-define           | AST      | block  | post  | 1        | Link reference definition              |
| paragraph                       | AST      | block  | post  | 0        | Paragraph                              |

### Rendering Flow
```mermaid
flowchart LR
    A[Start] --> B[Create rendering context]
    B --> C[Unify line breaks to LF]
    C --> D[Extract FrontMatter]
    D --> E[Generate AST]
    E --> F[Convert AST to HTML]
    F --> G[End]

    subgraph E[Generate AST]
        E1[Parse in order from maxLevel to atomic]
        E1 --> E2[Call plugin start for matching]
        E2 --> E3[Call plugin parse for parsing]
        E3 --> E4[Convert to Node]
        E4 --> E5[Process unmatched regions]
        E5 --> E6[Normalize AST]
    end

    subgraph F[Convert AST to HTML]
        F1[Start from innermost nodes]
        F1 --> F2[Render left to right]
        F2 --> F3[Call plugin render]
    end
```

Detailed rendering steps:
1. Preprocessing
   - Create a rendering context (including utilities like Anchors, Toc, Counter).
   - Initialize plugin-specific contexts (if `context` is defined).
   - Unify line breaks to LF format.
2. AST Generation
   - Parse from the highest level (`maxLevel`) to atomic level (`atomic`):
     1. Call `start` for all potential match positions.
     2. Traverse valid positions and call `parse` to parse content.
     3. Convert parsed results to AST nodes.
   - Process unmatched text regions (convert to `TextNode`).
   - Normalize AST:
     - Remove redundant line break nodes at boundaries.
     - Segment processing (if enabled).
     - Merge, replace, or remove redundant line break nodes.
3. HTML Generation
   - Traverse AST depth-first.
   - Start rendering from the innermost nodes, left to right.
   - Call `render` to generate HTML fragments.
   - Combine all fragments for the final HTML output.

### Hooks
Hooks can be set before and after each stage. The stages where hooks can be set are as follows:
- Preprocessing: `prePreprocessing`, `postPreprocessing`
- Reading frontmatter: `preFrontmatter`, `postFrontmatter`
- Tokenization: `preTokenize`, `postTokenize`
  - Normalization: `preNormalize`, `postNormalize`
- Transformation: `preTransform`, `postTransform`
