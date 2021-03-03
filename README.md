# Flask and create-react-app

## Requirements
1. `npm install`
2. `pip install -r requirements.txt`
3. `pip install flask-socketio`
4. `pip install flask-cors`
5. `cd` into react-starter directory. Run `npm install socket.io-client --save`


## Setup
1. Run `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local` in the project directory

## Run Application
1. Run command in terminal (in your project directory): `python app.py`
2. Run command in another terminal, `cd` into the project directory, and run `npm run start`
3. Preview web page in browser '/'
4. Preview this same app in 2 separate browser tabs (Player X and Player O; Optional spectator in a third browser)


## Deploy to Heroku
1. Create a Heroku app: `heroku create --buildpack heroku/python`
2. Add nodejs buildpack: `heroku buildpacks:add --index 1 heroku/nodejs`
3. Push to Heroku: `git push heroku main`

## Questions
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
I found this approach by googling "button click only once javascript", which brough me to [this](https://code-boxx.com/allow-one-click-javascript/) 
link.

## Resources
1. https://scrimba.com/learn/reactgame/introduction-cPkGD8Sm
2. https://code-boxx.com/allow-one-click-javascript/
3. https://www.sitepoint.com/community/t/place-2-divs-alongside-eachother-using-50-width/237385/3
4. Lecture Notes
