Steps for installation
1) Click on code button can download the zip file or use git clone the respository.
2) Since node_modules will not be present in the downloaded folder, install the necessary packages by entering npm install in both api as well as client folder of the terminal.
3) Create a .env file in the api folder and create two variables MONGO_URL and SECRET_KEY.
4) MONGO_URL from atlas mongo db create new project and connect using application.
5) A mongoose connection string will be provided. Replace the location having <password> with the password entered during creation of the project in atlas.
6) Run api and client on two different terminals.


Since data is not shared my database when you open your own atlas project the website will not contain any blogs. So I have entered my username and password for the project as comments in the index.js file of the  api folder.
