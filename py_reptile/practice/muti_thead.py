# python多线程编程
# -*- coding:utf-8 -*-
import threading
import time

def test_thread(count) :
    while count > 0 :
        print ("count = %d" % count)
        count = count - 1
        time.sleep(1)

def main() :
    my_thread = threading.Thread(target = test_thread, args = (10, ))
    my_thread.start()
    my_thread.join()

if __name__ == '__main__':
    main()
