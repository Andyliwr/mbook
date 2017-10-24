# 客户端代码
# -* coding:utf-8 -*-
import sys
import socket

BUF_SIZE = 1024  # 设置缓冲区大小
server_addr = ('127.0.0.1', 8888)  # 设置地址和端口
try:
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)  # 返回新的socket对象
except (socket.error):
    print("Creating Socket Failure.")
    sys.exit()
client.connect(server_addr)  # 连接服务器
while True:
    data = input("Please input some string > ")
    if not data:
        print("input can't empty, Please input again..")
        continue
    client.sendall(data.encode())  # 发送数据到服务器端
    data = client.recv(BUF_SIZE).decode()  # 从服务器端接收数据
    print(data)
client.close()
