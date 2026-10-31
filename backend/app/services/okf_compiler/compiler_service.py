import os
import time
import logging
from typing import List, Dict, Any
from pathlib import Path

from app.models.ingest_models import IngestResponse, IngestFileItem
from app.services.okf_compiler.parser import read_file_to_markdown, split_markdown
from app.services.okf_compiler.metadata_extractor import extract_metadata
from app.services.okf_compiler.linker import cross_link_concepts
from app.services.okf_compiler.indexer import write_okf_bundle
from app.services.okf_compiler.manifest import calculate_file_hash, load_manifest, save_manifest

logger = logging.getLogger(__name__)


class OKFCompilerService:
    """Orchestrates compiling raw documents into a structured OKF knowledge bundle."""

    def __init__(self, output_dir: str):
        self.output_dir = output_dir

    def compile_files(self, filepaths: List[str]) -> IngestResponse:
        start_time = time.time()
        manifest = load_manifest(self.output_dir)
        file_items: List[IngestFileItem] = []
        all_concepts: Dict[str, Dict[str, Any]] = {}
        errors: List[str] = []

        total_files = len(filepaths)
        logger.info("Starting OKF compilation for %d file(s)", total_files)

        concept_idx = 0
        for fp in filepaths:
            path = Path(fp)
            filename = path.name

            if not path.exists():
                err = f"File not found: {fp}"
                errors.append(err)
                file_items.append(IngestFileItem(filename=filename, status="failed", error_message=err))
                continue

            try:
                current_hash = calculate_file_hash(fp)
                if filename in manifest and manifest[filename].get("hash") == current_hash:
                    logger.info("Skipping cached file: %s", filename)
                    file_items.append(IngestFileItem(filename=filename, status="cached", concepts_count=0))
                    continue

                raw_md = read_file_to_markdown(fp)
                chunks = split_markdown(raw_md, split_level="##")

                file_concepts_count = 0
                for chunk in chunks:
                    header = chunk["header"]
                    body = chunk["content"]
                    meta, cleaned_body = extract_metadata(body, header, concept_idx)

                    concept_id = f"{meta['type']}_{meta['filename']}"
                    all_concepts[concept_id] = {
                        "metadata": meta,
                        "content": cleaned_body,
                        "source_file": filename
                    }
                    concept_idx += 1
                    file_concepts_count += 1

                manifest[filename] = {
                    "hash": current_hash,
                    "compiled_at": time.time(),
                    "concepts_count": file_concepts_count
                }

                file_items.append(IngestFileItem(
                    filename=filename,
                    status="compiled",
                    concepts_count=file_concepts_count
                ))

            except Exception as e:
                err_msg = f"Failed to compile {filename}: {str(e)}"
                logger.error(err_msg, exc_info=True)
                errors.append(err_msg)
                file_items.append(IngestFileItem(filename=filename, status="failed", error_message=err_msg))

        # Cross link and write if we have concepts
        links_generated = 0
        if all_concepts:
            logger.info("Cross-linking %d concepts...", len(all_concepts))
            linked_contents = cross_link_concepts(all_concepts)
            write_okf_bundle(self.output_dir, all_concepts, linked_contents)
            save_manifest(self.output_dir, manifest)
            links_generated = sum(content.count("](") for content in linked_contents.values())

        elapsed = round(time.time() - start_time, 2)
        return IngestResponse(
            status="completed" if not errors else "completed_with_errors",
            files_processed=total_files,
            concepts_created=len(all_concepts),
            links_generated=links_generated,
            time_taken_seconds=elapsed,
            output_directory=self.output_dir,
            file_details=file_items,
            errors=errors
        )
