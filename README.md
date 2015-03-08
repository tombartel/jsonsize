# jsonsize
Command line utility that displays the approximate space requirements of a JSON representation of JavaScript
data, summarized at arbitrary depth levels (default 1).

## Installation

```
$ npm install -g jsonsize
```

## Usage
This example queries the [reddit API](https://github.com/reddit/reddit/wiki/JSON), and passes the JSON response to
jsonsize:
```
$ curl -s http://www.reddit.com/r/pics.json | jsonsize
{
    "kind": "string: 9 B",
    "data": "object: 27.8 KB",
    "TOTAL": "27.8 KB"
}
```
We can see that the total size is around 27.8 KB. There are 2 top-level entries, "kind" and "data". The "kind" value
takes up 9 Bytes, while the "data" value takes up almost all the space.

### Varying the summary depth
You can play with the _-d_ (also _--depth_) parameter to get size summaries on various depth levels:
```
$ curl -s http://www.reddit.com/r/pics.json | jsonsize -d 2
{
    "kind": "string: 9 B",
    "data": {
        "modhash": "string: 2 B",
        "children": "object: 27.9 KB",
        "after": "string: 11 B",
        "before": "object: 4 B",
        "TOTAL": "28 KB"
    },
    "TOTAL": "28 KB"
}
```
This shows us the next level of entries below "data". Let's look at `d 3`, which gives us some more insight into
the "children" array:
```
$ curl -s http://www.reddit.com/r/pics.json | jsonsize -d 2
{
    "kind": "string: 9 B",
    "data": {
        "modhash": "string: 2 B",
        "children": [
            "object: 986 B",
            "object: 1.02 KB",
            "object: 1.07 KB",
            "object: 1.04 KB",
            "object: 1.19 KB",
            "object: 1.13 KB",
            "object: 1.05 KB",
            "object: 1.1 KB",
            "object: 1.1 KB",
            "object: 903 B",
            "object: 1.02 KB",
            "object: 1.05 KB",
            "object: 1.14 KB",
            "object: 1.04 KB",
            "object: 1.04 KB",
            "object: 1.03 KB",
            "object: 1.12 KB",
            "object: 2.29 KB",
            "object: 1.17 KB",
            "object: 1.03 KB",
            "object: 1.2 KB",
            "object: 1.03 KB",
            "object: 963 B",
            "object: 1.05 KB",
            "object: 1.06 KB",
            "TOTAL: 27.9 KB"
        ],
        "after": "string: 11 B",
        "before": {
            "TOTAL": "2 B"
        },
        "TOTAL": "27.9 KB"
    },
    "TOTAL": "27.9 KB"
}
```


