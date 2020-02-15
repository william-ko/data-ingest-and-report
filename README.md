# **_<p align=center>Data Ingest and Analysis</p>_**

_<p align=center>a command-line application to ingest monthly reports, generate sales summaries by category and output consolidated reports.</p>_

---

### Usage

_Note: this tool only ingests .xlsx and .txt files._

#### Ingest

To ingest a report, simply run the following command in the root directory:

- `npm run ingest <filename>`

This will parse and load the file into the applications fs for later use. If the file already exists in the system, the old one will be deleted (dupe check is done using the filenames). If there is an issue during ingestion, changes will be rolled back and the program will exit.

#### Summary

To generate a summary of a given category for the given year and month:

- `npm run summary <category name> <year> <month>`

This will print a summary from the ingested reports for the given arguments:

- `Produce - Total Units: 143567, Total Gross Sales: 1623060.51`


#### Generate Report

To generate a consolidated CSV file by either passing in an existing xlsx or from ingested data:

- `npm run generate_report <filename>`

This will write a consolidated CSV file to the root directory of the fs. 

note: `<filename>` can either be an excel file (`foo.xlsx`) or an arbitray file name of the users choosing, which will use the ingested data to generate the CSV and name it by the argument.

#### Exit

Since this application does not rely on a server, it's state is reset with every command. The only pieces that remain are the ingested files. 

So, to clear the current state (reset the file-system):

- `npm run exit`

This will delete all files ingested or created during use.

#### Testing

The integration tests in this project are somewhat rudimentary for now, but are robust enough to guide further development and solidify core functionality. An HTML test-report is automatically generated when tests are ran, it can be found in `test-reports`. To test, run:

- `npm run test`

The exit function is not tested nor is it used to tear down the tests. So to clear the app of any unwanted data after testing, manually run the `exit` command. Tear-down functionality is currently being worked on.

------------

##### A Concise Overview of the Functionality...

The access point of the program reads the command-line arguments and decides what block to execute, contigent upon such. These blocks use a host of helpers to perform the given task. Each task's core functionality is encapsulted in a well documented class.

Some utility functions are used in each task. Making validations, handling errors and file deletion (used in rollback stradegy).
