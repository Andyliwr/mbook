# 服务器端
# -*- coding:utf-8 *-
import socket # socket模块
import sys

BUF_SIZE = 1024 # 设置缓冲区大小
server_addr = ('127.0.0.1', 8888) # IP和端口构成表示地址
try:
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM) # 生成一个新的socket对象
except (socket.error):
    print("Creating Socket Failure")
    sys.exit()
server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1) # 设置地址复用
try:
    server.bind(server_addr) # 绑定地址
except (socket.error):
    print("Binding Failure.")
    sys.exit()
print("Socket Bind!")
server.listen(5) # 监听，最大监听数为5
while True:
    client, client_addr = server.accept() # 接受TCP链接，并返回新的套接字和地址
    print("Conneted by", client_addr)
    while True:
        data = client.recv(BUF_SIZE).decode() # 从客户端接收数据
        print("接收到客户端返回的字段: "+data)
        client.sendall(("服务器端返回字段: "+ data).encode()) # 发送数据到客户端
server.close()

