# Pick into the future

> philips awakens! <br>
> philips feels `cold`!

```
#=#
#@|
###
```

* `#` (gray): concrete wall
* `|` (blue?/yellow?): sliding door
* `=` (red->green): console

`a`ccess `k`(up).

```
#=#
#@|
###
```

> The console turns green.

```
#=#
#@
###
```

> The sliding door opens.

## What we need to implement this?

* some form of map generation (for generating the cryo chamber).
* some form of connecting tile's actions (`a`ctivate console `o`pens door).
* colored tiles.
* messages to the user.
* action composition.

# Character stats

> philips awakens!

```
@
*
```

> philips grabs a rock.

```
@

```

> philips throws a rock.

```
@ *

```

> philips [throwing+1]

Characters generated with random stats and stat visualization.

For this we will also need a stat window.

And a system that stregthens stats based on use, so actions will
be linked with specific stats and every time an action is used, the related stats are increased.

# Design: *Explorer* class ship

> It was an Explorer class ship. Explorer ships were designed to easily enter dense atmospheres and thus had an extremely aerodynamic design and small, retractile wings.

> At that moment, she saw a small ship approaching through the transparent polymer. It was an Explorer ship. It was the first time she saw a ship that close. It was beautiful. Small holes all over the fuselage made it extremely maneuverable and in the back she could see a deep and a black pit. That was the output of the Flow Reactor used by the ship.

So, this ship will have:

* flow reactor output;
* retractile wings;
* gas escapes;
* aerodynamic design.

It is a small ship, but how small? Lets say 25 meters in length.

```

    |\
     |\
 -----------\
>!!|%[%|%[%|[\-------
>##|%.%|%.%|+...|..%=)
>##--+---+--....+..%=)
>!!........../-------
 -----------/
     |/
    |/


```

## Tiles

* `!`: fuel cell
* `#`: flow reactor
* `>`: reactor output
* `%`: bed/confortable chair
* `[`: cabinet
* `.`: floor
* `-`, `|`, `\`, `/`: polymer panel
* `+`: doors
* `=`: console
* `)`: transparent polymer/window

People use it for exploration, so it has to have bathroons and beds. Probably a kitchen?

Maybe have multiple Z-levels?
