# Pandoc Setup Guide

This project uses [Pandoc](https://pandoc.org/) to convert HTML proposals into DOCX and PDF formats.

## Installation

### macOS

```bash
brew install pandoc
```

For PDF generation via `wkhtmltopdf`:

```bash
brew install --cask wkhtmltopdf
```

### Ubuntu / Debian

```bash
sudo apt-get install pandoc wkhtmltopdf
```

### Windows

Download installers from:

- Pandoc: https://pandoc.org/installing.html
- wkhtmltopdf: https://wkhtmltopdf.org/downloads.html

## Verify Installation

```bash
pandoc --version
wkhtmltopdf --version
```

## Usage

From the project root:

```bash
make help    # List available targets
make docx    # Generate DOCX from proposal
make pdf     # Generate PDF from proposal
make all     # Generate all formats
make clean   # Remove generated files
```

## Custom Reference Document (Optional)

To apply custom branding to DOCX output, create a reference document:

```bash
pandoc -o reference.docx --print-default-data-file reference.docx
```

Then edit `reference.docx` in Word/LibreOffice to set your preferred styles (fonts, colors, heading formats). Place it in the project root and update the Makefile:

```makefile
DOCX_FLAGS = --reference-doc=reference.docx
```

## Troubleshooting

- **`wkhtmltopdf` not found:** Ensure it's in your `$PATH`. On macOS, you may need to restart your terminal after installation.
- **PDF renders without styles:** `wkhtmltopdf` reads the HTML file directly, so all CSS must be inline or embedded (not external). The template HTML files already embed all styles.
- **DOCX formatting looks off:** Generate a custom `reference.docx` (see above) to control Word styles.
