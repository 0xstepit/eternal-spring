---
author: Stefano Francesco Pitton
title: Git reset
slug: git-reset
summary: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
tags: [git, github, dev, something, test]
related: []
created: 2024-11-11
modified: 2025-11-26
to-publish: false
---

# Git reset

With `git reset` it is possible to modify commits keeping the working directory
unaltered.

## Soft

Let's say you want to undo a commit but still want to have the changes inside
the commit applied to your working project. To do so, we can move the HEAD
pointer in git to a specific commit:

```sh
git reset --soft <COMMIT>
```

It is also possible to reset to the second to last commit with:

```sh
git reset --soft HEAD~1
```

With git reset, the changes applied in the commit that have been removed are
maintained in the staging area.

## Examples

Let's imagine you have an history like the following one:

```sh
94135e0 - stepit, 2 minutes ago  ignore copilot config
04f9df0 - stepit, 4 minutes ago  refactor nvim config
f42c521 - stepit, 5 minutes ago  update env config
c88db61 - stepit, 6 minutes ago  update aliases
8acd2b7 - stepit, 7 minutes ago  add copilot
b3b2028 - stepit, 7 minutes ago  add ghostty config
```

What we did is that we committed the copilot configuration in the second to last
commit from the bottom and we added the config to git ignore in the last commit.
The issue here, is that it is not safe to push a commit with secrets like in the
"add copilot" commit. This is the reason we ignore it in the last commit.
However, luckily, Github block us from pushing these commit because it is still
possible to retrieve the secret from the commit. Rebasing here can help us!

```sh
git rebase -i 8acd2b7^
```

Now, we can just reorg the commit to move the commit adding copilot to the top,
just before adding it to the `.gitignore`.

```sh
pick 94135e0 ignore copilot config
pick 8acd2b7 add copilot
pick 04f9df0 refactor nvim config
pick f42c521 update env config
pick c88db61 update aliases
pick b3b2028 add ghostty config
```

Now we can squash the last two commit into a single one:

```sh
git rebase -i HEAD~2
```

```sh
s 94135e0 ignore copilot config
pick 8acd2b7 add copilot
```

Now that we have a single commit with the changes to the `.gitignore` and the
included files we want to remove, we can edit the commit and move everything to
the staging area!

```sh
git rebase -i HEAD~1
```

```sh
edit 8acd2b7 add copilot
```

```sh
git reset --soft HEAD~1
```
