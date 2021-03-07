# Flask and create-react-app

## Requirements
1. `npm install`
2. `pip install -r requirements.txt`
3. `pip install flask-socketio`
4. `pip install flask-cors`
5. `cd` into react-starter directory. Run `npm install socket.io-client --save`
6. `sudo yum install postgresql postgresql-server postgresql-devel postgresql-contrib postgresql-docs`
7. `pip install psycopg2-binary`
8. `pip install Flask-SQLAlchemy==2.1`


## Setup
1. Run `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local` in the project directory

## Run Application
1. Run command in terminal (in your project directory): `python app.py`
2. Run command in another terminal, `cd` into the project directory, and run `npm run start`
3. Preview web page in browser '/'
4. Preview this same app in 2 separate browser tabs (Player X and Player O; Optional spectator in a third browser)

## Databases Setup
1. Install PostGreSQL: `sudo yum install postgresql postgresql-server postgresql-devel postgresql-contrib postgresql-docs` Enter yes to all prompts.
2. Initialize PSQL database: `sudo service postgresql initdb`
3. Start PSQL: `sudo service postgresql start`
4. Make a new superuser: `sudo -u postgres createuser --superuser $USER` If you get an error saying "could not change directory", that's okay! It worked!
5. Make a new database: `sudo -u postgres createdb $USER` If you get an error saying "could not change directory", that's okay! It worked!
6. Make sure your user shows up:
    1. `psql`
    2. `\du`look for ec2-user as a user 
    3. `\l` look for ec2-user as a database
7. Make a new user:
    1. `psql` (if you already quit out of psql)
    2. Type this with your username and password (DONT JUST COPY PASTE): `create user some_username_here superuser password 'some_unique_new_password_here';`` e.g.
    `create user ivana superuser password 'mysecretpassword123';`
    3. `\q` to quit out of sql
8. Save your username and password in a sql.env file with the format `SQL_USER=` and `SQL_PASSWORD=`
9. To use SQL in Python: `pip install psycopg2-binary`
10. `pip install Flask-SQLAlchemy==2.1`


## Deploy to Heroku
1. Create a Heroku app: `heroku create --buildpack heroku/python`
2. Add nodejs buildpack: `heroku buildpacks:add --index 1 heroku/nodejs`
3. Login and fill creds: `heroku login -i`
4. Create a new Heroku app: `heroku create`
5. Create a new remote DB on your Heroku app: `heroku addons:create heroku-postgresql:hobby-dev`
(If that doesn't work, add a `-a {your-app-name}`` to the end of the command, no braces)
6. See the config vars set by Heroku for you: `heroku config`. Copy paste the value for DATABASE_URL
7. Set the value of `DATABASE_URL` as an environment variable by entering this in the terminal: `export DATABASE_URL='copy-paste-value-in-here'`
8. Also create a .env file and inside it add: `DATABASE_URL='copy-paste-value-in-here'`
8. Push to Heroku: `git push heroku main`

## Questions

### Milestone 1
1. Additional features I might implement are to allow a user to play with a computer instead of another user and
to have an option for easy, medium, or hard level. To do this, I think I would need to have a randomized option
where the computer can apply a change on the board. This would be according to some artificial intelligence logic to 
determine easy, medium, hard moves.
2. A technical issue included uniquely identifying the client/browser with a respective player X and O.
I solved this by joining the Zoom call provided on Slack with a couple of classmates. They helped me add
a user state, which assigned the client to a role (player X, O, or spectator) when they logged in. 
Another issue was that the log in button could have been clicked multiple times even when a user was
already logged in. This interfered with the game board hiding/showing. I fixed this by adding the line
`document.getElementById("logBtn").disabled = true;` This disabled the button to be clicked more than once.
I found this approach by googling "button click only once javascript", which brought me to [this](https://code-boxx.com/allow-one-click-javascript/) 
link.

### Milestone 2
1. Additional features I would implement are a more interactice leadership board, such as button inside the board to sort names in alphabetical
order and to sort scores in both ascending and descending order. I would do this by having the button be linked to the server with an event. Inside the server,
the sorting would be performed and sent to the client in which the new state of the board will be updated. Another feature is to have the username and score
disappear from the board when a user has disconnected. This would be done inside the server, where it will listen for a disconnect and temporarily remove the 
name from the board.
2. Detailed description of 2+ technical issues and how you solved it (your process, what you searched, what resources you used)
A technical issue I had was to update the score in the board when a user lost or won. I was emitting the socket inside the component, which would re-emit 
the event too many times. I fixed this by adding a button to be pressed and working only when there is a win and emitting that inside the onClick function. 
Another issue I had was my model created for the table schema was not being read by my server. I fixed this by reading the slack suggestions and adding 
`db.create_all()` inside `if __name__ == "__main__":`


## Resources
1. https://scrimba.com/learn/reactgame/introduction-cPkGD8Sm
2. https://code-boxx.com/allow-one-click-javascript/
3. https://www.sitepoint.com/community/t/place-2-divs-alongside-eachother-using-50-width/237385/3
4. Lecture Notes
