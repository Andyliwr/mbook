# 简单锁
# -*- coding:utf-8 -*-

import threading
import time

class MyThread(threading.Thread):
    def __init__(self, thread_id, name, counter):
        threading.Thread.__init__(self)
        self.thread_id = thread_id
        self.name = name
        self.counter = counter

    def run(self):
        # 重写run方法，添加线程执行逻辑
        print("Starting " + self.name)
        threadLock.acquire() # 获取锁
        print_time(self.name, 3, self.counter)
        threadLock.release() # 释放锁

def print_time(thread_name, delay, counter):
        while counter:
            time.sleep(delay)
            print("%s %s" % (thread_name, time.ctime(time.time())))
            counter -= 1

threadLock = threading.Lock()
threads = []

thread1 = MyThread(1, "Thread_1", 1)
thread2 = MyThread(2, "Thread_2", 2)

# 开启线程
thread1.start()
thread2.start()
thread1.join()
thread2.join()

print("Exiting Main Thread")
