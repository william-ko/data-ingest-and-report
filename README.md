# **_<p align=center>IPD Data Ingester and Analyzer</p>_**

_<p align=center>a command line application to ingest monthly reports, generate sales summaries by category and output consolidated reports.</p>_

---

### Usage

_Note: this tool only ingests .xlsx and .txt files._

To ingest a report, simply run the following command in the root directory:

- `npm run ingest <filename>`

This will parse and load the file into the applications file-system for later use. If the file already exists in the system, the old one will be deleted (dupe check is done using the filenames). If there is an issue during ingestion, changes will be rolled back and the program will exit.

To generate a summary of a given category for the given year and month:

- `npm run summary <category name> <year> <month>`

This will print a summary from the ingested reports for the given arguments.
