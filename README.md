# **privnote-cli**:
_the power of [privnote.com](https://privnote.com) in your terminal_

#### [privnote.com](https://privnote.com): Send notes that will self-destruct after being read.

Privnote allows you to create one-time-pad encrypted, burn-after-reading notes over the internet. It's a great way to share passwords or other sensitive peices of information. But, you have to use a web browser! Or, should I say, _had_ to.

### Installation

```bash
npm install -g privnote-cli
# nodenv rehash # if you're using nodenv
```

### Usage

#### Type directly into stdin a la `gpg`. (Recommended)

```
$ privnote
bob,
the narwhal bacons at midnight.
-- alice
^D
https://privnote.com/n/abcdefghijklmnop/#qrstuvwxyz123456
```

#### Pass your note via stdin. (Be sure to clear your shell history.)

```
$ echo "the rain in spain stays mainly in the plain" | privnote
https://privnote.com/n/abcdefghijklmnop/#qrstuvwxyz123456

```

#### pass files directly via redirection

```
$ privnote < secrets.txt
https://privnote.com/n/abcdefghijklmnop/#qrstuvwxyz123456
```
