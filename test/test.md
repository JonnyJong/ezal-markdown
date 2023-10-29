# Headings
## H2
### H3
#### H4
##### H5
###### H6

Other Heading 1
===============

Other Heading 2
---------------

## Custom Heading ID
### Heading With Custom ID {#custom}

# Paragraph & Line Break
This is a markdown paragraph.
这是同一个段落中的第二行。

This is aunther paragraph.

# Text Style
## Bold
这个**字**加粗了。
This **word** has been bolded.

## Italic
这个*字*是斜的。
This *word* is slanted.

## Underscore
这个__字__有个下划线。
This __word__ has a underscore.

## Delete
这个~~字~~被删掉了。
This ~~word~~ has been delete.

## Mix Together
***BI***
**__BU__**
~~**BD**~~

__***BIU***__
***~~BID~~***
**__~~BUD~~__**
__*~~IUD~~*__

**__*~~BIUD~~*__**

# Blockquote
> 单行引用

> Multiline reference
> 多行引用

> Multiline reference with empty line
> 
> 带有空行的多行引用

> Nested reference
> 嵌套引用
> > 被嵌套的引用
> > 
> > Ref
> 外层引用

# List
## Ordered List
1. 有序列表必须以 1 开始
2. 后面用什么数字都行
   还可以这样

1. 可以嵌套使用有序列表
   1. 比如这样
   1. 然后使用别的数字
      当然，渲染后是正确的数字

## Unordered List
- 无序列表与有序列表类似
* 除了使用减号，还可以使用加号、乘号

+ 并且同样支持嵌套
  + 比如这样

## Task
- [ ] ABC

# Codeblock
    <html>
      <head>
      </head>
    </html>


## Fence Codeblock
```c
#include <stdio.h>

void main()
{
  printf("Hello World!");
}
```

# Horizontal Rule

***

----

___

可以使用星号、减号、下划线，且需要三个及以上，前后最好空一行。

# Link
这是一个[链接](https://jonnys.top)。

这是一个带有标题的[链接](https://jonnys.top "Jonny's Blog")。

<https://jonnys.top>
<email@jonnys.top>

[Jonny's Blog][1]

[1]: https://jonnys.top
[2]: https://jonnys.top "Jonny's Blog"

# Image
![image](https://jonnys.top/favicon.png "Jonny's Blog")

# Escape
&

# HTML
<input>

# Table
| Normal | Table |
| ------ | ----- |
| 1, 1   | 1, 2  |
| 2, 1   | 2, 2  |

| Syntax      | Description | Test Text     |
| :---------- | :---------: | ------------: |
| Header  \|  | Title       | Here's this   |
| Paragraph   | Text        | And more      |

# Footnote
This is a footnote[^1].

[^1]: This is the foot's content.

# Define List
Mainly
: Balabala
Two Lines
: First line
: Second Line

# Emoji
[For More Details](https://gist.github.com/rxaviers/7360908)
:smiley:
