## Manulife Demo

Steps to run the application in Windows or Mac.

- `npm run update` in the root folder to install all dependencies.
- `npm run start` to run the server and the front end.

## Method for hosting on Heroku
- From the frontend folder, run `npm run build` and copy the build folder into the deployment folder of your choice (I used production).
- Copy the server folder directly into the deployment folder.
- Initialize heroku app and set it as a remote for pushing.
- Run `npm run deploy-heroku` to push the production folder to the heroku remote.
- Go to `http://<app_name>.herokuapp.com`.

## To view on Heroku
- Go to `http://jpl-manulife-demo.herokuapp.com`.

## List of Improvements
- Column sorting.
- Cell/row/column dividers similar to google sheets to make it more apparent where each column ends.
- Filtering should allow begins with, contains or exact.
- Line graph showing overall trend of the different currencies (x-axis: date, y-axis: value)
- A graph tab for each currency.
- Host it on Heroku or Azure (It should be on heroku).
- Evaluate for sql injection.
- Resolve CORS issue. Some default to https, therefore openrates api call should be https as well.
- Additionally, https requires CORS.