---
author: stepit
title: "Rediscovering mathematics with abstract algebra"
slug: "rediscovering-mathematics-with-abstract-algebra"
created: 2025-12-23
modified: 2025-12-23
summary: ""
category: ""
tags: [math, cryptography]
related: []
to-publish: true
---

## Introduction

It is funny when you realize that behind the simple mathematical rules that you
discover during your years at the middle school, there is a complex
generalization of abstract mathematical rules. Yes rules, I choose this name
because when you start diving into **abstract algebra**, you realize that the
math you are used to do, is a kind of game with a set of rules, played with
numbers. And since it is a game, it is not generic, the rules does not hold for
all numbers but since the game was so nice and perfectly defined, nobody, except
people that studied theoretical math, understood that other games with numbers
exists, with slightly modified rules.

The goal of this essay is to provide a basic understanding on the abstract
algebraic entities required to understand modern cryptography systems.

## Algebra

If you studied engineering or other applied math subject, you probably already
heard about linear algebra. Scalars, vectors, and matrices with different orders
are defined, and the rules of how to use them allow to describe the nature
around us, like planets or fluid motions.

More generally, algebra is the branch of mathematics that deals with abstract
systems composed of algebraic structures and operation allowed on them, the
rules. With algebraic structures we intend nothing more than a sets of
mathematical objects, like numbers. If for a moment we don't directly associate
mathematics to numbers, we can immerse ourself in the field of abstract algebra,
where mathematical objects are studied from a general point of view.

So, we can define:

$$
\text{algebraic structure} = \text{mathematical objects} + \text{operations}
$$

In the course of the next sections, we are going to understand what are the
three main mathematical structures: **groups**, **rings**, and **fields**.

## Group theory

Groups are the simplest mathematical structure used to capture the essence of
mathematical phenomena. We say abstraction because the theory here described is
not applicable to only numbers, but also to geometric shapes, polynomials, and
many other entities.

<div class="definition">
  <div class="definition-header">
    <strong class="definition-type">[Def]</strong>
    <strong class="definition-title">Group</strong>
  </div>

A group $(\mathbb{G}, \star)$ is defined as a set $\mathbb{G)}$ and a binary
map $\star: \mathbb{G} \times \mathbb{G} \rightarrow \mathbb{G}$ which takes two
elements from the set, and returns another element from it. The map is called
**group law**, and must satisfy the following requirements:

1. Associativity: $\forall a,b, c \in \mathbb{G}$ the equation $a \cdot(b \cdot c) = (a \cdot b) \cdot c)$ holds.

2. Existence of the neutral element: $\exists e \in \mathbb{G} : eg = g, \, \forall g \in \mathbb{G}$.

3. Existence of the inverse element: $\exists g^{-1} \in \mathbb{G} :  gg^{-1} = e, \, \forall g \in \mathbb{G}$.
</div>

Points 1. to 3. are called **axioms** of the group. This is definition of group
is the most general, but we will be mainly interested in a particular type of
group in which the order of application of the group law to two group element is not important:

<div class="definition">
<strong class="definition-title">[Def] Abelian Group</strong>

A group $(\mathbb{G}, \cdot)$ is defined as a set $\mathbb{G)}$ and a binary
map $\cdot: \mathbb{G} \times \mathbb{G} \rightarrow \mathbb{G}$ which takes two
elements from the set, and returns another element from it. The map is called
**group law**, and must satisfy the following requirements:

1. Commutativity: $\forall a,b \in \mathbb{G}$ the equation
   $a \cdot b = b \cdot a$ holds.

1. Associativity: $\forall a,b, c \in \mathbb{G}$ the equation
   $a \cdot(b \cdot c) = (a \cdot b) \cdot c)$ holds.

1. Existence of the neutral element:
   $\exists e \in \mathbb{G} : eg = g, \, \forall g \in \mathbb{G}$.

1. Existence of the inverse element:
   $\exists g^{-1} \in \mathbb{G} :  gg^{-1} = e, \, \forall g \in \mathbb{G}$.

</div>

Abelian groups are most commonly called **commutative groups**. Based on the
group law, there are two main notation used in the description of commutative
groups:

- **Additive notation**: The group law is the addition, the neutral element is
  0, and the inverse of $g$ is $-g$. The group can be rewritten as:
  $(\mathbb{G}, +)$

- **Multiplicative notation**: The group law is the multiplication, the neutral
  element if 1, and the inverse of $g$ is $g^{-1}$. The group can be rewritten
  as: $(\mathbb{G}, \cdot)$

One important concept in the theory of group is the **order** of a group. The order of
a group is the number of elements contained in the group. A concept that will be clearer
later in this essay, is that it is possible to associated the concept of order also to
group elements. The order of an element is the order of the subgroup generate by that element.

TODO: add def of subgroup.

### Homomorphism

A group homomorphism from two groups $(\mathbb{G}, \ast)$ and
$(\mathbb{H}, \bullet)$ is a function $h: \mathbb{G} \rightarrow \mathbb{H}$
such that $\forall u, v \in \mathbb{G}$ the following equation holds:

$$
h(u\ast v) = h(u) \bullet h(v) \tag{1}
$$

An interesting property of abelian groups is that, if
$f, g: \mathbb{G} \rightarrow \mathbb{H}$ are two group homomorphism between
abelian groups, then the following relation holds:

$$
(f + g)(x) = f(x) + g(x) \tag{2}
$$

So, also their sum is an homomorphism.

### Finite groups

<div class="definition">
  <div class="definition-header">
    <strong class="definition-type">[Def]</strong>
    <strong class="definition-title">Finite Group</strong>
  </div>

A finite group is a group whose underlying set is finite, i.e., the number of
elements in the set is finite.

</div>

These groups are of particular relevance in theoretical physics and chemistry because are associated with mathematical and physical symmetries.

#### Finite Cyclic Group

Every group of prime order is cyclic.

## Examples

## References

1. https://en.wikipedia.org/wiki/Group_(mathematics)
2. https://en.wikipedia.org/wiki/Abelian_group
3. [Wikipedia - Subgroup](https://en.wikipedia.org/wiki/Subgroup)
