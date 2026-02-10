PROPOSAL  := 02_Work/Propuesta_Master.html
OUT_DIR   := 03_Outputs
DOCX_OUT  := $(OUT_DIR)/Propuesta_Master.docx
PDF_OUT   := $(OUT_DIR)/Propuesta_Master.pdf

.PHONY: help docx pdf all clean check-pandoc check-wkhtmltopdf

help: ## List available targets
	@echo ""
	@echo "ProductLM — Deliverable Pipeline"
	@echo "================================="
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  make %-12s %s\n", $$1, $$2}'
	@echo ""

check-pandoc:
	@command -v pandoc >/dev/null 2>&1 || { \
		echo "Error: pandoc is not installed."; \
		echo "See docs/PANDOC_SETUP.md for installation instructions."; \
		exit 1; \
	}

check-wkhtmltopdf:
	@command -v wkhtmltopdf >/dev/null 2>&1 || { \
		echo "Error: wkhtmltopdf is not installed."; \
		echo "See docs/PANDOC_SETUP.md for installation instructions."; \
		exit 1; \
	}

docx: check-pandoc ## Generate DOCX from proposal
	@mkdir -p $(OUT_DIR)
	pandoc $(PROPOSAL) -o $(DOCX_OUT)
	@echo "Generated $(DOCX_OUT)"

pdf: check-wkhtmltopdf ## Generate PDF from proposal
	@mkdir -p $(OUT_DIR)
	wkhtmltopdf --enable-local-file-access $(PROPOSAL) $(PDF_OUT)
	@echo "Generated $(PDF_OUT)"

all: docx pdf ## Generate all deliverables

clean: ## Remove generated deliverables
	rm -f $(OUT_DIR)/*.docx $(OUT_DIR)/*.pdf
	@echo "Cleaned generated files."
