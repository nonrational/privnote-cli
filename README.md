# **privnote-cli** [![Build Status](https://secure.travis-ci.org/nonrational/privnote-cli.svg?branch=master)](http://travis-ci.org/nonrational/privnote-cli)
_the power of [privnote.com](https://privnote.com) in your terminal_

#### [privnote.com](https://privnote.com): Send notes that will self-destruct after being read.

Privnote allows you to create one-time-pad encrypted, burn-after-reading notes over the internet. It's a great way to share passwords or other sensitive peices of information. But, you have to use a web browser! Or, should I say, _had_ to.

### Installation

```bash
npm install -g privnote-cli
# don't forget to `nodenv rehash` if you're using nodenv
```

### Usage

You bring the plaintext; `privnote` will print the link to stdout _and_ the clipboard.

#### Type directly into stdin a la `gpg`. (Recommended)

```
$ privnote
bob,
the narwhal bacons at midnight.
-- alice
^D
https://privnote.com/n/abcdefghijklmnop/#qrstuvwxyz123456
```

#### Pipe the output of a command to privnote.

Be sure to clear your shell history (`$HISTFILE`) if you included secrets in your command.

```
$ ruby <(echo 'require "securerandom"; print "#{SecureRandom.urlsafe_base64(12)}\n";') | privnote
https://privnote.com/n/abcdefghijklmnop/#qrstuvwxyz123456
```

#### Privnote files directly via input redirection.

```
$ privnote < secrets.txt
https://privnote.com/n/abcdefghijklmnop/#qrstuvwxyz123456
```


##### Releasing

```
```
