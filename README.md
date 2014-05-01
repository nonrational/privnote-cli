# **privnote-cli**: 
_the power of [privnote.com](https://privnote.com) in your terminal_

#### [privnote.com](https://privnote.com): Send notes that will self-destruct after being read.

Privnote allows you to create one-time-pad encrypted, burn-after-reading notes over the internet. It's a great way to share passwords or other sensitive peices of information. But, you have to use a web browser! Or, should I say, _had_ to.

You've got three options when invoking privnote-cli.

Pass your note as argument(s)

```
node privnote-cli.js hi my name is alan
node privnote-cli.js "hello. how are you?"
```

Pass your note via stdin

```	
echo "the rain in spain stays mainly in the plain" | node privnote-cli.js
```

Use a here document to pass multiline notes:

```
node privnote-cli.js << EOF
<note-part-1>
<note-part-2>
EOF
```

After invocation, the privnote url will be printed at the commandline. If you use the bash wrapper for osx, it will also be copied to your clipboard.

### Installation

1. `git clone https://github.com/nonrational/privnote-cli.git ~/src/privnote-cli`
2. `cd ~/src/privnote-cli`
3. `git submodule update --init --recursive`
4. `npm install`
5. `echo "alias privnote=\"~/src/privnote-cli/privnote.osx.sh\"" >> ~/.profile`
6. `source ~/.profile`
