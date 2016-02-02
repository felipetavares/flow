# Flow

![Flow Screenshot](/design/screenshots/client01.png)

Flow wants to be a mud.

It is a project from the [ctrl-c club](http://ctrl-c.club/) members,
developed just for fun and to integrate the community.

# Game Design Document

The design document can be found at `design/gdd.md`.

# Compiling & installing

First, install npm, then:

```
git clone https://github.com/felipetavares/flow.git
cd flow
sudo npm install -g
```

To run the server:

    flow-server

client:

    flow-client

# Unit Tests

If you wish to run the tests, type

    flow-server -t

## Writing tests

Create a file in `src/test` and add a `loadTest` statement to `src/test/lib.js`.

Follow the structure from `src/test/vec2.js`.
