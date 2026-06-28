---
author: stepit
title: Private and secure communications with GPG and YubiKey
slug: private-and-secure-communications-with-gpg-and-yubikey
created: 2025-05-03
modified: 2026-05-26
summary: ''
category: ''
tags: [cryptography, security]
related: []
to-publish: true
---

## Introduction

As our life is being more and more moved into the digital world, the necessity
to trust digital information increases. How can we trust information we receive
digitally? How to trust authors of software we use? How to let people trust what
we share with them? All these questions are becoming harder to answer in an
environment in which many of the actions are executed by AI/bots agents. In a
context in which reputation is still a valid source of trust, people need to be
sure to protect the way in which they authenticate on the internet.

GnuPG, or GPG in short, is an open-source implementation of the Pretty Good
Privacy (OpenPGP) standard which defines a way to implement secure communication
and identity verification via message encryption and digital signatures.

In this guide, we will see how to configure GPG so that we will be able to
securely protect our digital identities to authenticate with SSH, sign git
commits, and share encrypted messages. In doing so, we will configure the GPG
cryptographic tools, and will protect them with a YubiKey.

A YubiKey is a hardware system that allows performing cryptographic actions with
enhanced security. The enhanced security comes from the requirement to use a
physical system, the key, and to perform physical actions on it, preventing this
way many of the online scam and phishing activities that can target us.
Depending on the considered key, different protocols are supported. A protocol
is associated with an applet in the hardware. In the following, we will only
deal with the OpenPGP applet, all the others, like the one for FIDO2, will not
be covered. This is made possible because in the YubiKey, each applet has its
own isolated storage and key space, and it is possible to work independently on
each of them.

Also, only MacOS is considered since it's the OS I'm currently using.

At the end of this document we will be able to sign git commits and to encrypt
and decrypt files.

## Dependencies and initial setup

Let's start by installing the software we need:

```sh
brew install gnupg yubikey-personalization ykman pinentry-mac
```

Next, we create the home folder for the GPG software in the root of our system:

```sh
cd ~
mkdir .gnupg/
chmod 700 ~/.gnupg
chmod 600 ~/.gnupg/*
```

Where with the `chmod` command we set the required authorizations on the folder.
We can now download an hardened configuration for GPG. This configuration will
define improved security parameters for the software, along with some nicer
visualization settings:

```sh
cd .gnupg
wget https://raw.githubusercontent.com/drduh/YubiKey-Guide/master/config/gpg.conf
```

If you already played around with the `gpg` utility, you can visualize the keys
already stored in the system with:

```sh
gpg --list-keys
```

Or with the shorter command `gpg -k`. We can also visualize the private keys
with:

```sh
gpg --list-secret-keys
```

Or `gpg -K` for short.

Despite public and private keys are associated with each other, it is possible
to eliminate keys individually from the keyring, this is why we can obtain
different results by running the two commands. The keyring is where the keys are
stored.

## Keys generation

One of the most confusing aspects about GPG is that, even if you are familiar
with how public-key cryptographic systems work, GPG uses a more sophisticated
scheme on top of it. In a public-key system, a user generates two keys, a
**private key** and a **public key**. The former is used to sign messages and
must be kept secret, while the latter is your public identity that you can share
with other people, and that is used to encrypt messages that only the owner of
the associated private key can decrypt. The combination of a private and public
key is called **keypair**. In GPG, a user has a primary keypair, and could have
associated with it zero or more subordinate keys. These **subkeys** are what
usually confuse people. These keys do not have anything in common
algorithmically speaking with the master one; they can be created with different
protocols and with different security guarantees. The idea behind this system is
to create a pyramidal structure to improve security by distributing
responsibilities to multiple keys. To understand why, just think that a private
key can be used for both **signing** and **decryption**. A person could be
tricked into signing something when they intended to decrypt, or vice versa,
without even noticing it.

For this reason, in GPG, keys are associated with capabilities. There are 4
capabilities in the protocol:

- **Encrypt (E)**: encrypt/decrypt messages.
- **Sign (S)**: sign documents.
- **Authentication (A)**: authenticate in the SSH protocol.
- **Certify (C)**: certify the validity of user IDs and subkeys. This capability
  should only be associated with a master key.

Another interesting feature of GPG, which has been mentioned in the description
of the certify capability, is that a user is associated with IDs, supporting in
this way communication in which a cryptographic identity is associated with a
real person. A user can have multiple identities, like the private and the
working one, all certified by the same master key.

All the information just presented are reported in the example of a GPG
configuration below:

```sh
sec   rsa4096/0xAB1D52E41481304E 2026-05-18 [C]
      Key fingerprint = 7074 D655 C8AB F6D4 2B28  0264 AB1D 52E4 1481 304E
uid                   [ultimate] Stefano <stefanofrancesco.pitton@gmail.com>
ssb   rsa4096/0xA6A4DB0D7826FFC2 2026-05-18 [S] [expires: 2028-05-17]
      Key fingerprint = 6BC8 8EA3 21A4 F97F 0D39  8E19 A6A4 DB0D 7826 FFC2
ssb   ed25519/0x8FD71E3BAA59634A 2026-05-18 [A] [expires: 2028-05-17]
      Key fingerprint = 1AB4 C608 CBAF 8B8A FF08  4EBA 8FD7 1E3B AA59 634A
ssb   rsa3072/0x735A31404D655993 2026-05-18 [E]
      Key fingerprint = A900 1B6A 91FA 180E 0FCC  78E9 735A 3140 4D65 5993
```

In this configuration, we have 1 key for each of the capabilities previously
mentioned, and we are going to understand how to do it in the next chapters.
Notice that we could also have a single key for all the operations, nothing
prevents us from implementing this configuration, but is not recommended for the
reasons described before.

As a quick recap to be sure that everything is clear by now, in a secure GPG
scheme we have:

- A master key that represent a single person or entity.
- The master key is used to connect different identities and subordinate keys to
  the user.
- An identity is just an identifier of a person in a specific context, like work
  or private life.
- For each of the GPG capabilities, we associate a different key that can be
  updated easily in case of security breaches.

Since by having access to the master key it's possible to modify our GPG
configuration and keys, we need to protect it with a passphrase. The
[dr duh guide] provides a script to generate a secure passphrase in a simple
way:

```sh
export CERTIFY_PASS=$(LC_ALL=C tr -dc "A-Z2-9" < /dev/urandom | \
    tr -d "IOUS5" | \
    fold  -w  ${PASS_GROUPSIZE:-4} | \
    paste -sd ${PASS_DELIMITER:--} - | \
    head  -c  ${PASS_LENGTH:-29})
printf "\n$CERTIFY_PASS\n\n"
```

You are not forced to use this snippets, but be sure to define a secure enough
passphrase and to create the env variable storing it if you want to follow along
with this article. Note also that you should remove the associated variable once
you're done with the setup.

### The master key

We can now start by creating the first key, the master one.

```sh
gpg --full-generate-key --expert
```

The command will guide you through a multi-steps procedure to create the master
key. Let's break down all the steps:

1. Algorithm: select the number 8 to create a keypair with the
   **Rivest-Shamir-Adleman** (RSA) cryptosystem.
1. Capabilities: toggle/untoggle the capabilities until you only have the
   Certify enabled. As mentioned above, we will use the master key only to
   certify all the subkeys and identities.
1. Key size: the key size controls the number of bits defining the security of
   the keys. Select 4096.
1. Expiration: select never.
1. Identity: specify the main identity associated with the master key.
1. Passphrase: this password will be needed to perform any administrative action
   on the keypairs.

We can confirm that the generation went through successfully by running
`gpg -k`. We should see something like:

```sh
[keyboxd]
---------
pub   rsa4096/0xB664675480F0EA01 2026-05-20 [C]
      Key fingerprint = 6F87 0A18 9EC8 A44A C852  55B5 B664 6754 80F0 EA01
uid                   [ultimate] stefano (principal) <stefanofrancesco.pitton@gmail.com>
```

All the information specified during the creation process are now visible in
output.

### Subkeys generation

As mentioned above, the best practice is to use the master key only for
certification, and to use a different subordinate key for each GPG action. All
the subordinate keys will be validated by a certificate signed with the master
key, and the certify key will also be used to remove the certificate from
compromised subkeys or identities.

Instead of doing the process manually like above, for the subkeys we will be
using the scripting approach. To do so, we need to define some more env
variables:

```sh
export KEY_TYPE=rsa4096
export EXPIRATION=2y
export KEYID=$(gpg -k --with-colons "$IDENTITY" | \
    awk -F: '/^pub:/ { print $5; exit }')
```

Now, we can proceed. Create the signing key:

```sh
echo "$CERTIFY_PASS" | \
    gpg --batch --pinentry-mode=loopback --passphrase-fd 0 \
        --quick-add-key "$KEYFP" "$KEY_TYPE" sign "$EXPIRATION"
```

Create the encrypt key:

```sh
echo "$CERTIFY_PASS" | \
    gpg --batch --pinentry-mode=loopback --passphrase-fd 0 \
        --quick-add-key "$KEYFP" "$KEY_TYPE" encrypt "$EXPIRATION"
```

For the SSH auth, we specify a different algorithm since some systems does not
support anymore the RSA for SSH authentication. Instead, we will use a keypair
generated on an **elliptic curve**. Please, notice that neither the elliptic
curve nor the RSA are quantum-resistant cryptosystems so I recommend you to
follow the industry to understand when it will be recommended to change keys
generation system. Create the auth key:

```sh
export KEY_TYPE=ed25519
echo "$CERTIFY_PASS" | \
    gpg --batch --pinentry-mode=loopback --passphrase-fd 0 \
        --quick-add-key "$KEYFP" "$KEY_TYPE" auth "$EXPIRATION"
```

With the flag `--passphrase-fd 0` we instruct the program to read the passphrase
from the stdin, which is where we send the env variable associated with it with
the pipe command.

By running again the command `gpg -k` we will now see that we have 3 new `sub`
keys, each with a different capability:

```sh
[keyboxd]
---------
pub   rsa4096/0xB664675480F0EA01 2026-05-20 [C]
      Key fingerprint = 6F87 0A18 9EC8 A44A C852  55B5 B664 6754 80F0 EA01
uid                   [ultimate] stefano (principal) <stefanofrancesco.pitton@gmail.com>
sub   rsa4096/0xF9C51037B20ABF13 2026-05-20 [S] [expires: 2028-05-19]
      Key fingerprint = E515 516F F10D 08A4 E6A5  CDC4 F9C5 1037 B20A BF13
sub   rsa4096/0x12A034ABF9DFB13B 2026-05-20 [E] [expires: 2028-05-19]
      Key fingerprint = 2F79 0E97 57FC 4AB0 DE16  4B04 12A0 34AB F9DF B13B
sub   ed25519/0xA6AFF45393A73F50 2026-05-20 [A] [expires: 2028-05-19]
      Key fingerprint = EE34 A6E6 ADA6 8334 B87C  F633 A6AF F453 93A7 3F50
```

## Backup the master key

As already mentioned, the most important component of the system we just created
is the master key. It will not be needed during a normal day since its role is
only to certify or remove the certification from subkeys and identities. For
this reason, we will create a backup of it, and then we will remove it from our
computer. In this way, even if someone steals our computer, they will not be
able to tamper with our identity and we will be able to revoke the certificates
and to create new ones.

To export the key:

```sh
gpg --armor --export-secret-keys $KEYID > $KEYID-certify-backup.asc
```

The `.asc` extension indicates that the key has been exported with the `--armor`
flag which is the standard ASCII-armored format based on the base64-encoded text
starting with `-----BEGIN PGP PUBLIC KEY BLOCK-----`.

To export the key you will need to provide the passphrase used during its
generation.

Now the problem is, where should I store this backup? This depends on your
**threat model**, which defines to which attack your approach is not vulnerable
to. The recommended approach is to store it in an offline external drive.
Another valid, but weaker approach, is to encrypt the file with a symmetric
encryption scheme, and then store the encrypted file on a cloud drive. The
choice of which approach to use is completely on you.

If you want to proceed with the latter approach, you can encrypt the generated
file with the `gpg` utility:

```sh
gpg -c --armor $KEYID-certify-backup.asc
```

And later decrypt it with:

```sh
gpg -d $KEYID-certify-backup.asc.asc > $KEYID-certify-backup.asc
```

Before proceeding, we should verify that the backup works properly. We will test
it by creating a new temporary folder for the `gpg` software to use as a root
directory:

```sh
export GNUPGHOME=$(mktemp -d)
gpg --list-secret-keys
```

This should not return any key. Now, we import the key from the backup. To do
so, we will need to input the passphrase used during the generation of the key:

```sh
gpg --import $KEYID-certify-backup.asc
gpg -K
```

If everything worked properly, run `unset GNUPGHOME`, if not, well, better to
start from scratch then. Don't worry if something didn't work properly, I had to
repeat this process multiple times to properly understand all the moving pieces
involved and to be comfortable in using GPG. So, keep going!

We can also export the public key before removing the private one:

```sh
gpg --armor --export $KEYID > pk.asc
```

But which public key are we exporting now? Ideally we need all the public keys
associated with the master because each one is associated with a different
scope. One cool feature about GPG is that when we export the public key, we are
actually exporting in a specific format all the keys we have, and the
application using GPG is able to use the correct one based on the action. This
is amazing because with this approach other people or application will not have
to deal directly with the personal structure we decided to use for our identity.

We can also get more information about what is exported by running:

```sh
gpg --list-packets pk.asc
```

Now we can safely remove the private key from our computer:

```sh
gpg --delete-secret-key $KEYID
```

## Move the subkeys to the YubiKey

```sh
gpg --card-status
```

````sh
Reader ...........: Yubico YubiKey FIDO CCID
...
Signature key ....: [none]
Encryption key....: [none]
Authentication key: [none]
General key info..: [none] ```
Change the PIN:

`sh ... `

Change the Admin PIN:

```sh
...
````

Configure a reset code:

```sh
...
```

Transfer the subkeys to the card

```sh
gpg --card-edit
gpg/card> admin
gpg/card> passwd
```

We can specify the retry:

```sh
ykman openpgp access set-retries 5 5 5 -a <the password>
```

```sh
~/gnupg-home gpg --edit-key 6FA96B657D89C259
Secret key is available.

sec  rsa4096/0x6FA96B657D89C259
     created: 2026-05-18  expires: never       usage: C
     trust: ultimate      validity: ultimate
ssb  rsa4096/0x07582AB0E67494EA
     created: 2026-05-18  expires: 2028-05-17  usage: S
ssb  rsa4096/0x0D4203EC89AD6D5D
     created: 2026-05-18  expires: 2028-05-17  usage: E
ssb  ed25519/0x058CDA36E301F9EC
     created: 2026-05-18  expires: 2028-05-17  usage: A
[ultimate] (1). Stefano <stefanofrancesco.pitton@gmail.com>

gpg> key 1

sec  rsa4096/0x6FA96B657D89C259
     created: 2026-05-18  expires: never       usage: C
     trust: ultimate      validity: ultimate
ssb* rsa4096/0x07582AB0E67494EA
     created: 2026-05-18  expires: 2028-05-17  usage: S
ssb  rsa4096/0x0D4203EC89AD6D5D
     created: 2026-05-18  expires: 2028-05-17  usage: E
ssb  ed25519/0x058CDA36E301F9EC
     created: 2026-05-18  expires: 2028-05-17  usage: A
[ultimate] (1). Stefano <stefanofrancesco.pitton@gmail.com>

gpg> keytocard
Please select where to store the key:
   (1) Signature key
   (3) Authentication key
Your selection?
```

```sh
ykman openpgp keys set-touch sig on
ykman openpgp keys set-touch enc on
ykman openpgp keys set-touch aut on
```

This way we defend ourselves from malware that could silently use our keys while
the PIN is cached.

## Example

This section contains a simple walk-through in the usage of the GPG protocol.

Create a simple text file:

```sh
touch example.txt
echo "We love cryptography" >> example.txt
```

We can now encrypt the file with the public key of a user we have, like our own
pubkey:

```sh
 gpg --output example.gpg --encrypt --recipient Stefano example.txt
```

This will create a new file called `example.gpg`, where the extension is used
just to make it clear it is an encrypted message. To decrypt the message, we
need the private key associated with the pubkey used in the encryption phase:

```sh
gpg --output example.clear --decrypt example.gpg
```

Like before, the extension is used just to make it clear it is the output of the
decryption phase. You can quickly check that the encrypted file is the equal to
the original one by performing byte-wise comparison from the shell:

```sh
cmp -s example.txt example.clear && echo "The files are the same" || echo "The files are different"
```

In the decryption phase, the stdout will display:

```sh
gpg: encrypted with rsa4096 key, ID 0DC70559F6622BBF, created 2026-05-18
      "Stefano <stefanofrancesco.pitton@gmail.com>"
```

Where we can verify that the ID of the key used is associated with the subkey
devoted to the encryption:

```
[keyboxd]
---------
pub   rsa4096/AB1D52E41481304E 2026-05-18 [C]
      Key fingerprint = 7074 D655 C8AB F6D4 2B28  0264 AB1D 52E4 1481 304E
      Keygrip = B39BAD14C262BA5EA9B58352D349095BFDBB0B9C
uid                 [ultimate] Stefano <stefanofrancesco.pitton@gmail.com>
sub   rsa4096/A6A4DB0D7826FFC2 2026-05-18 [S] [expires: 2028-05-17]
      Key fingerprint = 6BC8 8EA3 21A4 F97F 0D39  8E19 A6A4 DB0D 7826 FFC2
      Keygrip = 9D6E454CC3B06E8B47DDA7C10824FC00E96D7805
sub   rsa4096/0DC70559F6622BBF 2026-05-18 [E] [expires: 2028-05-17]
      Key fingerprint = 6260 83D8 8C71 7382 B7FB  9A1D 0DC7 0559 F662 2BBF
      Keygrip = F47401D93385E21F108C1ECE71792F49CAD74F27
sub   ed25519/8FD71E3BAA59634A 2026-05-18 [A] [expires: 2028-05-17]
      Key fingerprint = 1AB4 C608 CBAF 8B8A FF08  4EBA 8FD7 1E3B AA59 634A
      Keygrip = D2201DA1A0801F3F7C3EDF7AA89759F735442A68
```

To obtain this longer output from the `gpg --list-keys` you need to add to your
`~/.gnupg/gpg.conf` the following lines:

```txt
keyid-format LONG
with-fingerprint
with-keygrip
```

We can investigate further the encryption process by using the `--verbose` flag:

```sh
echo "" | gpg --encrypt --recipient Stefano --armor --verbose
```

From which we can see that the algorithm uses the public key associated with the
subordinate key devoted to encryption:

```sh
gpg: enabled compatibility flags:
gpg: using subkey 0DC70559F6622BBF instead of primary key AB1D52E41481304E
gpg: using pgp trust model
gpg: This key belongs to us
gpg: reading from '[stdin]'
gpg: writing to stdout
gpg: RSA/AES256.OCB encrypted for: "0DC70559F6622BBF Stefano <stefanofrancesco.pitton@gmail.com>"
-----BEGIN PGP MESSAGE-----

hQIMAw3HBVn2Yiu/ARAApkJqzcTromECQ7JDnGk0ti5MqcReH6a4j5sl5d4Fa2AR
U01QFfIrYsGVOO9Yw1Kbct0nDwCaZCxVxcnK7Fx85m1yrbx84FoHpH24R77F0Pfj
+HvOyGmm3Az5YBUdk9V57rNCJ1T1qPnSwSLJA/pO67eC1zZUGQFoMtK2I4RgqVQL
/UwaIoyyVpGrrVwmu5v0sCytKRbDLofXNXJw1NXGu4t2d7+ZQ2rGJN7PgpX+J33A
JUVYaFWY/2V/4ZrBVi/3CSeBgdU/eBcn5V1u6Tzzm7sLwdxsAyYOaQ/P0JMq7fWL
+gXmyQ/t22uV5Tkpg+lhCangz/2L1qtxC2joat57tgedsehiCcTaRY22fkbJMzUI
QLgEQOelgF1w3qTUpIz1SL5njxzIfzC68tZyx9WFIjyj4OCxhR2wfegfSbw/Z8Mk
HvE14tx7nnYRsTs1tQiPU3d7tmoLRW5RKmGJQvkc65A6E8qDniLuoc5l/Cc7kRdE
S/PS6V6Bmg40MvthBCl1287zxRj2ZtGMmLZeFFOtn4Mn2ASrxGDUsd0gf38j1iCH
6jt8w/pGtilSMWqjO22fbY7lWsIoatmDwm1FWfwwdFFNLejoBmLBraNlJXA/rDfi
jWjubx6RHLWQl2QWC7w7Vg7UHgrvncTYfikRHoR1Su0RxckFfXDT1X4bGMUPCGrU
RgEJAhCadgwcVjNeFDOQKRiwY5pvVr+638EEoN5wcyZsETq90zOTdZbljDOORkG0
A8wLIHhDMTzZb6iXRSZKDrp7psiYw+M=
=r+/U
-----END PGP MESSAGE-----
```

If a key is revoked, gpg will display that it is not possible to encrypt and
stop the process:

```sh
gpg: enabled compatibility flags:
gpg: Stefano: skipped: Unusable public key
gpg: [stdin]: encryption failed: Unusable public key
```

Notice that you are not limited to have one key per scope:

```sh
pub   rsa4096/AB1D52E41481304E 2026-05-18 [C]
      Key fingerprint = 7074 D655 C8AB F6D4 2B28  0264 AB1D 52E4 1481 304E
      Keygrip = B39BAD14C262BA5EA9B58352D349095BFDBB0B9C
uid                 [ultimate] stepit (Engineering) <stefano.pitton@proton.me>
uid                 [ultimate] Stefano <stefanofrancesco.pitton@gmail.com>
sub   rsa4096/A6A4DB0D7826FFC2 2026-05-18 [S] [expires: 2028-05-17]
      Key fingerprint = 6BC8 8EA3 21A4 F97F 0D39  8E19 A6A4 DB0D 7826 FFC2
      Keygrip = 9D6E454CC3B06E8B47DDA7C10824FC00E96D7805
sub   ed25519/8FD71E3BAA59634A 2026-05-18 [A] [expires: 2028-05-17]
      Key fingerprint = 1AB4 C608 CBAF 8B8A FF08  4EBA 8FD7 1E3B AA59 634A
      Keygrip = D2201DA1A0801F3F7C3EDF7AA89759F735442A68
sub   dsa2048/69E4DA530FD2B3F1 2026-05-18 [S]
      Key fingerprint = 0310 9C62 E2CC F70A 8288  0C22 69E4 DA53 0FD2 B3F1
      Keygrip = AAAE79092D281302A0A158F5A16F1F4F59B75E2E
sub   rsa3072/D164EF58A985214B 2026-05-18 [S]
      Key fingerprint = 7091 C662 13D4 1CB1 ED93  F86D D164 EF58 A985 214B
      Keygrip = 6BA8396F59EB37296739FF69F99467C784D4DE52
```

If a user has multiple subkeys for encryption, gpg uses the most recent one by
default when encrypting a message.

## Adding identities

It is possible to add identities to the ID associated with the master key. In
particular, this is possible by creating a new user ID and signing it with the
master key:

```sh
gpg --edit-key stefano
gpg> adduid

...follow the steps...

gpg> save
```

If you now display all the keys, you will see two identities:

```sh
uid                 [ultimate] stepit (Engineering) <stefano.pitton@proton.me>
uid                 [ultimate] Stefano <stefanofrancesco.pitton@gmail.com>
```

With this approach it is possible for example to add the email used for work,
and to remove it if you change company.

## Configure Git signing

We can now configure git to use and enforce the signature of our commits with
the private key associated with the signing subkey [S]. First, we have to update
the env variable to use the key id of the key associated with \[S\]:

```sh
sub   rsa4096/0xF9C51037B20ABF13 2026-05-20 [S] [expires: 2028-05-19]
      Key fingerprint = E515 516F F10D 08A4 E6A5  CDC4 F9C5 1037 B20A BF13
```

And now:

```sh
git config --global user.signingkey $KEYID
git config --global commit.gpgsign true
git config --global tag.gpgsig true
```

If you try to push signed commit to Github now, they will appear as
`Unverified`. The reason is that Github is unaware that the key used is
associated with your profile. We can solve this adding a new GPG in our Settings
for `SSH and GPG keys`. After this step, each signed commit will appear as
`Verified`.

You can also verify that you properly signed a commit by running:

```sh
git log --show-signature
```

You will see something like:

```sh
commit f224f1174d4df1010de47134aa07dba91937929a
gpg: Signature made Wed May 20 11:27:05 2026 CEST
gpg:                using RSA key E515516FF10D08A4E6A5CDC4F9C51037B20ABF13
gpg: Good signature from "stefano (principal) <stefanofrancesco.pitton@gmail.com>" [ultimate]
Primary key fingerprint: 6F87 0A18 9EC8 A44A C852  55B5 B664 6754 80F0 EA01
     Subkey fingerprint: E515 516F F10D 08A4 E6A5  CDC4 F9C5 1037 B20A BF13
Author: stepit <stefanofrancesco.pitton@gmail.com>
Date:   Wed May 20 11:27:05 2026 +0200
```

## Using GPG for SSH

During the subkeys generation, we created a key for the Authentication
capability. This key can now be used to authenticate within the **Secure SHell**
(SSH) protocol.

To log into SSH with the key, we need first to instruct the `gpg-agent`, which
is the software used to manage secret key in GnuPG, to enable this feature:

```sh
touch gpg-agent.conf
echo "enable-ssh-support" >> gpg-agent.conf
gpgconf --kill gpg-agent
gpgconf --launch gpg-agent
```

Now we have to instruct the SSH software to use the agent:

```sh
export SSH_AUTH_SOCK=$(gpgconf --list-dirs agent-ssh-socket)
```

You should add this env variable to the one automatically loaded in every shell
if you don't want to repeat this setting every time you open a new terminal
pane. We can see the public key used by the agent with:

```sh
ssh-add -L
```

Since the key is inside our YubiKey, which is a card for the GnuPG software, we
should see something like:

```sh
ssh-ed25519 AAAA.... cardno:XX_XXX_XXX
```

Where the `cardno` is the `Serial Number` of our card:

```sh
gpg --card-status | grep "^Serial"
```

After adding the SSH key to your Github profile for example, you can test that
it works correctly by running:

```sh
ssh -T git@github.com
```

If it fails and does not return something like:

```sh
Hi 0xstepit! You've successfully authenticated, but GitHub does not provide shell access
```

Then, obviously something didn't work, but don't worry since it has been the
case also for me. The issue was with the gpg agent and the pinentry. I solved it
by using a different version that uses the native macOS dialog:

```sh
brew install pinentry-mac
echo "pinentry-program /opt/homebrew/bin/pinentry-mac" >> ~/.gnupg/gpg-agent.conf
```

Then, kill and launch again the agent. Remember that if you set the mandatory
touch to the YubiKey to execute operation, you have to do it after adding the
PIN.

Also, notice that to use SSH with repositories stored on Github, you must use
the SSH URL for the remote like in the example below:

```sh
git remote set-url origin git@github.com:0xstepit/flow.nvim.git
```

## Troubleshooting

- If the gpg execution is interrupted improperly, like by pressing `Ctrl + C`,
  the terminal can start displaying text with a weird formatting. The reason is
  that gpg takes control of how the terminal display text and modify some
  display option which are not restored if closed improperly. To fix it, just
  execute:

  ```sh
  stty sane
  ```

- If you have other keys that you want to delete to start from a fresh GPG
  setting, you have to first delete the private keys, and then the public one.
  Notice that this process is irreversible, so consider if the keys you are
  removing are securing something important that will be lost after this action:

  ```sh
  gpg --delete-secret-keys <0x...>
  gpg --delete-keys <0x...>
  ```

  Where `0x...` is the placeholder for the HEX identifier of the key. If you
  didn't use the armored config, the `0x` prefix can be missing and the
  identifier will be the text after the algorithm name:

  ```sh
  rsa4096/B664675480F0EA01
  ```

- If you have to reset your YubiKey:

  ```sh
  ykman openpgp reset
  ```

  This command will reset only the GPG applet and not the others, so your 2FA
  will remain stored in the card and safe.

## Reference

1. [GnuPG](https://www.gnupg.org/)
1. [Github discussion](https://github.com/orgs/community/discussions/108355)
1. [Reddit - What is a primary key and subkey](https://www.reddit.com/r/GnuPG/comments/hxner0/what_is_primary_key_and_subkey/)
1. [Dr Duh Guide]

[dr duh guide]: https://github.com/drduh/YubiKey-Guide
