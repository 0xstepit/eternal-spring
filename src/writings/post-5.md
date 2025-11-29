---
author: Stefano Francesco Pitton
title: "Configuring git for work"
slug: "configuring-git-for-work"
tags: []
related: []
created: 2025-02-09
modified: 2025-11-09
to-publish: false
---

# Configuring git for work

Let's say you join a new company and you're asked to commit in Company's
directories always with the company email and signing all commits. Well, it's
easy to configure your computer to achieve that with minimal customization.

The way I appraoched this, is to create a company directory, called for example
`Work`, and inside of this I crerated a `.gitconfig` file with the following
content:

```sh
[user]
  name = stepit
  email = stefano@noble.xyz
  signingkey = 9687CCDB9B1378DA5DAF3D91A137106A611FE43F

[commit]
  pgsign = true
```

Wiht this file, we configured whihc email and signkey to use in commits, and
also that all commit has to be signed. Now, in the `.gitconfig` file in the
root, add these statement:

```sh
...

[includeIf "gitdir:~/Repositories/Blockchain/Noble/"]
    path = ~/Repositories/Blockchain/Work/.gitconfig
```
