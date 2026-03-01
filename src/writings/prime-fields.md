---
author: stepit
title: "Fields"
slug: "fields"
created: 2026-01-03
modified: 2026-01-03
summary: ""
category: ""
tags: [math, cryptography]
related: []
to-publish: true
---

## Introduction

Fields are an important concept for understanding crypto systems which generalizes the concept
of arithmetic on rational numbers we are used to work with.

<div class="callout">
  <div class="callout-header">
    <strong class="callout-type">[Def]</strong>
    <strong class="callout-title">Field</strong>
  </div>

A field is a set $\mathbb{F}$ paired with two binary operations:

- Addition +: $\mathbb{F} \times \mathbb{F} \rightarrow \mathbb{F}$

- Multiplication $\cdot$: $\mathbb{F} \times \mathbb{F} \rightarrow \mathbb{F}$

Such that:

- The additive group $(\mathbb{F, +})$ is a commutative group with neutral
  element 0.

- The multiplicative group $(\mathbb{F, \cdot})$ is a commutative group with
  neutral element 1.

- And the distributive property holds: $\forall g_1, g_2, g_3 \in \mathbb{F}$
  the relation $g_1 \cdot(g_2 + g_3) = g_1 \cdot g_2 + g_1 \cdot g_2$.

The field is represented by the tuple $(\mathbb{F}, +, \cdot)$.

</div>

It is very important here to recall that the concept of commutative group implies the
**existence of an inverse**. Remember also that the concept of set does not refer to only numbers,
but it can refer to any generic homogeneous elements.

To simplify the notation, we will refer to the field $(\mathbb{F}, +, \cdot)$
only with the letter $\mathbb{F}$, assuming the two field laws and axioms implicitly.

$\mathbb{F'}$ is a subfield of a field $\mathbb{F}$ if $\mathbb{F'} \subset \mathbb{F}$ and
the field axioms holds also for $(\mathbb{F'}, +, \cdot)$. In this case, $\mathbb{F}$ is called an **extension field** of $\mathbb{F'}$.

An important concept when using fields in for cryptosystems, is the one of **characteristic**.

<div class="callout">
  <div class="callout-header">
    <strong class="callout-type">[Def]</strong>
    <strong class="callout-title">Characteristic</strong>
  </div>

The characteristic of a field $\mathbb{F}$ is defined as the smallest
$n$ such that $\sum_{i=1}^n = 0$.

If $n$ exists, then the field $\mathbb{F}$ has a **finite characteristic**. If such number does
not exist, then $\mathbb{F}$ has **zero characteristic**.

</div>

It can be seen as the DNA of the field itself.

## Prime fields

Of particular importance for the understanding modern cryptosystems, is the concept of prime field.
Prime fields are defined on the set $\mathbb{Z}_n$ of reminder class when the modulo is a prime number.
We refer to the prime field of prime modulo $p$ as $(\mathbb{F}_p, +, \cdot)$. In this case,
$\forall x \in \mathbb{F}_p$ we have:

- The additive inverse is: $-x=p-x \mod p$

- The multiplicative inverse when $x\neq 0$ is: $x^{-1} = x^{p-2}$ (by Fermat's theorem)

### Square roots

When working with prime fields, an important concept already familiar for most of the people is the
one of square numbers.

<div class="callout">
  <div class="callout-header">
    <strong class="callout-type">[Def]</strong>
    <strong class="callout-title">Quadratic residue</strong>
  </div>

Let $p$ be a prime number and $\mathbb{F}_p$ a prime field. $x \in \mathbb{F}_P$ is called square
root of $y \in \mathbb{F}_p$ iff:

$$
x^2 = y
$$

When it is given $x$ and a solution for such equation exists, then $y$ is called **quadratic residue**.
On the other hand, when it is given $y$ and a solution does not exist, then $y$ is called **quadratic non-residue**

</div>

If $y$ is a quadratic residue in $\mathbb{F}_P$, then it has always two roots:

$$
\sqrt{y} = \{x, p-x\}
$$

Given a prime field of characteristic $p$ higher than $2$, we always have $(p+1)/2$ quadratic residue
and $(p-1)/2$ quadratic non-residue.

When working with prime fields and quadratic residue, it is often useful to use the **Legendre symbol** defined as:

$$
\left(\frac{y}{p}\right) := \begin{cases} 1 & \text{if } y \text{ has square roots} \\ -1 & \text{if } y \text{ has no square roots} \\ 0 & \text{if } y = 0 \end{cases}
$$

The Legendre symbol can be easily computed with the **Euler's criterion**:

$$
\left(\frac{y}{p}\right) = y^{\frac{p-1}{2}}
$$

## Examples

A classic example of a field is the set of rational numbers $\mathbb{Q}$ together with the
standard concept of addition and multiplication. Since this field is not finite, its characteristic
is equal to zero.

## Open questions

1. The size of a finite field can only be a power of a prime number.
2. Isomorphisms associated with characteristics and finite fields.

## References

1. https://www.youtube.com/watch?v=jvAwIvtB-mI&list=PLu6jbin1VpDDNAuq_Wa6WGElXYnJQTmOh&index=9
