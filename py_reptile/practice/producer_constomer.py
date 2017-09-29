# 生产者消费者问题
#-*- coding:utf-8 -*-
import threading
import random
import time
import queue

MAX_SIZE = 5
SHARE_Q = [] # 模拟共享队列
CONDITION = threading.Condition()

class Producer(threading.Thread):
    def run(self):
        products = list(range(5))
        # 如果你想要为一个定义在函数外的变量赋值，那么你就得使用global语句告诉Python这个变量名不是局部的，而是全局的
        global SHARE_Q
        while True:
            print(SHARE_Q)
            CONDITION.acquire()
            if len(SHARE_Q) == 5:
                print("Queue is full...")
                # wait方法释放内部所占用的琐，同时线程被挂起，直至接收到通知被唤醒或超时（如果提供了timeout参数的话）。当线程被唤醒并重新占有琐的时候，程序才会继续执行下去。
                CONDITION.wait()
                print("Constomer have comsumed something")
            product = random.choice(products)
            SHARE_Q.append(product)
            print("Producer: "+ str(product))
            # 唤醒一个挂起的线程（如果存在挂起的线程）。注意：notify()方法不会释放所占用的琐。
            CONDITION.notify()
            CONDITION.release()
            time.sleep(random.random())

class Constumer(threading.Thread):
    def run(self):
        global SHARE_Q
        while True:
            CONDITION.acquire()
            if not SHARE_Q:
                print("Queue is Empty...")
                CONDITION.wait()
                print("Producer have producted ")
            product = SHARE_Q.pop(0)
            print("Costomer: " + str(product))
            CONDITION.notify()
            CONDITION.release()
            time.sleep(random.random())

def main():
    producer = Producer()
    constumer = Constumer()
    producer.start()
    constumer.start()

if __name__ == '__main__':
    main()
