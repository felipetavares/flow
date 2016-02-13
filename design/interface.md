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

## Library

We will use the library [blessed](https://github.com/chjj/blessed)

# Server interface

The server interface must show the needed information clearly and consistently.

Information must be logged both to a text file and to stdout. As such, it must be easily searchable.

Player common commands must not be logged, as this would flood the log.

## Mockup

```
Flow Server Version 0.1.0

30/01/2016 18:02 | #start
... startup log goes here
30/01/2016 18:02 | #ready
30/01/2016 18:05 | #login
information about the login
30/01/2016 17:05 | #login
information about the login
30/01/2016 17:06 | #register
information about the login

```

# Menus/Ui

## Intro

Lets talk a bit about how we reder things in *Flow*.

First, the `Map` structure in the server is synced with the client. Then, we push to the Array `map.updated` all the positions (screen coordinates) that changed.

Lastly we call the `render()` function from the interface to effectively draw on the screen everything that changed.

## Logic

Given the rendering flow discussed in the previous session, how could we implement an UI on top of that?

A few things to keep in mind:

1. Every time we render, if there is an overlay we need to draw it.
2. When an overlay receives any event it needs to be redraw, this involves calling the render method with a list of updated positions.

How to draw overlays on the render function? I propose a simple solution:

* We still use the same idea of only rendering what is in the `updated` array
* Now, instead of just asking the map at position x,y we ask first the ui, if there is something in the UI at that position, we don't need to ask the map.

But how the UI will keep track of where it has overlays? Simple AABB/Point collision tests. They can also be used to determine which AABB (it will represent a window) is at the given position.

I proppose also having windows do lazy rendering. They only define a function, lets call it `render` that receives a position (local) as argument and returns the character at that position.

All the UI events will work in the following fashion:

1. Event is received
2. Windows are created/modified
3. Updated positions are pushed to the `updated` array
4. `render()` (from interface) calls the `render` method of the given windows for all positions and they return the respective characters.
