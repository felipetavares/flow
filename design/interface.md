# MUD interface

## Why non-scrolling

To allow for asynchronous updates of the content displayed, the interface must be non-scrolling. This means that new content will override old content, instead of making it sroll back.

This is necessary because prompts waiting for user input would scroll back, and even worst, with lots of users the screen could be constantly scrooling.

## Design

We have a terminal window:

```
|---------------|
|               |
|               |
|               |
|               |
|---------------|
```

probably, the best idea is to use most of this space to display the world view of the character. So:

```
|---------------|
|###############| ___
|###############|  |  -> all lines except the last one
|###############| ___
|               |     -> last line is the entry line
|---------------|
```

even better, we could make the entry line contextual: it would only appear when the user needed it. Using this approach we could have the following layout:

### Normal view

```
|---------------|
|###############| ___
|###############|  |  -> all lines used for the character's view
|###############|  |
|###############| ___
|---------------|
```

### Data entry view

```
|---------------|
|###############| ___
|####0000000####|  |  -> all lines used for the character's view
|####>000000####|  |  -> (scrollable?) data entry popup centered in the window
|###############| ___
|---------------|
```

an alternative data entry view would be

```
|---------------|
|000000000000000|
|000000000000000| -> fullscreen data entry view, it's a normal
|000000000000000|    terminal, but without scrollback
|>00000000000000|
|---------------|
```

## How we do it

We will have to either use some external library (like ncurses) or use ANSI escape codes directly.

# Input

To better suit this new kind of interface, *nethack* (roguelike) inspired key-based commands could be used. This means that instead of typing `go n`, the user would simply type `k` (or press the up arrow).

## How we do it

We will have to switch the terminal to a mode called [non-cannonical](http://www.gnu.org/software/libc/manual/html_node/Noncanonical-Input.html)
