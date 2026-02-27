---
author: stepit
title: "Random math for cryptography"
slug: "random-math-for-cryptography"
created: 2026-02-27
modified: 2026-02-27
summary: "A collection of useful mathematical topic for cryptography"
category: "mathematics"
tags: [cryptography]
related: []
to-publish: true
---

## Greatest common divisor

Given two integers $a$ and $b$, with $b \neq 0$, we say that $b$ divides $a$ if
$\exists$ and integer $c$ such that the following equality is satisfied:

$$
a = bc
$$

If that $c$ exists, then we write $b \mid a$, otherwise $b \nmid a$.

Despite we are used to consider the concept of division fairly simple, it plays
a fundamental role in modern cryptography and it deserve additional attention.

<div class="definition">
  <div class="definition-header">
    <strong class="definition-type">[Proposition]</strong>
  </div>

Let $a, b, c \in \mathbb{Z}$ be three integers:

1. If $a \mid b$ and $b \mid c$ $\Rightarrow a \mid c$
2. If $a \mid b$ and $b \mid a$ $\Rightarrow a \pm b$
3. If $a \mid b$ and $a \mid a$ $\Rightarrow a \mid (b + c)$ and
   $a \mid (b - c)$

</div>

Amongst all the divisors that are in common between two numbers, we are
particularly interested in the **greatest common division**.

<div class="definition">
  <div class="definition-header">
    <strong class="definition-type">[Definition]</strong>
    <strong class="definition-title">Greatest common division</strong>
  </div>

Let $a, b \in \mathbb{Z}$ be two integers, we define the greatest common divisor
as the largest integer $d$ such that:

$$
d \mid a,\quad d \mid b
$$

The greatest common divisor between two numbers is commonly written as.
$\gcd(a,b)$

</div>

When the $\gcd(a,b) = 1$, then we say that the two numbers are **relatively
prime**.

Is it possible to compute efficiently the $\gcd(a,b)$ using the method of **long
division**, also called the **Euclidean algorithm**. To understand how the
algorithm works, it is useful to consider the generic division form between two
numbers:

$$
a = bq + r \quad \text{with} \quad 0 \le r < b
$$

In this case, $q$ is called the **quotient**, and $r$ is the **reminder**. With
this equation, we can present an equality used in the next theorem:

$$
\gcd(a,b) = \gcd(b,r)
$$

This equality states that the greatest common divisor between two numbers, is
equal to the greatest common divisor between the lowest of the two, and the
reminder of their division.

<div class="definition">

  <div class="definition-header">
    <strong class="definition-type">[Theorem]</strong>
    <strong class="definition-title">The Euler Algorithm</strong>
  </div>

Let $a$ and $b$ two positive numbers in $\mathbb{Z}$ such that $a \ge b$. We can
compute the $\gcd(a,b)$ in a finite number of steps with the following
algorithm:

1. Let $r_0 = a$, $r_1=b$, and set $i=1$.
2. Divide $r_{i-1}$ by $r_i$ to get the quotient $q$ and the reminder $r_{i+1}$;

$$
r_{i-1} = r_i \cdot q + r_{i+1}
$$

3. We have to situations here:
   1. If the reminder is equal to zero, we terminate with:

      $$
      \gcd(a,b) = r_i
      $$

   2. Otherwise, we set $i = i +1$ and go back to point 2.

</div>

From the application of the Euclidean algorithm, we can obtain another important
theorem for cryptography, which allows us to write the $\gcd(a,b)$ as a linear
combination of $a$ and $b$.

<div class="definition">
  <div class="definition-header">
    <strong class="definition-type">[Theorem]</strong>
    <strong class="definition-title">Extended Euclidean Algorithm</strong>
  </div>

Let $a$ and $b$ two positive numbers in $\mathbb{Z}$. The following combination
has always a solution with $u$ and $v$ in $\mathbb{Z}$:

$$
au + bv = \gcd(a,b)
$$

</div>

An interesting alternative formulation of the same equation, is the one for
relatively prime numbers:

$$
\frac{A}{\gcd(A,B)}u + \frac{B}{\gcd(A,B)}v = 1
$$

Before we mentioned that we have an algorithm to compute the $\gcd$ efficiently.
But, what does it mean to compute something in an efficient way?

The Euclidean algorithm has $\mathcal{O}(\log_2n)$ complexity since it is
possible to demonstrate that $r_{i+2} < r_i$, so every two steps we have a
reduction by half.

## The fast powering algorithm

> TODO

## References

1. Hoffstein, Pipher, Silverman,
   [_An Introduction to Mathematical Cryptography_, Chapter 2](https://link.springer.com/book/10.1007/978-1-4939-1711-2)
