from flask import Flask, render_template, Response
from server import streamer

print("flask one")
app = Flask(__name__)
print("flask two")

def gen():
  while True:
      stream = streamer()
      yield (b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + stream + b'\r\n\r\n')

@app.route('/')
def index():
  return render_template('index.html')

@app.route('/camera')
def camera():
  return Response(gen(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
  print("flask three")
  app.run(debug=True)