---
title: "Style Guide"
summary: "A comprehensive showcase of all styling elements available in this blog."
author: "Stefano Francesco Pitton"
modified: 2025-01-18
tags: [style, guide, reference]
to-publish: true
---

This document showcases all the styling elements available in this blog. Use it as a reference when writing new content.

## Typography

### Headings

Headings from H2 to H5 are available. H1 is reserved for the post title.

### H3 Heading

#### H4 Heading

##### H5 Heading

### Text Styles

Regular paragraph text looks like this. The font is M PLUS 1p, a clean Japanese-inspired sans-serif that provides excellent readability.

You can use **bold text** for emphasis, or _italic text_ for subtle emphasis. You can also combine **_bold and italic_** when needed.

Here is some `inline code` within a paragraph. It uses IBM Plex Mono for a clean, technical appearance.

## Lists

### Unordered Lists

- First item in the list
- Second item with more content to show how longer text wraps
- Third item
  - Nested item one
  - Nested item two
- Fourth item

### Ordered Lists

1. First numbered item
2. Second numbered item
3. Third numbered item
   1. Nested numbered item
   2. Another nested item
4. Fourth numbered item

## Code Blocks

### Inline Code

Use `const` for constants and `let` for variables in JavaScript.

### Code Blocks with Syntax Highlighting

Here's a JavaScript example:

```javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Calculate the 10th Fibonacci number
const result = fibonacci(10);
console.log(`Fibonacci(10) = ${result}`);
```

A Rust example:

```rust
fn main() {
    let numbers: Vec<i32> = (1..=10).collect();

    let sum: i32 = numbers.iter()
        .filter(|&x| x % 2 == 0)
        .sum();

    println!("Sum of even numbers: {}", sum);
}
```

A Python example:

```python
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)
```

### Code Block with Title

Use the `title` metadata to label a code block with a filename:

```rust title="src/main.rs"
fn main() {
    println!("Hello from a titled code block!");
}
```

### Code Block with Caption

Use the `caption` metadata to add a description below a code block:

```python title="src/main.rs" caption="The classic recursive approach to computing Fibonacci numbers."
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)
```

### Highlighted Lines

Use `{n}` or `{n-m}` to highlight specific lines:

```javascript {3-4}
function greet(name) {
  const greeting = `Hello, ${name}!`;
  console.log(greeting);
  return greeting;
}
```

## Mathematics

### Inline Math

The quadratic formula is $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$ and Euler's identity is $e^{i\pi} + 1 = 0$.

### Display Math

The Gaussian integral:

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

The definition of a derivative:

$$
f'(x) = \lim_{h \to 0} \frac{f(x + h) - f(x)}{h}
$$

A matrix equation:

$$
\begin{pmatrix} a & b \\ c & d \end{pmatrix} \begin{pmatrix} x \\ y \end{pmatrix} = \begin{pmatrix} ax + by \\ cx + dy \end{pmatrix}
$$

## Blockquotes

> This is a blockquote. It can be used for citations or to highlight important information.
>
> It can span multiple paragraphs if needed.

## Links

Here is a [link to an external site](https://example.com) and here is a [link to another post](/writings/fields).

## Images

Images should be placed in the `src/images` directory and imported in MDX files.

## Horizontal Rules

Use three dashes to create a horizontal rule:

---

## Tables

| Feature           | Supported | Notes                   |
| ----------------- | --------- | ----------------------- |
| Markdown          | Yes       | Full CommonMark support |
| LaTeX             | Yes       | Via KaTeX               |
| Code Highlighting | Yes       | Via rehype-pretty-code  |
| MDX               | Yes       | For interactive content |

### Table with Caption

Wrap a table in a `<figure>` with a `<figcaption>` to add a caption:

<figure class="table-figure">

| Opcode | Name | Gas | Description              |
| ------ | ---- | --- | ------------------------ |
| 0x00   | STOP | 0   | Halts execution          |
| 0x01   | ADD  | 3   | Addition operation       |
| 0x02   | MUL  | 5   | Multiplication operation |
| 0x03   | SUB  | 3   | Subtraction operation    |

<figcaption>Table 1: EVM arithmetic opcodes and their gas costs.</figcaption>
</figure>

## Definition Boxes

<div class="callout">
  <div class="callout-header">
    <strong class="callout-type">[Def]</strong>
    <strong class="callout-title">Group</strong>
  </div>
  <p>A <strong>group</strong> is a set G equipped with a binary operation * such that:</p>
  <ol>
    <li>Closure: For all a, b in G, a * b is in G</li>
    <li>Associativity: For all a, b, c in G, (a * b) * c = a * (b * c)</li>
    <li>Identity: There exists e in G such that e * a = a * e = a</li>
    <li>Inverse: For each a in G, there exists b such that a * b = b * a = e</li>
  </ol>
</div>

## Combining Elements

Mathematics and code often go together. For example, implementing the sigmoid function $\sigma(x) = \frac{1}{1 + e^{-x}}$:

```python
import math

def sigmoid(x):
    return 1 / (1 + math.exp(-x))
```

## Summary

This style guide covers:

- **Typography**: Headings, text styles, and emphasis
- **Lists**: Ordered and unordered, with nesting
- **Code**: Inline and blocks with syntax highlighting
- **Mathematics**: Inline and display equations
- **Other elements**: Blockquotes, links, tables, and definitions

Use these elements to create clear, well-structured technical content.
