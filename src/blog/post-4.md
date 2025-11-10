---
author: Stefano Francesco Pitton
title: "Constant product model"
slug: "constant-product-model"
tags: []
related: []
created: 2025-03-29
modified: 2025-11-01
to-publish: false
---

# Constant product model

$$
\prod_{i=1}^Nx_i = \Bigg(\frac{D}{N}\Bigg)^N\\
$$

## Example

Let's consider an example with only two tokens in the pool and a total liquidity
of $100$. When the pool is in equilibrium, the invariant holds and the price of
the two tokens is the same.

$$
 \prod_{i=1}^2x_i = x_1 \cdot x_2 = x \cdot x = x ^ 2
$$

$$
 \Bigg(\frac{D}{2}\Bigg)^2 = \Bigg(\frac{100}{2}\Bigg)^2
$$

By comparing the two equations we have:

$$
 x ^ 2 = \Bigg(\frac{100}{2}\Bigg)^2 \Longrightarrow x  = \Bigg(\frac{100}{2}\Bigg) \Longrightarrow x  = 50
$$
