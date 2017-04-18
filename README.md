# Goldsprints

An attempt to build an application for [Goldsprint competition](https://en.wikipedia.org/wiki/Goldsprint) with Arduino, Python and React.

![goldsprints](https://cloud.githubusercontent.com/assets/5421321/24585852/423c5fec-1794-11e7-9653-43f4c8cdb2df.png)

## How it works
1. We use Arduino with two Hall sensors to measure the speed of the bike rollers.
2. Measurements are sent to a Python script that parses them and sends them through WebSocket to the browser.
3. We use Django as a backend for storing data about races and players.
4. Dynamic pages that display speed and distances of players during a race are rendered in React.

## Installation
The application was developed and tested with: Ubuntu 15.10, Python 3.5.3 and Node.js 6.3.0.

1. Build the static assets: `npm install` & `npm run build`
2. Install Python dependencies: `pip install -r requirements.txt`
3. Prepare the database: `python manage.py migrate`
4. Start the application server: `python manage.py runserver 8000`
5. Start the data receiver: `python ws_server [PORT]` - PORT is the USB port that receives data from Arduino, e.g. `/dev/ttyACM0` on Ubuntu
6. Go to `http://localhost:8000` in your browser to access the application

## Available modes
- Event - a group of races - allows to create and perform a sequence of races by entering pairs of players
- Quick race - a quick race between two players
- Free ride - it just reads speed and distance from sensors and display them on screen, without time mesaurment and racing

## Disclaimer
It is purely a DIY hobby project made by @elwoodxblues and @ssaleta. We build it for Polish Cycle Messenger Championships which took place in Wrocław in 2016 ([link](http://pcmc2016.pl/)). It's not perfect, it's not always doing the measurments 100% correctly, but it's good enough that it worked for us at three goldsprints events. If you'd like to use it and need any help - feel free to contact us.
