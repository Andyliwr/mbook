# 一个简单的queue和线程结合的小程序
# -*- coding:utf-8 -*-
import threading
import time
import queue

# 构造一个不限制大小的队列
SHARE_Q = queue.Queue()
_WORKER_THREAD_NUM = 3 # 设置线程个数

class MyThread(threading.Thread):
    def __init__(self, func):
        super(MyThread, self).__init__()
        self.func = func
    def run(self):
        self.func()

def worker():
    global SHARE_Q
    while not SHARE_Q.empty():
        # 获得任务
        item = SHARE_Q.get()
        print("Processing: " + str(item))
        time.sleep(1)

def main():
    global SHARE_Q
    threads = []
    for task in range(5):
        SHARE_Q.put(task)

    for i in range(_WORKER_THREAD_NUM):
        thread = MyThread(worker)
        thread.start()
        threads.append(thread)

    for thread in threads:
        thread.join()

if __name__ == "__main__":
    main()
