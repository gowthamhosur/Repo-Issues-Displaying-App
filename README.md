Working demo of the application: http://shippable.azurewebsites.net


This application, implemented using NodeJS, accepts a github URL for a repository and displays the following data:

  1. Total number of open issues
  2. Number of open issues that were opened in the last 24 hours
  3. Number of open issues that were opened more than 24 hours ago but less than 7 days ago
  4. Number of open issues that were opened more than 7 days ago

 Github Url input must be in following format: https://github.com/{{username}}/{{repository-name}}

 This application extracts data from Github API (api.github.com) for a particular repository and classifies data according to dates.

 'app.js' file has the server back-end code, index.html has the front-end script and markup.

 Scope of improvement:

  1. Web sockets can be used to get realtime issues data from the back-end, and hence updating application without user refreshing the page

  2. Extracted data can be saved in MongoDB to get the archive data of issues for a repository
