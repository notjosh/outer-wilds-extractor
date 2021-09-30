# outer-wilds-extractor

## About

Extracts the facts/rumours from Outer Wilds game files, and transforms into JSON for easy consumption.

## Prerequisites

- install [AssetStudio](https://github.com/Perfare/AssetStudio)
- ensure it's a build with [XML export](https://github.com/Perfare/AssetStudio/pull/710)

## Requirements

- export all `Sprite`s from AssetStudio
- export all `MonoBehaviour`s from AssetStudio
- export all `TextAsset`s from AssetStudio
- export `assets.xml` of all files from AssetStudio

## Running

Run script with args:

```sh
./bin/run -i /path/to/owdump/ -o out/
```

Then after, you should get something like:

```sh
$ ls -al out
total 288
-rw-r--r--   1 joshua  staff    74K 22 Mar 15:25 entries.json
-rw-r--r--   1 joshua  staff   9.5K 22 Mar 15:25 library.json
drwxr-xr-x  66 joshua  staff   2.1K 22 Mar 15:21 sprites
-rw-r--r--   1 joshua  staff   1.2K 22 Mar 15:25 theme.json
```

## Problems

For some reason (and it's probably because I don't know Unity) there are multiple of similar files (i.e. `UIStyleManager.json`, `UIStyleManager #12345.json`, etc), where the latter files are usually more recent. You may need to manually fiddle with it to find the right one.
