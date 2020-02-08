# ***<p align=center>IPD Data Ingester and Analyzer</p>***
 
 _<p align=center>a command line application to ingest monthly reports, generate sales summaries by category and output consolidated reports.</p>_

 -------------

### Usage

_Note: this tool only ingests .xlsx and .txt files._

To ingest a report, simply run the following command in your root directory.

+ ```node src/index.js --ingest <filename>```

This will parse and load the file into the applications file-system for later use. If there are already files in the system, they will be deleted upon a new ingestion, and if any issues during ingestion, any changes will be rolled back and the program will exit.
