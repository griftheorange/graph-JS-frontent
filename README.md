# Graph-JS Frontend README

The purpose of this project was to experiment with and learn the D3.js library by using it to mimic Google Sheets/Microsoft Excel's graphing functions.

The goal was to create a one-page website in Javascript onto which you could upload CSV files, parse them into tables, then generate graphs from the tables. The CSV files would be persisted to an external server and the access URL saved to the backend. Users would then be able to access all uploaded datasets and create graphs by specifying columns for axes and data series.

The result is simple enough, but was great practice for learning D3's features for the first time. Users can perform all of the above and generate three classic charts. Bar, Line, and Pie Charts.

## Settup

Unfortunately, this repo does not support local cloning and settup at this time. It may eventually be deployed via Heroku, github io or some other medium, but in the meantime please feel free to watch the following for an example demonstration. We are sorry for the inconvenience.

<a href="http://www.youtube.com/watch?feature=player_embedded&v=ua4csPpWLk8
" target="_blank"><img src="http://img.youtube.com/vi/ua4csPpWLk8/0.jpg" 
alt="IMAGE ALT TEXT HERE" width="240" height="180" border="10" /></a>

## Layout

The repo consists of seven main files:

- index.html : loads in the relevant dependencies, scripts and stylesheets
- index.css : styles the application
- login.js : renders the login page and handles user authentication/creation
- main.js : renders the main page with file upload button, list of datasets already saved by this user. Also handles saving/deletion of Datasets and table generation
- dataset.js : renders the selected dataset's table, a list of all graphs attributed to this dataset, and renders a dropdown form that allows user to create new graphs. Handles creation/deletion of graphs
- graphGenerator.js : handles the meat of the application's features. Digests datasets down into the selected data, formatting the output differently based on the requirements of each chart type. renders the charts in svg components with elements shaped, colored and positioned using D3.js
- fetch.js : Also known as an adaptor, handles all of the fetches for the application in one file