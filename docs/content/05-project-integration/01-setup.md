# 1. Download the Starter

Create a `docs/` folder inside your project and fetch the Archivox starter with `wget`:

```bash
mkdir docs && cd docs
wget -O archivox.tar.gz https://codeload.github.com/PR0M3TH3AN/Archivox/tar.gz/refs/heads/main
# extract just the starter directory
mkdir tmp && tar -xzf archivox.tar.gz -C tmp
mv tmp/Archivox-main/starter/* .
rm -rf archivox.tar.gz tmp
```

Install the dependencies locally:

```bash
npm install
```
