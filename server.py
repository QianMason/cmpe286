import cv2
import zmq
import base64
import numpy as np



# context = zmq.Context()

# footage_socket = context.socket(zmq.SUB)
# #footage_socket.connect('tcp://192.168.1.62:7000')
# print("binding")
# footage_socket.bind('tcp://192.168.1.68:7000')

# footage_socket.setsockopt_string(zmq.SUBSCRIBE, np.compat.unicode())

def streamer():
    context = zmq.Context()

    footage_socket = context.socket(zmq.SUB)
    #footage_socket.connect('tcp://192.168.1.62:7000')
    print("binding")
    footage_socket.bind('tcp://192.168.1.68:7000')
    footage_socket.setsockopt_string(zmq.SUBSCRIBE, np.compat.unicode())

    while True:
        frame = footage_socket.recv_string()
        #print("two")
        print("frame = " , type(frame))
        img = base64.b64decode(frame)
        #print("three")
        npimg = np.frombuffer(img, dtype=np.uint8)
        #print("four")
        source = cv2.imdecode(npimg, 1)
        #print("five")
        #print(type(source))
        cv2.imshow("Stream", source)
        cv2.waitKey(1)
        returned = cv2.imencode('.jpg', source)[1].tobytes()
        return returned

# streamer()
# print("closing connection")
# footage_socket.unbind('tcp://192.168.1.68:7000')
    #context.close()
    # footage_socket.close()

