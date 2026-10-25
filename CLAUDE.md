# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Andrei Solntsev's personal blog, a Jekyll site published via GitHub Pages (`github-pages` gem, so only GitHub Pages–whitelisted plugins work: `jekyll-redirect-from`, `jekyll-sitemap`, `jekyll-feed`). There is no build/test/lint pipeline; pushing to the repo deploys the site.

## Running locally

```sh
./start.sh   # rvm use 2.7.8 && bundle exec jekyll serve --port=4003 --incremental --open-url
```

Requires Ruby 2.7.8 (via rvm) and `bundle install`. Output goes to `_site/` (gitignored).

## Bilingual structure (en / ru)

The site is split into two languages, and the language is carried by the `category` front-matter field — not by a plugin:

- Posts live in `_posts/en/` and `_posts/ru/`, each with `category: en` or `category: ru`. The permalink is `/:categories/:year/:month/:day/:title/`, so a translated post must use the **same filename** in both folders to get matching URLs (`/en/...` vs `/ru/...`).
- Russian is the primary language; not every post has an English version. The ENG/RUS switcher in `_includes/sidebar.html` swaps the `/en|/ru` URL prefix and, on 404, offers Google Translate instead.
- `en/index.html` and `ru/index.html` list posts filtered by `category`. Use `<!--more-->` in a post to mark the excerpt shown there.
- Sidebar navigation is generated automatically from pages with `layout: page` and the matching `category` (`en/*.md`, `ru/*.md`: about, video, publications, open-source). Adding such a page adds a nav link.

## Common edits

- New talks/TV appearances are added to `ru/video.md` and, for English-language talks, also to `en/video.md`, under the year heading, newest first, format: `* [Title](url) Event, City, DD.MM.YYYY`. Russian TV (ETV+ "Кофе+") items go only into `ru/video.md`.
- Post front matter: `layout: post`, `category: en|ru`, `title: ...`.
