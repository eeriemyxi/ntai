# Ntai

Ntai is the successor to [Firush](https://github.com/eeriemyxi/firush) that uses
the new [nHentai API](https://nhentai.net/api/v2/docs) instead.

Firush was a tool to find _random_ manga/doujinshi/comics from [nHentai](https://nhentai.net) based on
search queries.

Firush behind the scenes was doing the following:

- Search the query
- Scrape the total page count _k_
- Pick a random number between 1 and _k_
- Scrape and return a random entry from that page.

However, nHentai has now made scraping the site unreliable; thus, Ntai instead
depends on the API for the page count and book information.

# Screenshots

## Web Client

![](assets/demo-i.png)
![](assets/demo-ii.png)

<details>
  <summary>Click to expand additional screenshots</summary>

![](assets/demo-iii.png)
![](assets/demo-iv.png)

</details>

# Installation

> [!NOTE]
> This package exports binaries `ntai` and `myxi-ntai` which are available
> after installation.

## From PyPi

You can install the PyPi package:

```
pip install myxi-ntai
```

> [!TIP]
> You can also use [`uv`](https://docs.astral.sh/uv/getting-started/installation/) like so:
>
> ```
> uv tool install myxi-ntai
> ```

## From Source

> [!IMPORTANT]
> Installation of [Git](https://git-scm.com/) is required.

```
pip install git+https://github.com/eeriemyxi/myxi-ntai.git
```

# How To Use

There are two clients, web and TUI.

To use the web version, simply do:

```
ntai web
```

Or the TUI version:

> [!IMPORTANT]
> The TUI version is yet to be implemented.

```
ntai tui
```

You could also check out `ntai [tui,web] --help` :)

# Command-line Arguments

```
Usage: ntai [OPTIONS] COMMAND [ARGS]...

Options:
  -L, --log-level [TRACE|DEBUG|INFO|SUCCESS|WARNING|CRITICAL|ERROR]
  -v, -V, --version               Show the version and exit.
  --help                          Show this message and exit.

Commands:
  tui
  web
```
