from flask import Flask, render_template, request
from flask_socketio import SocketIO, send, emit, join_room, leave_room
from json import loads


app = Flask(__name__)
app.config['SECRET_KEY'] = 'hello_world'
socketio = SocketIO(app)


waiting_rooms = []
sid_to_room = {}
room_members = {}


def get_new_room_name():
    name = 0
    while True:
        name += 1
        yield str(name)


@app.route('/')
def index():
    return render_template('index.html')


@socketio.on('connect')
def connect():

    if waiting_rooms:

        room_name = waiting_rooms[0]
        room_members[room_name]['o'] = request.sid
        del waiting_rooms[0]
        sid_to_room[request.sid] = room_name

        join_room(room_name)
        send('o', to=request.sid)
        send('start', to=room_name)

    else:

        room_name = get_new_room_name()
        waiting_rooms.append(room_name)
        room_members[room_name] = {'x': request.sid}
        sid_to_room[request.sid] = room_name

        join_room(room_name)
        send('x', to=request.sid)


@socketio.on('disconnect')
def disconnect():
    leave_room(sid_to_room[request.sid])
    del sid_to_room[request.sid]


@socketio.on('message')
def handle_message(message):
    message = loads(message)
    recepient = message['recepient']
    room_name = sid_to_room[request.sid]
    tileID = message['tileID']

    send(tileID, to=room_members[room_name][recepient])


if __name__ == '__main__':
    socketio.run(app, debug=True)