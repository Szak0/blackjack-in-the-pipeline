from flask import Flask, render_template, request, redirect, jsonify
from random import sample


app = Flask(__name__)


@app.route('/hello', methods=['GET', 'POST'])
def hello():
    if request.method == 'POST':
        print('Incoming..')
        print(request.get_json())  # parse as JSON
        return 'OK', 200
    else:
        message = {'greeting':'Hello from Flask!'}
        return jsonify(message)  # serialize and use JSON headers


@app.route('/test')
def test_page():
    return render_template('index.html')


@app.route('/start')
def start_page():
    return render_template('start.html')


@app.route('/')
def main():
    return render_template('index.html')


if __name__ == '__main__':

    app.run(
        host='0.0.0.0',
        port=6402,
        debug=True,
    )